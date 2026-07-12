import datetime
from app.database.database import SessionLocal
from app.models.user import User, UserRole
from app.models.department import Department, DepartmentStatus
from app.models.category import Category, CategoryType, CategoryStatus
from app.models.emission_factor import EmissionFactor, EmissionFactorStatus
from app.models.carbon_transaction import CarbonTransaction
from app.models.policy import ESGPolicy, PolicyStatus
from app.models.csr_activity import CSRActivity, CSRActivityStatus
from app.models.challenge import Challenge, ChallengeDifficulty, ChallengeStatus

db = SessionLocal()
try:
    # 1. Departments
    depts = [
        Department(name="Engineering", code="ENG", head_name="Alice Vance", employee_count=45, status=DepartmentStatus.ACTIVE),
        Department(name="Sales & Marketing", code="MKT", head_name="Bob Dylan", employee_count=30, status=DepartmentStatus.ACTIVE),
        Department(name="Operations", code="OPS", head_name="Charlie Brown", employee_count=65, status=DepartmentStatus.ACTIVE),
        Department(name="Human Resources", code="HR", head_name="Diana Prince", employee_count=12, status=DepartmentStatus.ACTIVE),
    ]
    for d in depts:
        existing = db.query(Department).filter(Department.code == d.code).first()
        if not existing:
            db.add(d)
    db.commit()
    print("Departments seeded.")

    # Fetch departments for IDs
    eng_dept = db.query(Department).filter(Department.code == "ENG").first()
    mkt_dept = db.query(Department).filter(Department.code == "MKT").first()
    ops_dept = db.query(Department).filter(Department.code == "OPS").first()
    hr_dept = db.query(Department).filter(Department.code == "HR").first()

    # 2. Categories
    categories = [
        Category(name="Environmental Cleaning", type=CategoryType.CSR_ACTIVITY, status=CategoryStatus.ACTIVE),
        Category(name="Community Service", type=CategoryType.CSR_ACTIVITY, status=CategoryStatus.ACTIVE),
        Category(name="Carbon Reduction", type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE),
        Category(name="Energy Saving", type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE),
        Category(name="Waste Free", type=CategoryType.CHALLENGE, status=CategoryStatus.ACTIVE),
    ]
    for cat in categories:
        existing = db.query(Category).filter(Category.name == cat.name, Category.type == cat.type).first()
        if not existing:
            db.add(cat)
    db.commit()
    print("Categories seeded.")

    # Fetch categories
    env_clean_cat = db.query(Category).filter(Category.name == "Environmental Cleaning", Category.type == CategoryType.CSR_ACTIVITY).first()
    comm_srv_cat = db.query(Category).filter(Category.name == "Community Service", Category.type == CategoryType.CSR_ACTIVITY).first()
    carb_red_cat = db.query(Category).filter(Category.name == "Carbon Reduction", Category.type == CategoryType.CHALLENGE).first()
    nrg_svg_cat = db.query(Category).filter(Category.name == "Energy Saving", Category.type == CategoryType.CHALLENGE).first()
    waste_free_cat = db.query(Category).filter(Category.name == "Waste Free", Category.type == CategoryType.CHALLENGE).first()

    # 3. Emission Factors
    factors = [
        EmissionFactor(source_name="Grid Electricity", unit="kWh", emission_factor=0.42, description="CO2e emissions per kWh of electricity used from the grid", status=EmissionFactorStatus.ACTIVE),
        EmissionFactor(source_name="Natural Gas", unit="m3", emission_factor=2.03, description="CO2e emissions per cubic meter of natural gas burnt", status=EmissionFactorStatus.ACTIVE),
        EmissionFactor(source_name="Petrol Fleet Vehicle", unit="liter", emission_factor=2.31, description="CO2e emissions per liter of petrol fuel", status=EmissionFactorStatus.ACTIVE),
        EmissionFactor(source_name="Diesel Fleet Vehicle", unit="liter", emission_factor=2.68, description="CO2e emissions per liter of diesel fuel", status=EmissionFactorStatus.ACTIVE),
        EmissionFactor(source_name="Business Air Travel", unit="km", emission_factor=0.15, description="CO2e emissions per passenger kilometer flown", status=EmissionFactorStatus.ACTIVE),
    ]
    for f in factors:
        existing = db.query(EmissionFactor).filter(EmissionFactor.source_name == f.source_name).first()
        if not existing:
            db.add(f)
    db.commit()
    print("Emission Factors seeded.")

    # Fetch factors
    elec_fac = db.query(EmissionFactor).filter(EmissionFactor.source_name == "Grid Electricity").first()
    gas_fac = db.query(EmissionFactor).filter(EmissionFactor.source_name == "Natural Gas").first()
    petrol_fac = db.query(EmissionFactor).filter(EmissionFactor.source_name == "Petrol Fleet Vehicle").first()
    diesel_fac = db.query(EmissionFactor).filter(EmissionFactor.source_name == "Diesel Fleet Vehicle").first()
    air_fac = db.query(EmissionFactor).filter(EmissionFactor.source_name == "Business Air Travel").first()

    # 4. Carbon Transactions
    today = datetime.datetime.now()
    transactions = [
        # Engineering Transactions
        CarbonTransaction(department_id=eng_dept.id, emission_factor_id=elec_fac.id, quantity=12000.0, calculated_emission=12000.0 * 0.42, remarks="Office grid power usage", transaction_date=today - datetime.timedelta(days=5)),
        CarbonTransaction(department_id=eng_dept.id, emission_factor_id=air_fac.id, quantity=4500.0, calculated_emission=4500.0 * 0.15, remarks="Air travel for developer conference", transaction_date=today - datetime.timedelta(days=15)),
        
        # Operations Transactions (typically higher emissions)
        CarbonTransaction(department_id=ops_dept.id, emission_factor_id=diesel_fac.id, quantity=3500.0, calculated_emission=3500.0 * 2.68, remarks="Delivery fleet diesel consumption", transaction_date=today - datetime.timedelta(days=2)),
        CarbonTransaction(department_id=ops_dept.id, emission_factor_id=gas_fac.id, quantity=1800.0, calculated_emission=1800.0 * 2.03, remarks="Warehouse heating natural gas", transaction_date=today - datetime.timedelta(days=12)),
        
        # Sales & Marketing
        CarbonTransaction(department_id=mkt_dept.id, emission_factor_id=petrol_fac.id, quantity=800.0, calculated_emission=800.0 * 2.31, remarks="Sales representatives client visits", transaction_date=today - datetime.timedelta(days=3)),
        CarbonTransaction(department_id=mkt_dept.id, emission_factor_id=air_fac.id, quantity=12000.0, calculated_emission=12000.0 * 0.15, remarks="International marketing roadshow", transaction_date=today - datetime.timedelta(days=25)),

        # Human Resources
        CarbonTransaction(department_id=hr_dept.id, emission_factor_id=elec_fac.id, quantity=1500.0, calculated_emission=1500.0 * 0.42, remarks="HR floor grid power usage", transaction_date=today - datetime.timedelta(days=8)),
    ]
    # To keep simple, clear carbon transactions table first if user wants fresh seeding or check
    # Check if there are already carbon transactions, if not, add them
    tx_count = db.query(CarbonTransaction).count()
    if tx_count == 0:
        for tx in transactions:
            db.add(tx)
        db.commit()
        print("Carbon Transactions seeded.")
    else:
        print("Carbon Transactions already exists, skipping.")

    # 5. CSR Activities
    csr_activities = [
        CSRActivity(title="Beach Trash Clean-up Drive", category_id=env_clean_cat.id, description="Join us for a cleaning drive on the local beach to collect plastic waste.", location="Sunset Beach", activity_date=(today + datetime.timedelta(days=10)).date(), status=CSRActivityStatus.PLANNED),
        CSRActivity(title="Arbor Day Tree Planting", category_id=env_clean_cat.id, description="Planting 200 saplings in the city park to increase green cover.", location="Central Park Green Space", activity_date=(today - datetime.timedelta(days=10)).date(), status=CSRActivityStatus.COMPLETED),
        CSRActivity(title="Serving Food at City Shelter", category_id=comm_srv_cat.id, description="Help cook and distribute hot meals at the downtown community shelter.", location="Shelter Hall", activity_date=(today + datetime.timedelta(days=1)).date(), status=CSRActivityStatus.ONGOING),
    ]
    activity_count = db.query(CSRActivity).count()
    if activity_count == 0:
        for act in csr_activities:
            db.add(act)
        db.commit()
        print("CSR Activities seeded.")
    else:
        print("CSR Activities already exists, skipping.")

    # 6. Challenges
    challenges = [
        Challenge(title="Go Paperless for a Month", category_id=waste_free_cat.id, description="Reduce paper document printing in the office. Sign everything digitally.", xp=100, difficulty=ChallengeDifficulty.EASY, deadline=(today + datetime.timedelta(days=30)).date(), status=ChallengeStatus.ACTIVE),
        Challenge(title="Carpool or Bike to Work", category_id=carb_red_cat.id, description="Reduce your commute footprint by ridesharing or cycling at least 3 days a week.", xp=250, difficulty=ChallengeDifficulty.MEDIUM, deadline=(today + datetime.timedelta(days=15)).date(), status=ChallengeStatus.ACTIVE),
        Challenge(title="Zero Single-use Plastic Week", category_id=waste_free_cat.id, description="Bring reusable containers and skip single-use cups, bags, and cutlery.", xp=500, difficulty=ChallengeDifficulty.HARD, deadline=(today + datetime.timedelta(days=7)).date(), status=ChallengeStatus.DRAFT),
    ]
    challenge_count = db.query(Challenge).count()
    if challenge_count == 0:
        for ch in challenges:
            db.add(ch)
        db.commit()
        print("Challenges seeded.")
    else:
        print("Challenges already exists, skipping.")

    # 7. Policies
    policies = [
        ESGPolicy(title="EcoSphere Green Procurement Policy", description="Guidelines for sourcing environmentally friendly office and manufacturing supplies.", version="1.0", effective_date=(today - datetime.timedelta(days=100)).date(), status=PolicyStatus.ACTIVE),
        ESGPolicy(title="Remote Work Carbon Offset Policy", description="Framework for measuring and offsetting the carbon footprint of employees working from home.", version="1.1", effective_date=(today - datetime.timedelta(days=20)).date(), status=PolicyStatus.ACTIVE),
        ESGPolicy(title="Office Waste Recycling Protocol", description="Standard operating procedures for sorting, recycling, and disposing of office electronics and waste.", version="2.0", effective_date=(today + datetime.timedelta(days=10)).date(), status=PolicyStatus.DRAFT),
    ]
    policy_count = db.query(ESGPolicy).count()
    if policy_count == 0:
        for pol in policies:
            db.add(pol)
        db.commit()
        print("ESG Policies seeded.")
    else:
        print("ESG Policies already exists, skipping.")

    print("\nDatabase seeded successfully!")

finally:
    db.close()
