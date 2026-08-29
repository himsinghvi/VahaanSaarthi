"""Nearby vehicle dealers & used-car sellers — demo directory for Buy page."""
from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass
class VehicleDealer:
    id: str
    name: str
    dealer_type: str  # new | used
    brands: list[str]
    area: str
    city: str
    distance_km: float
    rating: float
    reviews: int
    inventory_count: int
    price_range: str
    specialties: list[str]
    verified: bool
    online: bool
    response_hours: float
    tagline: str
    contact_phone: str


CITIES = ["Pune", "Mumbai", "Bengaluru", "Delhi", "Hyderabad", "Chennai", "Ahmedabad"]

_DEALERS: list[VehicleDealer] = [
    VehicleDealer(
        "dl_1", "Spinny Hub — Baner", "used", ["Multi-brand"],
        "Baner", "Pune", 3.2, 4.8, 2140, 86, "₹4–18 lakh",
        ["200-point inspection", "7-day return", "RC transfer assist"],
        True, True, 2.0,
        "Certified pre-owned with fixed pricing & home test drive.",
        "+91 98765 10001",
    ),
    VehicleDealer(
        "dl_2", "Cars24 Experience Store", "used", ["Multi-brand"],
        "Wakad", "Pune", 5.8, 4.6, 1820, 120, "₹3–25 lakh",
        ["Instant quote", "Same-day delivery", "Loan assistance"],
        True, True, 3.0,
        "Large used inventory with online booking & finance tie-ups.",
        "+91 98765 10002",
    ),
    VehicleDealer(
        "dl_3", "Mahindra First Choice — Kothrud", "used", ["Mahindra", "Multi-brand"],
        "Kothrud", "Pune", 4.1, 4.5, 890, 54, "₹5–14 lakh",
        ["Warranty options", "Exchange bonus", "Free RC check"],
        True, True, 4.0,
        "Trusted used-car chain with workshop-backed refurbish.",
        "+91 98765 10003",
    ),
    VehicleDealer(
        "dl_4", "AutoBazaar Pre-owned", "used", ["Hyundai", "Maruti", "Tata"],
        "Hinjewadi", "Pune", 7.4, 4.3, 412, 38, "₹2–12 lakh",
        ["Negotiable pricing", "Local expertise", "Quick paperwork"],
        False, True, 6.0,
        "Neighbourhood seller specialising in city-run sedans & hatches.",
        "+91 98765 10004",
    ),
    VehicleDealer(
        "dl_5", "Hyundai Arena — Shivajinagar", "new", ["Hyundai"],
        "Shivajinagar", "Pune", 2.8, 4.7, 620, 42, "₹8–25 lakh",
        ["Test drive", "Exchange", "Corporate discounts"],
        True, True, 1.5,
        "Authorised Hyundai showroom with on-road quote in 30 minutes.",
        "+91 98765 10005",
    ),
    VehicleDealer(
        "dl_6", "Maruti Arena — Pimpri", "new", ["Maruti Suzuki"],
        "Pimpri", "Pune", 6.2, 4.8, 1100, 65, "₹5–18 lakh",
        ["Waiting-period updates", "Accessories bundle", "Extended warranty"],
        True, True, 2.0,
        "High-volume Maruti dealer — strong on mileage-first buyers.",
        "+91 98765 10006",
    ),
    VehicleDealer(
        "dl_7", "CarWale Trusted Partner — Andheri", "used", ["Multi-brand"],
        "Andheri", "Mumbai", 8.5, 4.4, 760, 95, "₹4–30 lakh",
        ["Video walkthrough", "Doorstep delivery", "Insurance renewal"],
        True, True, 3.5,
        "Mumbai's go-to for premium used SUVs & compact sedans.",
        "+91 98765 10007",
    ),
    VehicleDealer(
        "dl_8", "Tata Motors Showroom — Whitefield", "new", ["Tata", "EV"],
        "Whitefield", "Bengaluru", 4.6, 4.6, 540, 28, "₹7–22 lakh",
        ["EV charging guide", "Nexon/Punch demos", "FAME subsidy help"],
        True, True, 2.5,
        "EV-friendly Tata dealer with strong Nexon EV stock.",
        "+91 98765 10008",
    ),
]


def list_dealers(
    purchase_type: str = "used",
    city: str | None = None,
    budget: str | None = None,
    query: str | None = None,
    sort: str = "distance",
) -> list[dict]:
    want_used = purchase_type in ("used", "preowned", "pre-owned")
    items = [d for d in _DEALERS if d.dealer_type == ("used" if want_used else "new")]

    if city:
        items = [d for d in items if d.city.lower() == city.lower()]

    if query:
        q = query.lower()
        items = [
            d for d in items
            if q in d.name.lower() or q in d.area.lower() or any(q in b.lower() for b in d.brands)
        ]

    if budget:
        b = budget.lower()
        if "under" in b or "10" in b.split()[0]:
            items = [d for d in items if "2" in d.price_range or "3" in d.price_range or "4" in d.price_range or "5" in d.price_range]
        elif "40" in b and "+" in b:
            items = [d for d in items if "18" in d.price_range or "25" in d.price_range or "30" in d.price_range]

    keys = {
        "distance": lambda d: (d.distance_km, -d.rating),
        "rating": lambda d: (-d.rating, -d.reviews),
        "reviews": lambda d: -d.reviews,
        "inventory": lambda d: -d.inventory_count,
        "response": lambda d: d.response_hours,
    }
    items = sorted(items, key=keys.get(sort, keys["distance"]))
    return [asdict(d) for d in items]


def get_dealer(dealer_id: str) -> dict | None:
    d = next((x for x in _DEALERS if x.id == dealer_id), None)
    return asdict(d) if d else None


def request_quote(dealer_id: str, name: str, phone: str, message: str, vehicle_interest: str = "") -> dict:
    d = get_dealer(dealer_id)
    if not d:
        return {"ok": False, "message": "Dealer not found"}
    ref = f"QT-{dealer_id.upper()}-{phone[-4:]}"
    return {
        "ok": True,
        "reference": ref,
        "dealer_name": d["name"],
        "message": (
            f"Quote request sent to {d['name']}. "
            f"They typically reply within {d['response_hours']:.0f} hours on WhatsApp or phone."
        ),
    }
