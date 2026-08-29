import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";
import { DEALER_CITIES, filterFallbackDealers, type VehicleDealer } from "../lib/dealerFallback";

type Props = {
  purchaseType: "new" | "used";
  budget: string;
  vehicleInterest?: string;
};

function Stars({ r }: { r: number }) {
  return (
    <span style={{ color: "var(--amber)", letterSpacing: 1, fontSize: ".85rem" }}>
      {"★".repeat(Math.round(r))}
      <span style={{ color: "rgba(255,255,255,.15)" }}>{"★".repeat(5 - Math.round(r))}</span>
    </span>
  );
}

export default function DealerRecommendations({ purchaseType, budget, vehicleInterest = "" }: Props) {
  const [dealers, setDealers] = useState<VehicleDealer[]>([]);
  const [cities, setCities] = useState<string[]>(DEALER_CITIES);
  const [city, setCity] = useState("Pune");
  const [sort, setSort] = useState("distance");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VehicleDealer | null>(null);
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", message: "" });
  const [quoteBusy, setQuoteBusy] = useState(false);
  const [quoteToast, setQuoteToast] = useState("");
  const [loading, setLoading] = useState(true);

  const isUsed = purchaseType === "used";
  const cityOptions = cities.includes(city) ? cities : [city, ...cities];

  useEffect(() => {
    if (!isUsed) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<{ dealers: VehicleDealer[]; cities: string[] }>("/buy/dealers", {
          params: {
            purchase_type: purchaseType,
            city,
            budget,
            query: query || undefined,
            sort,
          },
        });
        if (cancelled) return;
        setDealers(data.dealers ?? []);
        if (data.cities?.length) setCities(data.cities);
      } catch {
        if (cancelled) return;
        setCities(DEALER_CITIES);
        setDealers(filterFallbackDealers(city, query, sort));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, query ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [isUsed, purchaseType, city, budget, query, sort]);

  useEffect(() => {
    if (!quoteToast) return;
    const t = setTimeout(() => setQuoteToast(""), 4000);
    return () => clearTimeout(t);
  }, [quoteToast]);

  const openQuote = (d: VehicleDealer) => {
    setSelected(d);
    setQuoteForm({
      name: "",
      phone: "",
      message: vehicleInterest
        ? `Interested in: ${vehicleInterest}. Please share best price and availability.`
        : `Looking in budget ${budget}. Please share available options and on-road/all-in quote.`,
    });
  };

  const sendQuote = async () => {
    if (!selected || !quoteForm.name.trim() || !quoteForm.phone.trim()) return;
    setQuoteBusy(true);
    try {
      const { data } = await api.post<{ ok: boolean; message: string; reference: string }>(
        "/buy/dealer-quote",
        {
          dealer_id: selected.id,
          name: quoteForm.name,
          phone: quoteForm.phone,
          message: quoteForm.message,
          vehicle_interest: vehicleInterest,
        },
      );
      setQuoteToast(`${data.message} Ref: ${data.reference}`);
      setSelected(null);
    } catch {
      setQuoteToast("Could not send quote request — try again.");
    } finally {
      setQuoteBusy(false);
    }
  };

  if (!isUsed) return null;

  return (
    <div className="dealer-rec mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
        <div>
          <div className="pill mb-2" style={{ fontSize: ".7rem" }}>📍 Nearby sellers</div>
          <h5 style={{ fontWeight: 700, margin: 0 }}>Connect with dealers for quotations</h5>
          <p className="text-muted-2 mb-0" style={{ fontSize: ".88rem" }}>
            Verified used-car sellers & pre-owned hubs near you — request quotes without leaving the app.
          </p>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <label className="auth-label">City</label>
          <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
            {cityOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="auth-label">Brand or seller</label>
          <input
            className="form-control"
            placeholder="e.g. Hyundai, Spinny…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="auth-label">Sort by</label>
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="distance">Nearest first</option>
            <option value="rating">Top rated</option>
            <option value="reviews">Most reviews</option>
            <option value="inventory">Largest inventory</option>
            <option value="response">Fastest reply</option>
          </select>
        </div>
      </div>

      {quoteToast && <div className="dealer-rec__toast" role="status">{quoteToast}</div>}

      {loading && (
        <div className="card-surface p-3 text-center text-muted-2 mb-3" style={{ fontSize: ".88rem" }}>
          Loading nearby sellers…
        </div>
      )}

      {!loading && !dealers.length && (
        <div className="card-surface p-4 text-center text-muted-2">No sellers match your filters — try another city.</div>
      )}

      <div className="row g-3">
        {!loading && dealers.map((d, i) => (
          <div className="col-md-6" key={d.id}>
            <motion.div
              className="card-surface p-4 h-100 dealer-rec__card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <b>{d.name}</b>
                    {d.verified && <span className="pill" style={{ fontSize: ".65rem" }}>✓ Verified</span>}
                    {d.online && <span className="pill" style={{ fontSize: ".65rem", color: "var(--green)" }}>● Online</span>}
                  </div>
                  <div className="text-muted-2" style={{ fontSize: ".82rem" }}>
                    {d.area}, {d.city} · {d.distance_km} km away
                  </div>
                </div>
                <div className="text-end">
                  <Stars r={d.rating} />
                  <div className="text-muted-2" style={{ fontSize: ".72rem" }}>{d.reviews} reviews</div>
                </div>
              </div>

              <p className="mt-2 mb-2" style={{ fontSize: ".88rem" }}>{d.tagline}</p>

              <div className="d-flex flex-wrap gap-2 mb-2">
                {d.brands.map((b) => <span key={b} className="chip" style={{ fontSize: ".72rem" }}>{b}</span>)}
                <span className="chip" style={{ fontSize: ".72rem" }}>{d.inventory_count} cars in stock</span>
                <span className="chip" style={{ fontSize: ".72rem" }}>{d.price_range}</span>
              </div>

              <div className="d-flex flex-wrap gap-1 mb-3">
                {d.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="text-muted-2" style={{ fontSize: ".75rem" }}>✓ {s}</span>
                ))}
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button type="button" className="btn-grad" style={{ padding: "8px 16px", fontSize: ".85rem" }} onClick={() => openQuote(d)}>
                  Get quotation →
                </button>
                <a href={`tel:${d.contact_phone.replace(/\s/g, "")}`} className="chip" style={{ fontSize: ".78rem" }}>
                  📞 Call
                </a>
                <span className="text-muted-2 ms-auto" style={{ fontSize: ".72rem" }}>
                  ~{d.response_hours}h reply
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="doc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="glass doc-modal"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <div className="pill mb-2" style={{ fontSize: ".7rem" }}>📋 Quote request</div>
                  <h5 style={{ fontWeight: 800, margin: 0 }}>{selected.name}</h5>
                  <div className="text-muted-2" style={{ fontSize: ".85rem" }}>{selected.area}, {selected.city}</div>
                </div>
                <button type="button" className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="mb-3">
                <label className="auth-label">Your name</label>
                <input className="form-control" value={quoteForm.name} onChange={(e) => setQuoteForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="auth-label">Mobile</label>
                <input className="form-control" placeholder="+91 98765 43210" value={quoteForm.phone} onChange={(e) => setQuoteForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="auth-label">Message</label>
                <textarea className="form-control" rows={3} value={quoteForm.message} onChange={(e) => setQuoteForm((f) => ({ ...f, message: e.target.value }))} />
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button type="button" className="btn-grad" disabled={quoteBusy} onClick={sendQuote}>
                  {quoteBusy ? "Sending…" : "Send quote request"}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
