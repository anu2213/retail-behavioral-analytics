import sqlite3
import pandas as pd

DB_NAME = "retail_analytics.db"

def load_data():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql_query("SELECT * FROM customer_events", conn)
    conn.close()
    return df

def age_distribution():
    df = load_data()
    return df['age_group'].value_counts()

def customers_per_hour():
    df = load_data()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    return df['hour'].value_counts().sort_index()