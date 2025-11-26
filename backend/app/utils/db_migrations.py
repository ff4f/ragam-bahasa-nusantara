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

def ensure_user_gamification_columns():
    """
    Ensure gamification columns exist in users table.
    Backwards compatibility for Railway deployment.
    """
    try:
        inspector = inspect(engine)
        # Check if users table exists first
        if not inspector.has_table("users"):
            print("⚠️  Users table does not exist yet, skipping column check")
            return

        columns = [col['name'] for col in inspector.get_columns('users')]
        
        with engine.connect() as conn:
            if 'points' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN points INTEGER NOT NULL DEFAULT 0 COMMENT 'User points for contributions and activities'"))
                print("✅ Added points column to users table")
            
            if 'coins' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN coins INTEGER NOT NULL DEFAULT 0 COMMENT 'Virtual currency for rewards'"))
                print("✅ Added coins column to users table")
                
            if 'level' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN level INTEGER NOT NULL DEFAULT 1 COMMENT 'User level based on XP/points'"))
                print("✅ Added level column to users table")
                
            if 'badges' not in columns:
                # JSON type in MySQL
                conn.execute(text("ALTER TABLE users ADD COLUMN badges JSON COMMENT 'Array of earned badges'"))
                print("✅ Added badges column to users table")
                
            conn.commit()
            
    except Exception as e:
        print(f"⚠️  Error checking/adding user gamification columns: {e}")

