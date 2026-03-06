import os
import cv2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from collections import Counter
from groq import Groq
import threading
import shutil
from database import insert_event, create_session, get_all_sessions, init_db
from fastapi.responses import StreamingResponse
import time
from camera import get_padded_face, get_age_group
from insightface.app import FaceAnalysis
from deepface import DeepFace


load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(title="Retail Analytics API")
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "retail_analytics.db"
camera_thread = None
current_session_id = None
processing_complete = False


def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10)


@app.get("/summary")
def get_summary(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events WHERE session_id = ?", (session_id,))
    else:
        cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events")
    rows = cursor.fetchall()
    conn.close()

    total_events = len(rows)
    age_counts = Counter([row[0] for row in rows])
    emotion_counts = Counter([row[1] for row in rows if row[1] is not None])
    hour_counts = Counter([row[2][11:13] for row in rows])

    return {
        "total_events": total_events,
        "most_common_age_group": age_counts.most_common(1)[0][0] if age_counts else None,
        "dominant_emotion": emotion_counts.most_common(1)[0][0] if emotion_counts else None,
        "peak_hour": hour_counts.most_common(1)[0][0] if hour_counts else None
    }


@app.get("/age-distribution")
def age_distribution(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT age_group FROM customer_events WHERE session_id = ?", (session_id,))
    else:
        cursor.execute("SELECT age_group FROM customer_events")
    rows = cursor.fetchall()
    conn.close()
    counts = Counter([row[0] for row in rows])
    return dict(counts)


@app.get("/emotion-distribution")
def emotion_distribution(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("""
            SELECT strftime('%H', timestamp) as hour, emotion, COUNT(*) as count
            FROM customer_events
            WHERE emotion IS NOT NULL AND session_id = ?
            GROUP BY hour, emotion
            ORDER BY hour
        """, (session_id,))
    else:
        cursor.execute("""
            SELECT strftime('%H', timestamp) as hour, emotion, COUNT(*) as count
            FROM customer_events
            WHERE emotion IS NOT NULL
            GROUP BY hour, emotion
            ORDER BY hour
        """)
    rows = cursor.fetchall()
    conn.close()

    result = {}
    for hour, emotion, count in rows:
        if hour not in result:
            result[hour] = {"hour": hour, "happy": 0, "neutral": 0, "sad": 0}
        result[hour][emotion] = count
    return list(result.values())


@app.get("/traffic")
def traffic(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("""
            SELECT strftime('%H', timestamp) as hour, COUNT(*) as count
            FROM customer_events
            WHERE session_id = ?
            GROUP BY hour ORDER BY hour
        """, (session_id,))
    else:
        cursor.execute("""
            SELECT strftime('%H', timestamp) as hour, COUNT(*) as count
            FROM customer_events
            GROUP BY hour ORDER BY hour
        """)
    rows = cursor.fetchall()
    conn.close()
    return [{"hour": hour, "count": count} for hour, count in rows]


@app.get("/recent-detections")
def recent_detections(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("""
            SELECT id, age_group, emotion, confidence, zone, timestamp
            FROM customer_events WHERE session_id = ?
            ORDER BY timestamp DESC LIMIT 10
        """, (session_id,))
    else:
        cursor.execute("""
            SELECT id, age_group, emotion, confidence, zone, timestamp
            FROM customer_events
            ORDER BY timestamp DESC LIMIT 10
        """)
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": row[0], "age": row[1], "emotion": row[2],
        "confidence": row[3], "zone": row[4],
        "time": row[5][11:19] if row[5] else None
    } for row in rows]


@app.get("/insights")
def generate_insights(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events WHERE session_id = ?", (session_id,))
    else:
        cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return []

    age_counts = Counter([r[0] for r in rows])
    emotion_counts = Counter([r[1] for r in rows if r[1]])
    hour_counts = Counter([r[2][11:13] for r in rows])

    return [
        {"title": "Peak Traffic Hour", "description": f"Highest visitor traffic at {hour_counts.most_common(1)[0][0]}:00", "metric": f"{hour_counts.most_common(1)[0][0]}:00", "type": "positive"},
        {"title": "Dominant Age Group", "description": f"Most visitors belong to {age_counts.most_common(1)[0][0]}", "metric": age_counts.most_common(1)[0][0], "type": "info"},
        {"title": "Dominant Emotion", "description": f"Most common emotion detected: {emotion_counts.most_common(1)[0][0]}", "metric": emotion_counts.most_common(1)[0][0], "type": "warning"},
    ]


@app.get("/ai-sales-advice")
def ai_sales_advice(session_id: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT age_group, emotion, zone, confidence FROM customer_events WHERE session_id = ?", (session_id,))
    else:
        cursor.execute("SELECT age_group, emotion, zone, confidence FROM customer_events")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"ai_recommendations": "No data available for today."}

    total = len(rows)
    age_counts = Counter([r[0] for r in rows])
    emotion_counts = Counter([r[1] for r in rows if r[1]])
    zone_counts = Counter([r[2] for r in rows if r[2]])

    summary_data = {
        "total_visitors": total,
        "dominant_age_group": age_counts.most_common(1)[0][0],
        "dominant_emotion": emotion_counts.most_common(1)[0][0],
        "most_active_zone": zone_counts.most_common(1)[0][0],
        "emotion_distribution": dict(emotion_counts),
        "zone_distribution": dict(zone_counts),
    }

    prompt = f"""
    You are a retail business intelligence consultant.
    Based on the following store analytics data, generate 3 short,
    practical, actionable recommendations to help improve sales.
    Data: {summary_data}
    Focus on: Increasing conversion rate, Improving customer engagement,
    Optimizing product placement, Targeting dominant age group.
    Keep it concise and professional.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return {"summary": summary_data, "ai_recommendations": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/start-camera")
def start_camera():
    global camera_thread
    if camera_thread and camera_thread.is_alive():
        return {"status": "already running"}

    session_id = create_session(source="camera")
    print(f"New session created: {session_id}")

    from camera import run_camera
    camera_thread = threading.Thread(target=run_camera, args=(0, session_id), daemon=True)
    camera_thread.start()
    return {"status": "started", "session_id": session_id}


@app.post("/stop-camera")
def stop_camera():
    return {"status": "stopped"}


@app.delete("/clear-data")
def clear_data():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customer_events")
    conn.commit()
    conn.close()
    return {"status": "success", "message": "All data cleared"}


@app.get("/sessions")
def get_sessions():
    return get_all_sessions()


@app.get("/latest-session")
def get_latest_session():
    sessions = get_all_sessions()
    if not sessions:
        return {"id": None}
    return sessions[0]

def generate_frames(video_path: str, session_id: str):
    global processing_complete
    processing_complete = False

    

    insight_app = FaceAnalysis(allowed_modules=['detection', 'genderage'])
    insight_app.prepare(ctx_id=-1)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_count = 0
    frame_skip = 10
    last_prediction_time = 0
    prediction_interval = 3
    age_buffer = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        frame = cv2.resize(frame, (640, 360))

        if frame_count % frame_skip == 0:
            insight_faces = insight_app.get(frame)

            current_time = time.time()
            should_predict = current_time - last_prediction_time > prediction_interval

            for face in insight_faces:
                bbox = face.bbox.astype(int)
                x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]

                if (y2 - y1) < 50 or (x2 - x1) < 50:
                    continue

                raw_age = face.age
                age_buffer.append(raw_age)
                if len(age_buffer) > 5:
                    age_buffer.pop(0)
                smoothed_age = int(sum(age_buffer) / len(age_buffer))
                age_group = get_age_group(smoothed_age)

                predicted_emotion = None
                predicted_confidence = None

                if should_predict:
                    face_img = get_padded_face(frame, x1, y1, x2, y2)
                    if face_img.size > 0:
                        try:
                            result = DeepFace.analyze(face_img, actions=['emotion'], enforce_detection=False, detector_backend='opencv')
                            emotions = result[0]['emotion']
                            predicted_emotion = max(emotions, key=emotions.get)
                            predicted_confidence = float(emotions[predicted_emotion])

                            face_center_x = x1 + (x2 - x1) // 2
                            frame_width = frame.shape[1]
                            if face_center_x < frame_width * 0.33:
                                zone = "Entrance"
                            elif face_center_x < frame_width * 0.66:
                                zone = "Aisle"
                            else:
                                zone = "Checkout"

                            insert_event(age_group, predicted_emotion, predicted_confidence, zone, session_id=session_id)
                        except:
                            pass

                if should_predict:
                    last_prediction_time = current_time

                # Draw bounding box and label
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 180), 2)
                label = f"{age_group} | {predicted_emotion or 'detecting'}"
                cv2.putText(frame, label, (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 180), 2)

        # Draw progress bar on frame
        progress = int((frame_count / total_frames) * 100) if total_frames > 0 else 0
        bar_width = int((frame.shape[1] - 20) * progress / 100)
        cv2.rectangle(frame, (10, frame.shape[0] - 20), (frame.shape[1] - 10, frame.shape[0] - 10), (50, 50, 50), -1)
        cv2.rectangle(frame, (10, frame.shape[0] - 20), (10 + bar_width, frame.shape[0] - 10), (0, 255, 180), -1)
        cv2.putText(frame, f"{progress}%", (frame.shape[1] - 50, frame.shape[0] - 12),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()
    processing_complete = True
    if os.path.exists(video_path):
        os.remove(video_path)

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    global current_session_id, processing_complete
    processing_complete = False

    # File size validation (500MB)
    max_size = 500 * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 500MB.")

    # Write file once
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(contents)

    session_id = create_session(source="video")
    current_session_id = session_id
    print(f"New session created: {session_id}")

    return {"status": "success", "session_id": session_id, "video_path": temp_path}


@app.get("/video-feed/{video_path:path}")
def video_feed(video_path: str, session_id: str):
    return StreamingResponse(
        generate_frames(video_path, session_id),
        media_type="multipart/x-mixed-replace;boundary=frame"
    )


@app.get("/processing-status")
def processing_status():
    return {"complete": processing_complete, "session_id": current_session_id}
@app.get("/export-report/{session_id}")
def export_report(session_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT age_group, emotion, confidence, zone, timestamp FROM customer_events WHERE session_id = ?", (session_id,))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No data for this session")

    age_counts = Counter([r[0] for r in rows])
    emotion_counts = Counter([r[1] for r in rows if r[1]])
    zone_counts = Counter([r[3] for r in rows if r[3]])

    report = {
        "session_id": session_id,
        "total_events": len(rows),
        "age_distribution": dict(age_counts),
        "emotion_distribution": dict(emotion_counts),
        "zone_distribution": dict(zone_counts),
        "dominant_age_group": age_counts.most_common(1)[0][0] if age_counts else None,
        "dominant_emotion": emotion_counts.most_common(1)[0][0] if emotion_counts else None,
        "most_active_zone": zone_counts.most_common(1)[0][0] if zone_counts else None,
    }

    return report