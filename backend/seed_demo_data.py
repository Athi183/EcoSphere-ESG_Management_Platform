import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Add the backend directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import SessionLocal, engine, Base
import app.models  # Ensure models are loaded
from app.models.user import User, UserRole
from app.models.department import Department, DepartmentStatus
from app.models.category import Category, CategoryType, CategoryStatus
from app.models.emission_factor import EmissionFactor, EmissionFactorStatus
from app.models.carbon_transaction import CarbonTransaction
from app.models.policy import ESGPolicy, PolicyStatus
from app.models.csr_activity import CSRActivity, CSRActivityStatus
from app.models.challenge import Challenge, ChallengeDifficulty, ChallengeStatus
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_demo_data():
    print("Clearing existing data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("- Tables reset successfully.")

    db = SessionLocal()

    try:
        # ==========================================
        # USERS
        # ==========================================
        print("Creating Users...")
        admin = User(
            full_name="Admin User",
            email="admin@ecosphere.com",
            password_hash=get_password_hash("Admin@123"),
            role=UserRole.admin
        )
        db.add(admin)

        employees = [
            ("John Doe", "john.doe@ecosphere.com"),
            ("Sarah Wilson", "sarah.wilson@ecosphere.com"),
            ("Michael Chen", "michael.chen@ecosphere.com"),
            ("Priya Nair", "priya.nair@ecosphere.com"),
            ("Ahmed Hassan", "ahmed.hassan@ecosphere.com")
        ]
        
        db_employees = []
        for name, email in employees:
            emp = User(
                full_name=name,
                email=email,
                password_hash=get_password_hash("Employee@123"),
                role=UserRole.employee
            )
            db.add(emp)
            db_employees.append(emp)
        
        db.commit()
        print(f"- Created 1 Admin and {len(employees)} Employees")

        # ==========================================
        # DEPARTMENTS
        # ==========================================
        print("Creating Departments...")
        depts_data = [
            ("Operations", 150),
            ("Manufacturing", 300),
            ("Finance", 45),
            ("Human Resources", 25),
            ("Information Technology", 80),
            ("Procurement", 35),
            ("Logistics", 120),
            ("Corporate", 50)
        ]
        
        db_depts = []
        for name, count in depts_data:
            dept = Department(
                name=name,
                code=name[:3].upper(),
                employee_count=count,
                status=DepartmentStatus.ACTIVE
            )
            db.add(dept)
            db_depts.append(dept)
            
        db.commit()
        print(f"- Created {len(depts_data)} Departments")

        # ==========================================
        # EMISSION FACTORS
        # ==========================================
        print("Creating Emission Factors...")
        ef_data = [
            ("Electricity (Grid)", "kWh", 0.5),
            ("Diesel Generator", "Liters", 2.68),
            ("Business Flight (Short Haul)", "km", 0.15),
            ("Petrol Vehicle (Company Fleet)", "Liters", 2.31),
            ("Natural Gas (Heating)", "Cubic Meters", 2.02),
            ("Water Supply", "Cubic Meters", 0.344),
            ("Waste Disposal (Landfill)", "kg", 0.58),
            ("Paper Consumption", "kg", 0.95)
        ]
        
        db_efs = []
        for source, unit, factor in ef_data:
            ef = EmissionFactor(
                source_name=source,
                unit=unit,
                emission_factor=factor,
                status=EmissionFactorStatus.ACTIVE
            )
            db.add(ef)
            db_efs.append(ef)
            
        db.commit()
        print(f"- Created {len(ef_data)} Emission Factors")

        # ==========================================
        # CATEGORIES
        # ==========================================
        print("Creating Categories...")
        csr_cat_names = ["Community Service", "Tree Plantation", "Education", "Health", "Environment"]
        chal_cat_names = ["Waste Reduction", "Energy Saving", "Green Commute", "Paperless Office", "Recycling"]
        
        db_csr_cats = []
        for name in csr_cat_names:
            cat = Category(name=name, type=CategoryType.CSR_ACTIVITY, status=CategoryStatus.ACTIVE)
            db.add(cat)
            db_csr_cats.append(cat)
            
        db_chal_cats = []
        for name in chal_cat_names:
            cat = Category(name=name, type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE)
            db.add(cat)
            db_chal_cats.append(cat)
            
        db.commit()
        print(f"- Created {len(csr_cat_names) + len(chal_cat_names)} Categories")

        # ==========================================
        # POLICIES
        # ==========================================
        print("Creating Policies...")
        policies_data = [
            ("Environmental Sustainability Policy", PolicyStatus.ACTIVE),
            ("Waste Management Protocol", PolicyStatus.ACTIVE),
            ("Corporate Code of Conduct", PolicyStatus.ACTIVE),
            ("Anti-Bribery and Corruption Policy", PolicyStatus.ARCHIVED),
            ("Energy Conservation Guidelines", PolicyStatus.DRAFT),
            ("Data Privacy and Ethics Policy", PolicyStatus.ACTIVE)
        ]
        
        for title, status in policies_data:
            pol = ESGPolicy(
                title=title,
                description=f"This is the official document for {title}. It outlines the primary objectives, responsibilities, and key performance indicators required to maintain compliance.",
                version="1.0",
                effective_date=datetime.now(timezone.utc).date(),
                status=status
            )
            db.add(pol)
            
        db.commit()
        print(f"- Created {len(policies_data)} Policies")

        # ==========================================
        # CSR ACTIVITIES
        # ==========================================
        print("Creating CSR Activities...")
        now = datetime.now(timezone.utc)
        csr_activities_data = [
            ("Coastal Beach Cleanup Drive", CSRActivityStatus.COMPLETED, 1),
            ("Reforestation: 1000 Trees in Valley", CSRActivityStatus.ONGOING, 2),
            ("Tech Mentorship for Underprivileged Youth", CSRActivityStatus.PLANNED, 1),
            ("Free Medical Camp in Rural Area", CSRActivityStatus.COMPLETED, -5),
            ("Office Plastic Eradication Week", CSRActivityStatus.CANCELLED, -2),
            ("Solar Panel Funding for Local School", CSRActivityStatus.PLANNED, 10),
            ("Community Park Revitalization", CSRActivityStatus.ONGOING, -1),
            ("Blood Donation Drive 2026", CSRActivityStatus.COMPLETED, -10),
            ("Zero Waste Workshop", CSRActivityStatus.COMPLETED, -15),
            ("Lake Water Purification Setup", CSRActivityStatus.PLANNED, 30),
            ("Winter Clothing Drive", CSRActivityStatus.CANCELLED, -30),
            ("Urban Farming Initiative", CSRActivityStatus.ONGOING, 0)
        ]
        
        for title, status, day_offset in csr_activities_data:
            act = CSRActivity(
                title=title,
                description=f"Detailed plan and execution strategy for {title}.",
                location="Main Campus",
                category_id=random.choice(db_csr_cats).id,
                activity_date=(now + timedelta(days=day_offset)).date(),
                status=status
            )
            db.add(act)
            
        db.commit()
        print(f"- Created {len(csr_activities_data)} CSR Activities")

        # ==========================================
        # CHALLENGES
        # ==========================================
        print("Creating Challenges...")
        challenges_data = [
            ("Zero Paper Week", ChallengeStatus.ACTIVE, ChallengeDifficulty.EASY, 50, 7),
            ("Cycle to Work Month", ChallengeStatus.ACTIVE, ChallengeDifficulty.HARD, 200, 30),
            ("No Single-Use Plastics", ChallengeStatus.UNDER_REVIEW, ChallengeDifficulty.MEDIUM, 100, 14),
            ("Energy Vampire Hunt", ChallengeStatus.COMPLETED, ChallengeDifficulty.EASY, 50, -5),
            ("Vegan Lunch Challenge", ChallengeStatus.ACTIVE, ChallengeDifficulty.MEDIUM, 100, 10),
            ("Public Transport Pioneer", ChallengeStatus.ACTIVE, ChallengeDifficulty.HARD, 200, 20),
            ("Office Recycling Champion", ChallengeStatus.ARCHIVED, ChallengeDifficulty.EASY, 50, -30),
            ("Staircase Climber", ChallengeStatus.DRAFT, ChallengeDifficulty.MEDIUM, 100, 15),
            ("Water Conservation Week", ChallengeStatus.ACTIVE, ChallengeDifficulty.EASY, 50, 5),
            ("E-Waste Collection Drive", ChallengeStatus.COMPLETED, ChallengeDifficulty.HARD, 200, -10),
            ("Plant a Desk Plant", ChallengeStatus.ACTIVE, ChallengeDifficulty.EASY, 50, 40),
            ("Sustainable Supplier Pitch", ChallengeStatus.UNDER_REVIEW, ChallengeDifficulty.HARD, 300, 50)
        ]
        
        for title, status, diff, xp, day_offset in challenges_data:
            chal = Challenge(
                title=title,
                description=f"Can you complete the {title} challenge? Earn {xp} XP!",
                category_id=random.choice(db_chal_cats).id,
                difficulty=diff,
                xp=xp,
                deadline=now + timedelta(days=day_offset),
                status=status
            )
            db.add(chal)
            
        db.commit()
        print(f"- Created {len(challenges_data)} Challenges")

        # ==========================================
        # CARBON TRANSACTIONS
        # ==========================================
        print("Creating Carbon Transactions...")
        
        # We want specific data patterns for the AI demo:
        # Operations: Highest (Heavy machinery, lots of electricity/diesel)
        # Manufacturing: Second Highest (Raw materials, logistics)
        # IT: Medium (Server power)
        # Corporate/HR/Finance: Low (Office lighting, paper)
        
        dept_map = {d.name: d for d in db_depts}
        ef_map = {e.source_name: e for e in db_efs}
        
        tx_specs = [
            # Operations (Highest)
            ("Operations", "Diesel Generator", 1500),
            ("Operations", "Diesel Generator", 2000),
            ("Operations", "Electricity (Grid)", 10000),
            ("Operations", "Electricity (Grid)", 12000),
            ("Operations", "Water Supply", 5000),
            ("Operations", "Petrol Vehicle (Company Fleet)", 800),
            
            # Manufacturing (Second)
            ("Manufacturing", "Electricity (Grid)", 8000),
            ("Manufacturing", "Electricity (Grid)", 9000),
            ("Manufacturing", "Diesel Generator", 1000),
            ("Manufacturing", "Water Supply", 8000),
            ("Manufacturing", "Waste Disposal (Landfill)", 2000),
            
            # Logistics
            ("Logistics", "Petrol Vehicle (Company Fleet)", 1500),
            ("Logistics", "Petrol Vehicle (Company Fleet)", 1600),
            ("Logistics", "Business Flight (Short Haul)", 5000),
            
            # IT (Medium)
            ("Information Technology", "Electricity (Grid)", 4000),
            ("Information Technology", "Electricity (Grid)", 4500),
            ("Information Technology", "Business Flight (Short Haul)", 1000),
            
            # Procurement / Finance / HR / Corporate (Low)
            ("Procurement", "Paper Consumption", 100),
            ("Procurement", "Electricity (Grid)", 500),
            ("Finance", "Paper Consumption", 200),
            ("Finance", "Business Flight (Short Haul)", 1200),
            ("Human Resources", "Paper Consumption", 50),
            ("Corporate", "Electricity (Grid)", 800),
            ("Corporate", "Business Flight (Short Haul)", 3000)
        ]
        
        # Multiply specs to get ~60 transactions with random variations
        transactions_created = 0
        for i in range(3): # repeat 3 times across different months
            for dept_name, source_name, base_qty in tx_specs:
                if transactions_created >= 60:
                    break
                    
                dept = dept_map.get(dept_name)
                ef = ef_map.get(source_name)
                
                # Add random noise +/- 20%
                qty = base_qty * random.uniform(0.8, 1.2)
                
                # Vary dates over the last 3 months
                days_ago = random.randint(1, 90)
                tx_date = now - timedelta(days=days_ago)
                
                calc_em = qty * ef.emission_factor
                
                tx = CarbonTransaction(
                    department_id=dept.id,
                    emission_factor_id=ef.id,
                    quantity=qty,
                    calculated_emission=calc_em,
                    transaction_date=tx_date,
                    remarks=f"Routine usage for {source_name} in {dept_name}"
                )
                db.add(tx)
                transactions_created += 1
                
        db.commit()
        print(f"- Created {transactions_created} Carbon Transactions")
        
        print("\n=============================================")
        print("🎉 Demo data seeded successfully!")
        print("=============================================")
        print("Login Credentials:")
        print("  Admin User: admin@ecosphere.com / Admin@123")
        print("  Employee: john.doe@ecosphere.com / Employee@123")
        print("=============================================\n")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
