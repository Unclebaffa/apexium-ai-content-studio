import sqlite3
from datetime import datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATABASE_FILE = PROJECT_ROOT / "apexium_content.db"


def get_connection():
    """Create and return a database connection."""
    return sqlite3.connect(DATABASE_FILE)


def initialise_database():
    """Create the content table if it does not already exist."""

    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS content_generations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                tone TEXT NOT NULL,
                platform TEXT NOT NULL,
                model TEXT NOT NULL,
                content TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Draft',
                created_at TEXT NOT NULL
            )
            """
        )


def save_content(
    topic: str,
    tone: str,
    platform: str,
    model: str,
    content: str,
    status: str = "Draft",
):
    """Save generated content to the database."""

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO content_generations (
                topic,
                tone,
                platform,
                model,
                content,
                status,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                topic,
                tone,
                platform,
                model,
                content,
                status,
                created_at,
            ),
        )


def get_previous_generations():
    """Return all saved content, newest first."""

    with get_connection() as connection:
        connection.row_factory = sqlite3.Row

        records = connection.execute(
            """
            SELECT *
            FROM content_generations
            ORDER BY id DESC
            """
        ).fetchall()

    return [dict(record) for record in records]