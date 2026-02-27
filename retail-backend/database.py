import sqlite3
from datetime import datetime

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
            engagement_time REAL
        )
    """)

    conn.commit()
    conn.close()


def insert_event(age_group, emotion=None, confidence=None, zone=None, engagement_time=None):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO customer_events 
        (timestamp, age_group, emotion, confidence, zone, engagement_time)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (timestamp, age_group, emotion, confidence, zone, engagement_time))

    conn.commit()
    conn.close()