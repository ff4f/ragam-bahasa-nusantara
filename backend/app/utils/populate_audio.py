import os
import glob
from typing import Optional
import pymysql

def get_audio_url(entry_id: int, target_text: str) -> Optional[str]:
    """Find audio file for dictionary entry using strict naming convention"""
    # Get project root (parent of backend dir)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, "../../../"))
    audio_dir = os.path.join(project_root, "public/audio")
    
    # Sanitize target_text to match filename format
    safe_word = target_text.lower().replace(' ', '-').replace('/', '-')
    
    # New naming pattern: [ID]_[word]_[timestamp].m4a
    pattern = f"{audio_dir}/{entry_id}_{safe_word}_*.m4a"
    matches = glob.glob(pattern)
    if matches:
        # Return relative URL path for frontend
        return f"/audio/{os.path.basename(matches[0])}"
    return None

def populate_audio_urls():
    """Populate audio_url field for all existing dictionary entries"""
    conn = pymysql.connect(
        host="localhost",
        user="rbnuser",
        password="devpassword123",
        database="ragam_bahasa_db"
    )
    
    try:
        with conn.cursor() as cursor:
            # Get all entry IDs and target_text
            cursor.execute("SELECT id, target_text FROM dictionaries")
            entries = cursor.fetchall()
            updated_count = 0
            
            for (entry_id, target_text) in entries:
                audio_url = get_audio_url(entry_id, target_text)
                if audio_url:
                    cursor.execute(
                        "UPDATE dictionaries SET audio_url = %s WHERE id = %s",
                        (audio_url, entry_id)
                    )
                    updated_count += 1
            
            conn.commit()
            print(f"✅ Updated {updated_count} entries with audio URLs")
        
    except Exception as e:
        print(f"❌ Error populating audio URLs: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    populate_audio_urls()

