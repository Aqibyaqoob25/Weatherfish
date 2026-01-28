"""
Database Migration Script
Adds new columns (cities, zipcodes, language) to existing User table for daily report functionality.
"""

import sqlite3
import os
import sys

def migrate_database():
    """Add new columns to the users table if they don't exist."""
    
    # Get the project root (two levels up from migrations/)
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    db_path = os.path.join(project_root, 'data', 'database', 'weatherfish.db')
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        print("No migration needed - tables will be created on first run.")
        return True
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(users)")
        existing_columns = {row[1] for row in cursor.fetchall()}
        
        print(f"Existing columns: {existing_columns}")
        
        # Add cities column if it doesn't exist
        if 'cities' not in existing_columns:
            print("Adding 'cities' column...")
            cursor.execute("ALTER TABLE users ADD COLUMN cities TEXT")
            print("✓ Added 'cities' column")
        
        # Add zipcodes column if it doesn't exist
        if 'zipcodes' not in existing_columns:
            print("Adding 'zipcodes' column...")
            cursor.execute("ALTER TABLE users ADD COLUMN zipcodes TEXT")
            print("✓ Added 'zipcodes' column")
        
        # Add language column if it doesn't exist
        if 'language' not in existing_columns:
            print("Adding 'language' column...")
            cursor.execute("ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'de'")
            print("✓ Added 'language' column")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Database migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = migrate_database()
    sys.exit(0 if success else 1)
