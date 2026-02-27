import os
import google.generativeai as genai
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from collections import Counter

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI(title="Retail Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "retail_analytics.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


@app.get("/summary")
def get_summary():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events")
    rows = cursor.fetchall()

    total_events = len(rows)

    age_counts = Counter([row[0] for row in rows])
    emotion_counts = Counter([row[1] for row in rows if row[1] is not None])
    hour_counts = Counter([row[2][11:13] for row in rows])  # Extract hour

    most_common_age = age_counts.most_common(1)[0][0] if age_counts else None
    dominant_emotion = emotion_counts.most_common(1)[0][0] if emotion_counts else None
    peak_hour = hour_counts.most_common(1)[0][0] if hour_counts else None

    conn.close()

    return {
        "total_events": total_events,
        "most_common_age_group": most_common_age,
        "dominant_emotion": dominant_emotion,
        "peak_hour": peak_hour
    }


@app.get("/age-distribution")
def age_distribution():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT age_group FROM customer_events")
    rows = cursor.fetchall()

    conn.close()

    counts = Counter([row[0] for row in rows])
    return dict(counts)


@app.get("/emotion-distribution")
def emotion_distribution():
    conn = sqlite3.connect("retail_analytics.db")
    cursor = conn.cursor()

    query = """
    SELECT 
        strftime('%H', timestamp) as hour,
        emotion,
        COUNT(*) as count
    FROM customer_events
    WHERE emotion IS NOT NULL
    GROUP BY hour, emotion
    ORDER BY hour
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    result = {}

    for hour, emotion, count in rows:
        if hour not in result:
            result[hour] = {
                "hour": hour,
                "happy": 0,
                "neutral": 0,
                "sad": 0
            }

        result[hour][emotion] = count

    return list(result.values())


@app.get("/traffic")
def traffic():
    conn = sqlite3.connect("retail_analytics.db")
    cursor = conn.cursor()

    query = """
    SELECT 
        strftime('%H', timestamp) as hour,
        COUNT(*) as count
    FROM customer_events
    GROUP BY hour
    ORDER BY hour
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    return [{"hour": hour, "count": count} for hour, count in rows]

@app.get("/recent-detections")
def recent_detections():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    query = """
    SELECT id, age_group, emotion, confidence, zone, timestamp
    FROM customer_events
    ORDER BY timestamp DESC
    LIMIT 10
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "age": row[1],
            "emotion": row[2],
            "confidence": row[3],
            "zone": row[4],
            "time": row[5][11:19] if row[5] else None
        })

    return result

@app.get("/insights")
def generate_insights():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT age_group, emotion, timestamp FROM customer_events")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return []

    age_counts = Counter([r[0] for r in rows])
    emotion_counts = Counter([r[1] for r in rows if r[1]])
    hour_counts = Counter([r[2][11:13] for r in rows])

    insights = []

    # Peak traffic
    peak_hour = hour_counts.most_common(1)[0][0]
    insights.append({
        "title": "Peak Traffic Hour",
        "description": f"Highest visitor traffic at {peak_hour}:00",
        "metric": f"{peak_hour}:00",
        "type": "positive"
    })

    # Dominant age group
    top_age = age_counts.most_common(1)[0][0]
    insights.append({
        "title": "Dominant Age Group",
        "description": f"Most visitors belong to {top_age}",
        "metric": top_age,
        "type": "info"
    })

    # Dominant emotion
    top_emotion = emotion_counts.most_common(1)[0][0]
    insights.append({
        "title": "Dominant Emotion",
        "description": f"Most common emotion detected: {top_emotion}",
        "metric": top_emotion,
        "type": "warning"
    })

    return insights

@app.get("/ai-sales-advice")
def ai_sales_advice():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT age_group, emotion, zone, confidence
        FROM customer_events
        WHERE DATE(timestamp) = DATE('now')
    """)
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

    Data:
    {summary_data}

    Focus on:
    - Increasing conversion rate
    - Improving customer engagement
    - Optimizing product placement
    - Targeting dominant age group

    Keep it concise and professional.
    """

    response = model.generate_content(prompt)

    return {
        "summary": summary_data,
        "ai_recommendations": response.text
    }