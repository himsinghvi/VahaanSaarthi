export interface VehicleDealer {
  id: string;
  name: string;
  dealer_type: string;
  brands: string[];
  area: string;
  city: string;
  distance_km: number;
  rating: number;
  reviews: number;
  inventory_count: number;
  price_range: string;
  specialties: string[];
  verified: boolean;
  online: boolean;
  response_hours: number;
  tagline: string;
  contact_phone: string;
}

export const DEALER_CITIES = [
  "Pune",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
];

/** Offline fallback when /buy/dealers is unavailable (e.g. backend not restarted). */
export const FALLBACK_USED_DEALERS: VehicleDealer[] = [
  {
    id: "dl_1",
    name: "Spinny Hub — Baner",
    dealer_type: "used",
    brands: ["Multi-brand"],
    area: "Baner",
    city: "Pune",
    distance_km: 3.2,
    rating: 4.8,
    reviews: 2140,
    inventory_count: 86,
    price_range: "₹4–18 lakh",
    specialties: ["200-point inspection", "7-day return", "RC transfer assist"],
    verified: true,
    online: true,
    response_hours: 2,
    tagline: "Certified pre-owned with fixed pricing & home test drive.",
    contact_phone: "+91 98765 10001",
  },
  {
    id: "dl_2",
    name: "Cars24 Experience Store",
    dealer_type: "used",
    brands: ["Multi-brand"],
    area: "Wakad",
    city: "Pune",
    distance_km: 5.8,
    rating: 4.6,
    reviews: 1820,
    inventory_count: 120,
    price_range: "₹3–25 lakh",
    specialties: ["Instant quote", "Same-day delivery", "Loan assistance"],
    verified: true,
    online: true,
    response_hours: 3,
    tagline: "Large used inventory with online booking & finance tie-ups.",
    contact_phone: "+91 98765 10002",
  },
  {
    id: "dl_3",
    name: "Mahindra First Choice — Kothrud",
    dealer_type: "used",
    brands: ["Mahindra", "Multi-brand"],
    area: "Kothrud",
    city: "Pune",
    distance_km: 4.1,
    rating: 4.5,
    reviews: 890,
    inventory_count: 54,
    price_range: "₹5–14 lakh",
    specialties: ["Warranty options", "Exchange bonus", "Free RC check"],
    verified: true,
    online: true,
    response_hours: 4,
    tagline: "Trusted used-car chain with workshop-backed refurbish.",
    contact_phone: "+91 98765 10003",
  },
  {
    id: "dl_4",
    name: "AutoBazaar Pre-owned",
    dealer_type: "used",
    brands: ["Hyundai", "Maruti", "Tata"],
    area: "Hinjewadi",
    city: "Pune",
    distance_km: 7.4,
    rating: 4.3,
    reviews: 412,
    inventory_count: 38,
    price_range: "₹2–12 lakh",
    specialties: ["Negotiable pricing", "Local expertise", "Quick paperwork"],
    verified: false,
    online: true,
    response_hours: 6,
    tagline: "Neighbourhood seller specialising in city-run sedans & hatches.",
    contact_phone: "+91 98765 10004",
  },
  {
    id: "dl_7",
    name: "CarWale Trusted Partner — Andheri",
    dealer_type: "used",
    brands: ["Multi-brand"],
    area: "Andheri",
    city: "Mumbai",
    distance_km: 8.5,
    rating: 4.4,
    reviews: 760,
    inventory_count: 95,
    price_range: "₹4–30 lakh",
    specialties: ["Video walkthrough", "Doorstep delivery", "Insurance renewal"],
    verified: true,
    online: true,
    response_hours: 3.5,
    tagline: "Mumbai's go-to for premium used SUVs & compact sedans.",
    contact_phone: "+91 98765 10007",
  },
];

export function filterFallbackDealers(
  city: string,
  query: string,
  sort: string,
): VehicleDealer[] {
  let items = FALLBACK_USED_DEALERS.filter((d) => d.city.toLowerCase() === city.toLowerCase());
  if (query.trim()) {
    const q = query.toLowerCase();
    items = items.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.area.toLowerCase().includes(q) ||
        d.brands.some((b) => b.toLowerCase().includes(q)),
    );
  }
  const keys: Record<string, (d: VehicleDealer) => number> = {
    distance: (d) => d.distance_km,
    rating: (d) => -d.rating,
    reviews: (d) => -d.reviews,
    inventory: (d) => -d.inventory_count,
    response: (d) => d.response_hours,
  };
  const keyFn = keys[sort] ?? keys.distance;
  return [...items].sort((a, b) => keyFn(a) - keyFn(b));
}
