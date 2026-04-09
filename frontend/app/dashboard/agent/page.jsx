"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, messageApi, authApi, formatPrice } from "@/lib/api";

/* ═══ ICONS ═══ */
const icons = {
  overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  assignments: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  messages: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

const tabs = [
  { key: "overview", label: "Overview", icon: icons.overview },
  { key: "assignments", label: "Assigned Properties", icon: icons.assignments },
  { key: "messages", label: "Messages", icon: icons.messages },
  { key: "profile", label: "Profile", icon: icons.profile },
];

function StatusBadge({ status }) {
  const m = { active: "bg-emerald-100 text-emerald-700", sold: "bg-blue-100 text-blue-700", draft: "bg-gray-200 text-gray-600", pending: "bg-amber-100 text-amber-700" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m[status] || "bg-gray-100 text-gray-600"}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
}

export default function AgentDashboardPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashData, setDashData] = useState(null);
  const [msgs, setMsgs] = useState([]);
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
      const [dash, messages] = await Promise.all([
        dashboardApi.getAgentDashboard(),
        messageApi.getMessages().catch(() => []),
      ]);
      setDashData(dash);
      setMsgs(messages);
    } catch (e) { console.error(e); }
    setLoading(false);
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
      setProfileMsg("❌ " + (e.response?.data?.message || "Failed"));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const unreadMsgs = msgs.filter((m) => m.direction === "received" && !m.isRead).length;

  return (
    <div className="flex min-h-screen bg-surface">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-20 left-4 z-50 lg:hidden rounded-xl bg-surface-container-lowest p-2 shadow-ambient">
        <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-container-lowest shadow-ambient-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 pt-20 lg:pt-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">{user?.name?.charAt(0) || "A"}</div>
            <div>
              <p className="font-semibold text-on-surface text-sm">{user?.name || "Agent"}</p>
              <p className="text-xs text-on-surface-variant">Agent Account</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === t.key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low"}`}>
                {t.icon}
                {t.label}
                {t.key === "messages" && unreadMsgs > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadMsgs}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-on-surface">Agent Workspace</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Manage assigned properties and track performance.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(dashData?.leadStats || []).map((s) => (
                    <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient hover:shadow-ambient-lg transition-all">
                      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">{s.label}</p>
                      <p className="mt-2 font-display text-2xl font-bold text-on-surface">{s.value}</p>
                    </div>
                  ))}
                </div>
                {/* Assigned properties preview */}
                <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient">
                  <h2 className="font-display text-lg font-semibold text-on-surface mb-4">Assigned Properties</h2>
                  {(dashData?.assignedProperties || []).length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No properties assigned yet. Sellers will assign you properties to list.</p>
                  ) : (
                    <div className="space-y-2">
                      {(dashData?.assignedProperties || []).map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-on-surface">{p.title}</p>
                            <p className="text-xs text-on-surface-variant">{p.city} • Seller: {p.sellerName}</p>
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

            {/* ASSIGNED PROPERTIES */}
            {activeTab === "assignments" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl font-bold text-on-surface">Assigned Properties</h1>
                {(dashData?.assignedProperties || []).length === 0 ? (
                  <div className="rounded-2xl bg-surface-container-lowest p-10 text-center shadow-ambient">
                    <p className="text-on-surface-variant">No properties assigned to you yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(dashData?.assignedProperties || []).map((p) => (
                      <div key={p.id} className="rounded-2xl bg-surface-container-lowest shadow-ambient p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-on-surface">{p.title}</h3>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-sm text-on-surface-variant">{p.city} • Seller: {p.sellerName}</p>
                        <p className="text-lg font-bold text-primary">{formatPrice(p.price, p.currency)}</p>
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
