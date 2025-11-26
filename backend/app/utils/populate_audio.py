import os
import glob
from typing import Optional
from sqlalchemy import text
from ..database import engine

def get_audio_url(entry_id: int, target_text: str) -> Optional[str]:
    """Find audio file for dictionary entry using strict naming convention"""
    # Get project root (parent of backend dir)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, "../../../"))
    audio_dir = os.path.join(project_root, "public/audio")
    
    # DEBUG: Print paths to debug Railway issue
    if entry_id == 1:
        print(f"🔍 Debug Path Resolution:")
        print(f"   Script Dir: {script_dir}")
        print(f"   Project Root: {project_root}")
        print(f"   Audio Dir: {audio_dir}")
        print(f"   Audio Dir Exists? {os.path.exists(audio_dir)}")
        if os.path.exists(audio_dir):
            print(f"   Files in Audio Dir: {len(os.listdir(audio_dir))}")
            print(f"   First 3 files: {os.listdir(audio_dir)[:3]}")

    
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
    
    try:
        with engine.connect() as conn:
            # Get all entries
            result = conn.execute(text("SELECT id, target_text FROM dictionaries"))
            entries = result.fetchall()
            updated_count = 0
            
            for row in entries:
                entry_id = row[0]
                target_text = row[1]
                audio_url = get_audio_url(entry_id, target_text)
                
                if audio_url:
                    # Update using SQL
                    conn.execute(
                        text("UPDATE dictionaries SET audio_url = :audio_url WHERE id = :id"),
                        {"audio_url": audio_url, "id": entry_id}
                    )
                    updated_count += 1
            
            conn.commit()
            print(f"✅ Updated {updated_count} entries with audio URLs")
        
    except Exception as e:
        print(f"❌ Error populating audio URLs: {e}")
        raise

if __name__ == "__main__":
    populate_audio_urls()


