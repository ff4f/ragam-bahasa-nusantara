import csv
import sys
import os

# Add backend directory to path to import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from app.database import SessionLocal, engine, Base
from app.models.dictionary import Dictionary

def seed_from_csv(csv_path):
    db = SessionLocal()
    try:
        print(f"Reading CSV from: {csv_path}")
        
        # NO DELETION - Smart Seed Logic
        
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            skipped = 0
            batch = []
            
            # Pre-fetch existing entries to minimize DB queries (optimization)
            # Get all source_text + target_text for this language
            existing_entries = db.query(Dictionary.source_text, Dictionary.target_text).filter(
                Dictionary.target_lang == "jv_ngapak"
            ).all()
            
            # Create a set for O(1) lookup: (source_text, target_text)
            existing_set = {(e.source_text.lower(), e.target_text.lower()) for e in existing_entries}
            
            for row in reader:
                source = row['Bahasa Indonesia'].strip()
                target = row['Bahasa Ngapak'].strip()
                
                # Check if exists in our set
                if (source.lower(), target.lower()) in existing_set:
                    skipped += 1
                    continue
                
                item = Dictionary(
                    source_text=source,
                    target_text=target,
                    source_lang="id",
                    target_lang="jv_ngapak", # Code for Javanese Ngapak
                    example_source=row['Contoh Kalimat (Bahasa Indonesia)'],
                    example_target=row['Contoh Kalimat (Bahasa Daerah)'],
                    category="word",
                    dialect=row['Dialek'],
                    region=row['Daerah']
                )
                batch.append(item)
                count += 1
                
                # Batch insert every 100 items
                if len(batch) >= 100:
                    db.add_all(batch)
                    db.commit()
                    batch = []
            
            # Insert remaining
            if batch:
                db.add_all(batch)
                db.commit()
                
            print(f"✅ Seed Complete: {count} new entries added, {skipped} skipped (already exists).")
            
    except Exception as e:
        print(f"❌ Error seeding CSV: {e}")
        db.rollback()
    finally:
        db.close()
            


def seed_ngapak():
    """Convenience function to seed Ngapak dictionary"""
    # Path relative to this file: ../data/ngapak.csv
    csv_path = os.path.join(os.path.dirname(__file__), "../data/ngapak.csv")
    seed_from_csv(csv_path)

if __name__ == "__main__":
    # Path to the CSV file
    csv_file_path = os.path.join(os.path.dirname(__file__), "../data/ngapak.csv")
    
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    seed_from_csv(csv_file_path)
