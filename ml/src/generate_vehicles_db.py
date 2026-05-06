"""
Generate a realistic mock vehicle database (vehicles.csv).

Run once:  python ml/src/generate_vehicles_db.py

The CSV is written to  data/vehicles.csv  and contains ~800 rows with columns:
  plate_number, owner_name, address, vehicle_year, vehicle_make, vehicle_model,
  vehicle_color, reg_expiry, insurance, insurance_provider, policy_number,
  fines, fine_amount, is_flagged
"""

import csv
import random
import os
from datetime import date, timedelta

try:
    from faker import Faker
except ImportError:
    print("Faker not installed — installing now …")
    os.system("pip install faker")
    from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

# ── Plate number templates (Nepali-style) ────────────────────────────────────
PROVINCES = ["BA", "JA", "NA", "LU", "GA", "KO", "PG", "ME", "SE", "DH", "SA", "BH", "RA"]
CATEGORIES = ["PA", "CHA", "JA", "HA", "MN", "KA", "GA"]

def random_plate():
    """Generate a plate like  BA·PA1234  or  PG·MN112"""
    province = random.choice(PROVINCES)
    cat = random.choice(CATEGORIES)
    num = random.randint(100, 9999)
    return f"{province}·{cat}{num}"


# ── Vehicle catalogue ───────────────────────────────────────────────────────
MAKES_MODELS = {
    "Toyota":    ["Camry", "Corolla", "RAV4", "Hilux", "Yaris", "Land Cruiser", "Prius", "Fortuner"],
    "Honda":     ["Civic", "Accord", "CR-V", "City", "Jazz", "HR-V"],
    "Hyundai":   ["Tucson", "Creta", "i20", "Elantra", "Santa Fe", "Venue"],
    "Suzuki":    ["Swift", "Dzire", "Baleno", "Vitara", "Alto", "Ertiga"],
    "Kia":       ["Seltos", "Sportage", "Carnival", "Sonet", "Rio"],
    "Tata":      ["Nexon", "Harrier", "Punch", "Safari", "Altroz"],
    "Nissan":    ["Altima", "Sentra", "Kicks", "Patrol", "Navara"],
    "Ford":      ["Ecosport", "Ranger", "Endeavour", "Figo", "F-150"],
    "Chevrolet": ["Malibu", "Cruze", "Trax", "Equinox", "Spark"],
    "Mahindra":  ["Scorpio", "XUV700", "Bolero", "Thar", "XUV300"],
}
COLORS = ["White", "Silver", "Black", "Gray", "Red", "Blue", "Green", "Beige", "Brown", "Gold", "Maroon"]
INSURANCE_PROVIDERS = [
    "Nepal Insurance Co.", "Sagarmatha Insurance", "Everest Insurance",
    "Himalayan General Insurance", "Shikhar Insurance", "Prabhu Insurance",
    "Prime Life Insurance", "United Insurance", "Lumbini General Insurance",
    "Siddhartha Insurance",
]

NUM_ROWS = 800

# ── Build rows ──────────────────────────────────────────────────────────────
rows = []
used_plates: set[str] = set()

for _ in range(NUM_ROWS):
    # unique plate
    plate = random_plate()
    while plate in used_plates:
        plate = random_plate()
    used_plates.add(plate)

    make = random.choice(list(MAKES_MODELS.keys()))
    model = random.choice(MAKES_MODELS[make])
    color = random.choice(COLORS)
    year = random.randint(2005, 2025)

    owner = fake.name()
    address = fake.address().replace("\n", ", ")

    # registration expiry: some expired, some valid
    today = date.today()
    if random.random() < 0.25:
        # expired (up to 3 years ago)
        exp = today - timedelta(days=random.randint(1, 1095))
    else:
        # valid (up to 4 years in the future)
        exp = today + timedelta(days=random.randint(1, 1460))

    # insurance
    has_insurance = random.random() > 0.2
    provider = random.choice(INSURANCE_PROVIDERS) if has_insurance else ""
    policy = f"POL-{random.randint(10000000, 99999999)}" if has_insurance else ""

    # fines
    num_fines = random.choices([0, 0, 0, 0, 1, 2, 3, 4, 5], k=1)[0]
    fine_amount = num_fines * random.randint(50, 300) if num_fines > 0 else 0

    # flagged  (stolen / wanted / suspended)
    is_flagged = random.random() < 0.08

    rows.append({
        "plate_number": plate,
        "owner_name": owner,
        "address": address,
        "vehicle_year": year,
        "vehicle_make": make,
        "vehicle_model": model,
        "vehicle_color": color,
        "reg_expiry": exp.isoformat(),
        "insurance": "Yes" if has_insurance else "No",
        "insurance_provider": provider,
        "policy_number": policy,
        "fines": num_fines,
        "fine_amount": fine_amount,
        "is_flagged": is_flagged,
    })

# ── Write CSV ───────────────────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "vehicles.csv")
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with open(out_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

print(f"Done! Wrote {len(rows)} rows -> {os.path.abspath(out_path)}")
