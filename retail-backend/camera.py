from database import insert_event, create_session
from deepface import DeepFace
from insightface.app import FaceAnalysis
import cv2
import time


def get_padded_face(frame, x1, y1, x2, y2, padding=30):
    h, w = frame.shape[:2]
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(w, x2 + padding)
    y2 = min(h, y2 + padding)
    return frame[y1:y2, x1:x2]


def predict_emotion(face_img):
    try:
        result = DeepFace.analyze(
            face_img,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv',
        )
        emotions = result[0]['emotion']
        emotion = max(emotions, key=emotions.get)
        confidence = float(emotions[emotion])
        return emotion, confidence
    except Exception as e:
        print("DeepFace error:", e)
        return None, None


def get_age_group(age):
    age = int(age)
    if age <= 18:
        return "0-18"
    elif age <= 25:
        return "18-25"
    elif age <= 40:
        return "25-40"
    elif age <= 60:
        return "40-60"
    else:
        return "60+"


def run_camera(source=0, session_id=None):
    insight_app = FaceAnalysis(allowed_modules=['detection', 'genderage'])
    insight_app.prepare(ctx_id=-1)

    cap = cv2.VideoCapture(source)
    print(f"Session started: {session_id}")

    is_video_file = isinstance(source, str)
    frame_skip = 10 if is_video_file else 3
    frame_count = 0
    last_prediction_time = 0
    prediction_interval = 3

    age_buffer = []
    AGE_BUFFER_SIZE = 5

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % frame_skip != 0:
            continue

        frame = cv2.resize(frame, (640, 360))
        insight_faces = insight_app.get(frame)
        print("Faces detected:", len(insight_faces))

        current_time = time.time()
        should_predict = current_time - last_prediction_time > prediction_interval

        for face in insight_faces:
            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]

            face_h = y2 - y1
            face_w = x2 - x1
            if face_h < 50 or face_w < 50:
                continue

            face_img = get_padded_face(frame, x1, y1, x2, y2)
            if face_img.size == 0:
                continue

            raw_age = face.age
            age_buffer.append(raw_age)
            if len(age_buffer) > AGE_BUFFER_SIZE:
                age_buffer.pop(0)
            smoothed_age = int(sum(age_buffer) / len(age_buffer))
            age_group = get_age_group(smoothed_age)

            predicted_emotion = None
            predicted_confidence = None

            if should_predict:
                predicted_emotion, predicted_confidence = predict_emotion(face_img)
                print("DEBUG:", smoothed_age, predicted_emotion, predicted_confidence)

                if predicted_emotion is not None:
                    frame_height, frame_width, _ = frame.shape
                    face_center_x = x1 + (x2 - x1) // 2

                    if face_center_x < frame_width * 0.33:
                        zone = "Entrance"
                    elif face_center_x < frame_width * 0.66:
                        zone = "Aisle"
                    else:
                        zone = "Checkout"

                    insert_event(age_group, predicted_emotion, predicted_confidence, zone, session_id=session_id)

            label = f"Age: {smoothed_age} ({age_group}) | Emotion: {predicted_emotion or 'detecting'}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6, (0, 255, 0), 2)

        if should_predict and insight_faces:
            last_prediction_time = current_time

        cv2.imshow("Retail Demographic Scanner", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()