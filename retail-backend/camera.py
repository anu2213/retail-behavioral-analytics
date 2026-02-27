from database import insert_event
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


def run_camera():
    # InsightFace setup inside the function
    insight_app = FaceAnalysis(allowed_modules=['detection', 'genderage'])
    insight_app.prepare(ctx_id=-1)  # -1 = CPU, change to 0 if you have a GPU

    cap = cv2.VideoCapture(0)

    last_prediction_time = 0
    prediction_interval = 2

    age = "0"
    emotion = "Detecting"
    age_history = []
    AGE_HISTORY_SIZE = 10

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        insight_faces = insight_app.get(frame)
        print("Faces detected:", len(insight_faces))
        for f in insight_faces:
         print("Raw age:", f.age)

        for face in insight_faces:
            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]

            face_h = y2 - y1
            face_w = x2 - x1
            if face_h < 80 or face_w < 80:
                continue

            face_img = get_padded_face(frame, x1, y1, x2, y2)

            if face_img.size == 0:
                continue

            current_time = time.time()

            if current_time - last_prediction_time > prediction_interval:
                predicted_age = face.age
                predicted_emotion, predicted_confidence = predict_emotion(face_img)

                print("DEBUG:", predicted_age, predicted_emotion, predicted_confidence)
                

                if predicted_age is not None:
                    age_history.append(predicted_age)
                    if len(age_history) > AGE_HISTORY_SIZE:
                        age_history.pop(0)
                    age = int(sum(age_history) / len(age_history))
                    if predicted_emotion is not None: 
                     emotion = predicted_emotion
                    age_group = get_age_group(age)

                    frame_height, frame_width, _ = frame.shape
                    face_center_x = x1 + (x2 - x1) // 2

                    if face_center_x < frame_width * 0.33:
                        zone = "Entrance"
                    elif face_center_x < frame_width * 0.66:
                        zone = "Aisle"
                    else:
                        zone = "Checkout"

                    insert_event(age_group, emotion, predicted_confidence, zone)

                last_prediction_time = current_time

            label = f"Age: {age} | Emotion: {emotion}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (0, 255, 0), 2)

        cv2.imshow("Retail Demographic Scanner", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()