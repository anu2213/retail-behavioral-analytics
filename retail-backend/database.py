import sqlite3
from datetime import datetime
import uuid

DB_NAME = "retail_analytics.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customer_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            age_group TEXT,
            emotion TEXT,
            confidence REAL,
            zone TEXT,
            engagement_time REAL,
            session_id TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            name TEXT,
            created_at TEXT,
            source TEXT
        )
    """)

    conn.commit()
    conn.close()


def create_session(source="video"):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    session_id = str(uuid.uuid4())[:8]  # short unique ID e.g. "a1b2c3d4"
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    name = f"Session {created_at}"

    cursor.execute("""
        INSERT INTO sessions (id, name, created_at, source)
        VALUES (?, ?, ?, ?)
    """, (session_id, name, created_at, source))

    conn.commit()
    conn.close()

    return session_id


def insert_event(age_group, emotion=None, confidence=None, zone=None, engagement_time=None, session_id=None):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO customer_events 
        (timestamp, age_group, emotion, confidence, zone, engagement_time, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (timestamp, age_group, emotion, confidence, zone, engagement_time, session_id))

    conn.commit()
    conn.close()


def get_all_sessions():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT s.id, s.name, s.created_at, s.source, COUNT(e.id) as total_events
        FROM sessions s
        LEFT JOIN customer_events e ON e.session_id = s.id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "created_at": row[2],
            "source": row[3],
            "total_events": row[4]
        }
        for row in rows
    ]