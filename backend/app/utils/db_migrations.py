from sqlalchemy import text, inspect
from ..database import engine

def ensure_audio_column():
    """
    Ensure audio_url column exists in dictionaries table.
    Backwards compatibility for Railway deployment.
    """
    try:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('dictionaries')]
        
        if 'audio_url' not in columns:
            with engine.connect() as conn:
                conn.execute(text(
                    "ALTER TABLE dictionaries ADD COLUMN audio_url VARCHAR(255) NULL"
                ))
                conn.commit()
            print("✅ Added audio_url column to dictionaries table")
        else:
            print("✅ audio_url column already exists")
    except Exception as e:
        print(f"⚠️  Error checking/adding audio_url column: {e}")
        # Don't fail startup if this fails
