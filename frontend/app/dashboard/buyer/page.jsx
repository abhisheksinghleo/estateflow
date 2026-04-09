"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, favoriteApi, authApi, purchaseApi, messageApi, notificationApi, formatPrice } from "@/lib/api";

/* ═══ ICONS ═══ */
const icons = {
  overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  favorites: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  purchases: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  messages: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  notifications: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

const tabs = [
  { key: "overview", label: "Overview", icon: icons.overview },
  { key: "favorites", label: "Favorites", icon: icons.favorites },
  { key: "purchases", label: "Purchase History", icon: icons.purchases },
  { key: "messages", label: "Messages", icon: icons.messages },
  { key: "notifications", label: "Notifications", icon: icons.notifications },
  { key: "profile", label: "Profile", icon: icons.profile },
];

function StatusBadge({ status }) {
  const m = { completed: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-600", active: "bg-blue-100 text-blue-700" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m[status] || "bg-gray-100 text-gray-600"}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
}

export default function BuyerDashboardPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashData, setDashData] = useState(null);
  const [favs, setFavs] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "", bio: "", currentPassword: "", newPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", address: user.address || "", city: user.city || "", state: user.state || "", zip: user.zip || "", country: user.country || "", bio: user.bio || "", currentPassword: "", newPassword: "" });
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [dash, favorites, purchases, messages, notifications] = await Promise.all([
        dashboardApi.getBuyerDashboard(),
        favoriteApi.getFavorites().catch(() => []),
        purchaseApi.getPurchaseHistory().catch(() => []),
        messageApi.getMessages().catch(() => []),
        notificationApi.getNotifications().catch(() => []),
      ]);
      setDashData(dash);
      setFavs(favorites);
      setPurchaseHistory(purchases);
      setMsgs(messages);
      setNotifs(notifications);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function removeFav(propertyId) {
    try {
      await favoriteApi.removeFavorite(propertyId);
      setFavs((prev) => prev.filter((f) => f.id !== propertyId));
    } catch (e) { console.error(e); }
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

  async function markNotifRead(id) {
    try {
      await notificationApi.markRead(id);
      setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const unreadMsgs = msgs.filter((m) => m.direction === "received" && !m.isRead).length;
  const unreadNotifs = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-20 left-4 z-50 lg:hidden rounded-xl bg-surface-container-lowest p-2 shadow-ambient">
        <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-container-lowest shadow-ambient-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 pt-20 lg:pt-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">{user?.name?.charAt(0) || "B"}</div>
            <div>
              <p className="font-semibold text-on-surface text-sm">{user?.name || "Buyer"}</p>
              <p className="text-xs text-on-surface-variant">Buyer Account</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === t.key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low"}`}>
                {t.icon}
                {t.label}
                {t.key === "messages" && unreadMsgs > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadMsgs}</span>}
                {t.key === "notifications" && unreadNotifs > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadNotifs}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-on-surface">Welcome, {dashData?.userName || "Buyer"}</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Browse properties, track favorites, and manage your purchases.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Saved Properties", value: dashData?.favoriteCount || favs.length, icon: "❤️" },
                    { label: "Purchases", value: dashData?.purchaseCount || purchaseHistory.length, icon: "🏠" },
                    { label: "Unread Messages", value: unreadMsgs, icon: "💬" },
                    { label: "Notifications", value: unreadNotifs, icon: "🔔" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{s.icon}</span>
                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">{s.label}</p>
                      </div>
                      <p className="mt-2 font-display text-2xl font-bold text-on-surface">{s.value}</p>
                    </div>
                  ))}
                </div>
                {/* Quick links */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Link href="/buy" className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all text-center group">
                    <p className="text-2xl mb-2">🏡</p>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Browse Properties</p>
                    <p className="text-xs text-on-surface-variant mt-1">Find your dream home</p>
                  </Link>
                  <Link href="/rent" className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all text-center group">
                    <p className="text-2xl mb-2">🔑</p>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Rent a Property</p>
                    <p className="text-xs text-on-surface-variant mt-1">Explore rentals</p>
                  </Link>
                  <button onClick={() => setActiveTab("favorites")} className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all text-center group">
                    <p className="text-2xl mb-2">❤️</p>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">My Favorites</p>
                    <p className="text-xs text-on-surface-variant mt-1">{favs.length} saved</p>
                  </button>
                </div>
              </div>
            )}

            {/* FAVORITES */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Saved Properties</h1>
                {favs.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No saved properties yet.</p>
                    <Link href="/buy" className="btn-primary mt-4 inline-block text-sm">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {favs.map((p) => (
                      <div key={p.id} className="rounded-2xl bg-surface-container-lowest shadow-ambient overflow-hidden">
                        {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />}
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold text-on-surface">{p.title}</h3>
                          <p className="text-sm text-on-surface-variant">{p.city}, {p.state}</p>
                          <p className="text-lg font-bold text-primary">{formatPrice(p.price, p.currency || "USD")}</p>
                          <div className="flex gap-2">
                            <Link href={`/properties/${p.slug || p.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90">View Details</Link>
                            <button onClick={() => removeFav(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PURCHASE HISTORY */}
            {activeTab === "purchases" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Purchase History</h1>
                {purchaseHistory.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No purchases yet. Browse properties to make your first purchase!</p>
                    <Link href="/buy" className="btn-primary mt-4 inline-block text-sm">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchaseHistory.map((p) => (
                      <div key={p.id} className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient flex items-center gap-4">
                        {p.propertyImage && <img src={p.propertyImage} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                        <div className="flex-1">
                          <p className="font-medium text-on-surface">{p.propertyTitle}</p>
                          <p className="text-xs text-on-surface-variant">{p.propertyCity} • {p.type === "buy_now" ? "Direct Purchase" : "Offer"} • {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatPrice(p.offerPrice, p.currency)}</p>
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES */}
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
                            <p className="text-sm font-semibold text-on-surface">{m.direction === "received" ? `From: ${m.fromName}` : `To: ${m.toName}`}</p>
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

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl font-bold text-on-surface">Notifications</h1>
                  {unreadNotifs > 0 && (
                    <button onClick={async () => { await notificationApi.markAllRead(); setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true }))); }} className="text-sm text-primary font-medium">Mark all as read</button>
                  )}
                </div>
                {notifs.length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No notifications.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifs.map((n) => (
                      <div key={n.id} onClick={() => !n.isRead && markNotifRead(n.id)}
                        className={`rounded-2xl p-4 shadow-ambient cursor-pointer transition-all ${n.isRead ? "bg-surface-container-lowest" : "bg-primary-fixed/10 border-l-4 border-primary"}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{n.title}</p>
                            <p className="text-sm text-on-surface-variant mt-1">{n.body}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-xs text-outline">{new Date(n.createdAt).toLocaleDateString()}</p>
                            {!n.isRead && <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
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
                    <div><label className="block text-xs font-medium text-on-surface-variant mb-1">Current Password</label><input type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" /></div>
                    <div><label className="block text-xs font-medium text-on-surface-variant mb-1">New Password</label><input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary" /></div>
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
