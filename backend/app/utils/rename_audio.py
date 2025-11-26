import os
import pymysql
from typing import Optional

def rename_audio_files():
    """Rename audio files to strict naming convention: [ID]_[word]_[timestamp].m4a"""
    
    # Connect to database
    conn = pymysql.connect(
        host="localhost",
        user="rbnuser",
        password="devpassword123",
        database="ragam_bahasa_db"
    )
    
    # Get project root (3 levels up from this script)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, "../../../"))
    audio_dir = os.path.join(project_root, "public/audio")
    
    print(f"📂 Audio directory: {audio_dir}")
    
    try:
        with conn.cursor() as cursor:
            # Get all entries with audio URLs
            cursor.execute("""
                SELECT id, target_text, audio_url 
                FROM dictionaries 
                WHERE audio_url IS NOT NULL 
                ORDER BY id
            """)
            entries = cursor.fetchall()
            
            renamed_count = 0
            
            for entry_id, target_text, current_url in entries:
                # Extract current filename
                # Current: /audio/1_20251126-083605.m4a
                current_filename = os.path.basename(current_url)
                current_path = os.path.join(audio_dir, current_filename)
                
                # Check if file exists
                if not os.path.exists(current_path):
                    print(f"⚠️  File not found: {current_path}")
                    continue
                
                # Extract timestamp from current filename
                # Format: ID_TIMESTAMP.m4a -> extract TIMESTAMP
                parts = current_filename.replace('.m4a', '').split('_')
                if len(parts) >= 2:
                    timestamp = '_'.join(parts[1:])  # Everything after ID
                else:
                    timestamp = "unknown"
                
                # Create new filename: [ID]_[word]_[timestamp].m4a
                # Sanitize target_text (remove spaces, special chars)
                safe_word = target_text.lower().replace(' ', '-').replace('/', '-')
                new_filename = f"{entry_id}_{safe_word}_{timestamp}.m4a"
                new_path = os.path.join(audio_dir, new_filename)
                new_url = f"/audio/{new_filename}"
                
                # Skip if already in correct format
                if current_path == new_path:
                    print(f"✅ Already correct: {new_filename}")
                    continue
                
                # Rename file
                os.rename(current_path, new_path)
                
                # Update database
                cursor.execute(
                    "UPDATE dictionaries SET audio_url = %s WHERE id = %s",
                    (new_url, entry_id)
                )
                
                renamed_count += 1
                print(f"✅ Renamed: {current_filename} → {new_filename}")
            
            conn.commit()
            print(f"\n🎉 Renamed {renamed_count} audio files successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    rename_audio_files()
