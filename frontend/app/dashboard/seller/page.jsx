"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { sellerApi, messageApi, notificationApi, authApi, purchaseApi, formatPrice, supportedCurrencies } from "@/lib/api";
import { dashboardApi } from "@/lib/api";

/* ═══ ICONS (inline SVG) ═══ */
const icons = {
  overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  listings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  add: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
  leads: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  sold: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  messages: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  offers: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

const tabs = [
  { key: "overview", label: "Overview", icon: icons.overview },
  { key: "listings", label: "My Listings", icon: icons.listings },
  { key: "add", label: "Add Property", icon: icons.add },
  { key: "leads", label: "Leads", icon: icons.leads },
  { key: "offers", label: "Offers", icon: icons.offers },
  { key: "sold", label: "Sold", icon: icons.sold },
  { key: "messages", label: "Messages", icon: icons.messages },
  { key: "profile", label: "Profile", icon: icons.profile },
];

/* ═══ STATUS BADGE ═══ */
function StatusBadge({ status }) {
  const m = { active: "bg-emerald-100 text-emerald-700", sold: "bg-blue-100 text-blue-700", draft: "bg-gray-200 text-gray-600", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-600" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m[status] || "bg-gray-100 text-gray-600"}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
}

/* ═══ MAIN COMPONENT ═══ */
export default function SellerDashboardPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [dashData, setDashData] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [soldList, setSoldList] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [pendingOffers, setPendingOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "", bio: "", currentPassword: "", newPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");

  // Add property form
  const [propForm, setPropForm] = useState({ title: "", description: "", type: "House", listingType: "buy", price: "", currency: "INR", beds: "", baths: "", areaSqFt: "", address: "", city: "", state: "", country: "IN", listViaAgent: false, agentId: "" });
  const [propMsg, setPropMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", address: user.address || "", city: user.city || "", state: user.state || "", zip: user.zip || "", country: user.country || "", bio: user.bio || "", currentPassword: "", newPassword: "" });
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [dash, props, lds, sold, messages] = await Promise.all([
        dashboardApi.getSellerDashboard(),
        sellerApi.getMyProperties().catch(() => []),
        sellerApi.getLeads().catch(() => []),
        sellerApi.getSoldProperties().catch(() => []),
        messageApi.getMessages().catch(() => []),
      ]);
      setDashData(dash);
      setMyProperties(props);
      setLeads(lds);
      setSoldList(sold);
      setMsgs(messages);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleAddProperty(e) {
    e.preventDefault();
    setPropMsg("");
    try {
      const res = await sellerApi.createProperty(propForm);
      setPropMsg("✅ " + (res.message || "Property listed!"));
      setPropForm({ title: "", description: "", type: "House", listingType: "buy", price: "", currency: "INR", beds: "", baths: "", areaSqFt: "", address: "", city: "", state: "", country: "IN", listViaAgent: false, agentId: "" });
      await loadData();
      setTimeout(() => setActiveTab("listings"), 1000);
    } catch (e) {
      setPropMsg("❌ " + (e.response?.data?.message || "Failed to add property"));
    }
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await authApi.updateProfile(profileForm);
      if (res.user) updateUser(res.user);
      setProfileMsg("✅ Profile updated!");
      setProfileForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (e) {
      setProfileMsg("❌ " + (e.response?.data?.message || "Failed to update"));
    }
  }

  async function togglePublish(id) {
    try {
      await sellerApi.togglePublish(id);
      await loadData();
    } catch (e) { console.error(e); }
  }

  async function deleteProperty(id) {
    if (!confirm("Delete this property?")) return;
    try {
      await sellerApi.deleteProperty(id);
      await loadData();
    } catch (e) { console.error(e); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* ── Mobile sidebar toggle ── */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-20 left-4 z-50 lg:hidden rounded-xl bg-surface-container-lowest p-2 shadow-ambient">
        <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-container-lowest shadow-ambient-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 pt-20 lg:pt-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">{user?.name || "Seller"}</p>
              <p className="text-xs text-on-surface-variant">Seller Account</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === t.key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}>
                {t.icon}
                {t.label}
                {t.key === "messages" && dashData?.unreadMessages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{dashData.unreadMessages}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── Overlay ── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-on-surface">Welcome, {dashData?.userName || "Seller"}</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Manage listings, track leads, and close sales.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(dashData?.listingSummary || []).map((s) => (
                    <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all">
                      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">{s.label}</p>
                      <p className="mt-2 font-display text-2xl font-bold text-on-surface">{s.value}</p>
                      <p className="mt-1 text-xs text-outline">{s.hint}</p>
                    </div>
                  ))}
                </div>
                {/* Recent listings preview */}
                <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient">
                  <h2 className="font-display text-lg font-semibold text-on-surface mb-4">Recent Listings</h2>
                  {myProperties.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No listings yet. <button onClick={() => setActiveTab("add")} className="text-primary font-medium">Add your first property →</button></p>
                  ) : (
                    <div className="space-y-2">
                      {myProperties.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-on-surface">{p.title}</p>
                            <p className="text-xs text-on-surface-variant">{p.city}, {p.state}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary">{formatPrice(p.price, p.currency)}</p>
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── MY LISTINGS ── */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl font-bold text-on-surface">My Listings</h1>
                  <button onClick={() => setActiveTab("add")} className="btn-primary text-sm">+ Add Property</button>
                </div>
                {myProperties.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No properties listed yet.</p>
                    <button onClick={() => setActiveTab("add")} className="btn-primary mt-4 text-sm">Add Your First Listing</button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {myProperties.map((p) => (
                      <div key={p.id} className="rounded-2xl bg-surface-container-lowest shadow-ambient overflow-hidden">
                        {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />}
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-on-surface">{p.title}</h3>
                            <StatusBadge status={p.status} />
                          </div>
                          <p className="text-sm text-on-surface-variant">{p.city}, {p.state} • {p.beds}bd {p.baths}ba • {p.areaSqFt} sqft</p>
                          <p className="text-lg font-bold text-primary">{formatPrice(p.price, p.currency)}</p>
                          {p.listedByAgent && <span className="inline-block text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">Agent Listed</span>}
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => togglePublish(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors">
                              {p.isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <button onClick={() => deleteProperty(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ADD PROPERTY ── */}
            {activeTab === "add" && (
              <div className="space-y-6 max-w-2xl">
                <h1 className="font-display text-2xl font-bold text-on-surface">Add New Property</h1>
                {propMsg && <div className={`rounded-xl p-3 text-sm ${propMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{propMsg}</div>}
                <form onSubmit={handleAddProperty} className="space-y-4 rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Property Title *</label>
                      <input value={propForm.title} onChange={(e) => setPropForm({ ...propForm, title: e.target.value })} required className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder="e.g. Modern 3BHK in Bandra West" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Description</label>
                      <textarea value={propForm.description} onChange={(e) => setPropForm({ ...propForm, description: e.target.value })} rows={3} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder="Describe the property..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Type</label>
                      <select value={propForm.type} onChange={(e) => setPropForm({ ...propForm, type: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface">
                        {["House", "Apartment", "Villa", "Townhouse", "Plot", "Commercial"].map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Listing Type</label>
                      <select value={propForm.listingType} onChange={(e) => setPropForm({ ...propForm, listingType: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface">
                        <option value="buy">For Sale</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Price *</label>
                      <input type="number" value={propForm.price} onChange={(e) => setPropForm({ ...propForm, price: e.target.value })} required className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" placeholder="e.g. 4500000" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Currency</label>
                      <select value={propForm.currency} onChange={(e) => setPropForm({ ...propForm, currency: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface">
                        {supportedCurrencies.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Beds</label>
                      <input type="number" value={propForm.beds} onChange={(e) => setPropForm({ ...propForm, beds: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="e.g. 3" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Baths</label>
                      <input type="number" value={propForm.baths} onChange={(e) => setPropForm({ ...propForm, baths: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="e.g. 2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Area (sqft)</label>
                      <input type="number" value={propForm.areaSqFt} onChange={(e) => setPropForm({ ...propForm, areaSqFt: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="e.g. 1200" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Country</label>
                      <select value={propForm.country} onChange={(e) => setPropForm({ ...propForm, country: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface">
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="AE">UAE</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">City</label>
                      <input value={propForm.city} onChange={(e) => setPropForm({ ...propForm, city: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="e.g. Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">State</label>
                      <input value={propForm.state} onChange={(e) => setPropForm({ ...propForm, state: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="e.g. Maharashtra" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Address</label>
                      <input value={propForm.address} onChange={(e) => setPropForm({ ...propForm, address: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface" placeholder="Full address" />
                    </div>
                  </div>

                  {/* List via Agent toggle */}
                  <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={propForm.listViaAgent} onChange={(e) => setPropForm({ ...propForm, listViaAgent: e.target.checked })} className="w-4 h-4 rounded text-primary" />
                      <span className="text-sm font-medium text-on-surface">List via Agent</span>
                    </label>
                    {propForm.listViaAgent && (
                      <input value={propForm.agentId} onChange={(e) => setPropForm({ ...propForm, agentId: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface" placeholder="Agent ID (e.g. u-agent)" />
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full">Publish Property</button>
                </form>
              </div>
            )}

            {/* ── LEADS ── */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Buyer Leads</h1>
                {leads.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No leads yet. Once buyers show interest, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-surface-container-lowest shadow-ambient overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-surface-container-low text-on-surface-variant">
                          <tr>
                            <th className="px-4 py-3 font-medium">Buyer</th>
                            <th className="px-4 py-3 font-medium">Property</th>
                            <th className="px-4 py-3 font-medium">Source</th>
                            <th className="px-4 py-3 font-medium">Contact</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                          {leads.map((l, i) => (
                            <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="px-4 py-3 font-medium text-on-surface">{l.name}</td>
                              <td className="px-4 py-3 text-on-surface-variant">{l.property}</td>
                              <td className="px-4 py-3"><span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium">{l.source}</span></td>
                              <td className="px-4 py-3 text-on-surface-variant text-xs">{l.email}</td>
                              <td className="px-4 py-3"><StatusBadge status={l.status?.toLowerCase()} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── OFFERS ── */}
            {activeTab === "offers" && <OffersTab />}

            {/* ── SOLD ── */}
            {activeTab === "sold" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Sold Properties</h1>
                {soldList.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No completed sales yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {soldList.map((s) => (
                      <div key={s.purchaseId} className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient flex items-center justify-between">
                        <div>
                          <p className="font-medium text-on-surface">{s.property}</p>
                          <p className="text-xs text-on-surface-variant mt-1">Buyer: {s.buyer} • Completed: {new Date(s.completedAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-lg font-bold text-emerald-600">{formatPrice(s.price, s.currency)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Messages</h1>
                {msgs.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {msgs.map((m) => (
                      <div key={m.id} className={`rounded-2xl p-4 shadow-ambient ${m.isRead ? "bg-surface-container-lowest" : "bg-primary-fixed/10 border-l-4 border-primary"}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">
                              {m.direction === "received" ? `From: ${m.fromName}` : `To: ${m.toName}`}
                            </p>
                            {m.subject && <p className="text-sm font-medium text-on-surface mt-0.5">{m.subject}</p>}
                            <p className="text-sm text-on-surface-variant mt-1">{m.body}</p>
                            {m.propertyTitle && <p className="text-xs text-primary mt-1">Re: {m.propertyTitle}</p>}
                          </div>
                          <p className="text-xs text-outline whitespace-nowrap ml-4">{new Date(m.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <h1 className="font-display text-2xl font-bold text-on-surface">Profile Settings</h1>
                {profileMsg && <div className={`rounded-xl p-3 text-sm ${profileMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{profileMsg}</div>}
                <form onSubmit={handleProfileSave} className="space-y-4 rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { key: "name", label: "Full Name", type: "text" },
                      { key: "email", label: "Email", type: "email" },
                      { key: "phone", label: "Phone", type: "tel" },
                      { key: "address", label: "Address", type: "text" },
                      { key: "city", label: "City", type: "text" },
                      { key: "state", label: "State", type: "text" },
                      { key: "zip", label: "ZIP / Pin Code", type: "text" },
                      { key: "country", label: "Country", type: "text" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">{f.label}</label>
                        <input type={f.type} value={profileForm[f.key]} onChange={(e) => setProfileForm({ ...profileForm, [f.key]: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Bio</label>
                      <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <hr className="border-surface-container-low" />
                  <p className="text-sm font-medium text-on-surface">Change Password</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Current Password</label>
                      <input type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">New Password</label>
                      <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ═══ OFFERS SUB-COMPONENT ═══ */
function OffersTab() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sellerApi.getLeads().then((data) => {
      setOffers(data.filter((l) => l.source === "Offer" || l.source === "Direct Purchase"));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-on-surface">Buyer Offers</h1>
      {offers.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
          <p className="text-on-surface-variant">No pending offers. When buyers make offers on your properties, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((o, i) => (
            <div key={i} className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-on-surface">{o.name}</p>
                  <p className="text-sm text-on-surface-variant">{o.property}</p>
                  <p className="text-xs text-outline mt-1">{o.source} • {new Date(o.lastContact).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={o.status?.toLowerCase()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
