import sqlite3
import os

db_path = 'ecosphere.db'
if not os.path.exists(db_path):
    print(f"Database {db_path} does not exist!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print(f"Tables in {db_path}:")
for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f" - {table}: {count} rows")

print("\n--- Users ---")
cursor.execute("SELECT id, email, full_name, role FROM users;")
for row in cursor.fetchall():
    print(row)

print("\n--- Departments ---")
cursor.execute("SELECT id, name, code, status FROM departments;")
for row in cursor.fetchall():
    print(row)

print("\n--- Emission Factors ---")
cursor.execute("SELECT id, source_name, emission_factor, unit, status FROM emission_factors;")
for row in cursor.fetchall():
    print(row)

conn.close()
