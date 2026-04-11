"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, adminApi, propertyApi, authApi } from "@/lib/api";
import useApi from "@/lib/useApi";
import FadeIn from "@/components/animations/FadeIn";
import { DashboardLoadingSkeleton } from "@/components/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

/* ── Sidebar Nav Item ── */
function SidebarItem({ icon, label, tabKey, activeTab, setActiveTab, badge }) {
  const active = activeTab === tabKey;
  return (
    <button onClick={() => setActiveTab(tabKey)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-body-sm font-medium transition-all duration-200 ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
        }`}>
      <span className="text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"}`}>{badge}</span>}
    </button>
  );
}

function severityStyles(s) {
  if (s === "high") return "bg-rose-50 text-rose-700";
  if (s === "medium") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

function AdminDashboardPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user } = useAuth();

  const isHeadAdmin = user?.role === "admin_head" || user?.role === "admin";
  const { data: overview, loading: overviewLoading } = useApi(() => dashboardApi.getAdminOverview(), [], null);
  const { data: propertiesList, refetch: refetchProps } = useApi(() => propertyApi.getProperties(), [], []);
  const [allUsers, setAllUsers] = useState([]);
  const [coAdmins, setCoAdmins] = useState([]);

  /* ── User management state ── */
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "buyer", phone: "" });
  const [userStatus, setUserStatus] = useState("");

  /* ── Co-admin state ── */
  const [showCreateCoAdmin, setShowCreateCoAdmin] = useState(false);
  const [coAdminForm, setCoAdminForm] = useState({
    name: "", email: "", password: "", phone: "",
    permissions: { canApproveListings: true, canManageUsers: false, canManageBlogs: false, canListProperties: false, canViewAnalytics: false, canManageInquiries: false }
  });
  const [coAdminStatus, setCoAdminStatus] = useState("");

  /* ── Add property state ── */
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [propForm, setPropForm] = useState({
    title: "", description: "", type: "House", listingType: "buy",
    price: "", beds: "", baths: "", area: "", address: "", city: "", state: "",
  });
  const [propStatus, setPropStatus] = useState("");

  /* ── Profile state ── */
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });
  const { updateUser } = useAuth();

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  }, [user]);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) setActiveTab(t);
  }, [searchParams]);

  const loadUsers = async () => { try { const d = await adminApi.getUsers(); setAllUsers(d); } catch (e) { console.error(e); } };
  const loadCoAdmins = async () => { try { const d = await adminApi.getCoAdmins(); setCoAdmins(d); } catch (e) { console.error(e); } };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "co-admins") loadCoAdmins();
  }, [activeTab]);

  if (overviewLoading || !overview) return <DashboardLoadingSkeleton statCount={4} />;

  const { metrics, complianceAlerts, systemHealth } = overview;

  const handleCreateUser = async () => {
    setUserStatus("");
    try {
      await adminApi.createUser(newUserForm);
      setUserStatus("✓ User created successfully");
      setNewUserForm({ name: "", email: "", password: "", role: "buyer", phone: "" });
      setShowCreateUser(false);
      loadUsers();
    } catch (e) { setUserStatus("✕ " + (e?.response?.data?.message || "Failed")); }
  };

  const handleCreateCoAdmin = async () => {
    setCoAdminStatus("");
    try {
      await adminApi.createCoAdmin({ name: coAdminForm.name, email: coAdminForm.email, password: coAdminForm.password, phone: coAdminForm.phone, permissions: coAdminForm.permissions });
      setCoAdminStatus("✓ Co-admin created");
      setShowCreateCoAdmin(false);
      setCoAdminForm({ name: "", email: "", password: "", phone: "", permissions: { canApproveListings: true, canManageUsers: false, canManageBlogs: false, canListProperties: false, canViewAnalytics: false, canManageInquiries: false } });
      loadCoAdmins();
    } catch (e) { setCoAdminStatus("✕ " + (e?.response?.data?.message || "Failed")); }
  };

  const handleAddProperty = async () => {
    setPropStatus("");
    try {
      await adminApi.createProperty(propForm);
      setPropStatus("✓ Property listed");
      setShowAddProperty(false);
      setPropForm({ title: "", description: "", type: "House", listingType: "buy", price: "", beds: "", baths: "", area: "", address: "", city: "", state: "" });
      refetchProps();
    } catch (e) { setPropStatus("✕ " + (e?.response?.data?.message || "Failed")); }
  };

  const handleDeleteProp = async (id) => {
    try { await adminApi.deleteProperty(id); refetchProps(); } catch (e) { console.error(e); }
  };

  const handleToggleUser = async (id, isActive) => {
    try { await adminApi.updateUser(id, { isActive: !isActive }); loadUsers(); } catch (e) { console.error(e); }
  };

  const handleUpdatePermissions = async (userId, perms) => {
    try { await adminApi.updateCoAdminPermissions(userId, perms); loadCoAdmins(); } catch (e) { console.error(e); }
  };

  const handleRevokeCoAdmin = async (id) => {
    try { await adminApi.revokeCoAdmin(id); loadCoAdmins(); } catch (e) { console.error(e); }
  };

  const handleProfileSave = async () => {
    try {
      const res = await authApi.updateProfile(profileForm);
      updateUser(res.user);
      setProfileStatus({ type: "success", message: "Saved!" });
    } catch (e) { setProfileStatus({ type: "error", message: e?.response?.data?.message || "Failed" }); }
  };

  const sidebarItems = [
    { icon: "📊", label: "Overview", tabKey: "overview" },
    { icon: "👤", label: "My Profile", tabKey: "profile" },
    { icon: "🏠", label: "All Properties", tabKey: "properties", badge: propertiesList?.length },
    { icon: "➕", label: "Add Property", tabKey: "add-property" },
    ...(isHeadAdmin ? [
      { icon: "👥", label: "User Management", tabKey: "users" },
      { icon: "🛡️", label: "Co-Admin Panel", tabKey: "co-admins" },
    ] : []),
  ];

  return (
    <section className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-1 rounded-2xl bg-surface-container-lowest p-3 shadow-ambient">
              <div className="mb-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
                    {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">{user?.name}</p>
                    <p className="text-[10px] font-bold uppercase text-rose-600">{isHeadAdmin ? "HEAD ADMIN" : "CO-ADMIN"}</p>
                  </div>
                </div>
              </div>
              {sidebarItems.map((item) => <SidebarItem key={item.tabKey} {...item} activeTab={activeTab} setActiveTab={setActiveTab} />)}
            </div>
          </aside>

          {/* ── Mobile tabs ── */}
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-surface-container-low p-1 lg:hidden w-full">
            {sidebarItems.map((item) => (
              <button key={item.tabKey} onClick={() => setActiveTab(item.tabKey)}
                className={`flex-shrink-0 rounded-lg px-3 py-2 text-label-sm font-semibold whitespace-nowrap transition-all ${activeTab === item.tabKey ? "bg-primary text-white shadow" : "text-on-surface-variant"}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* ── Main Content ── */}
          <div className="min-w-0 flex-1 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                {/* ═══ OVERVIEW ═══ */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <header className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                      <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">Admin Dashboard</span>
                      <h1 className="mt-2 font-display text-headline-lg text-on-surface">Marketplace Overview</h1>
                      <p className="mt-2 max-w-3xl text-body-md text-on-surface-variant">High-level operational visibility for listings, users, inquiries, and platform health.</p>
                    </header>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {metrics.map((m) => (
                        <article key={m.label} className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1">
                          <p className="text-body-sm text-on-surface-variant">{m.label}</p>
                          <p className="mt-2 font-display text-headline-md text-on-surface">{m.value}</p>
                          <p className="mt-1 text-label-sm font-medium text-emerald-700">{m.delta}</p>
                        </article>
                      ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                      <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient lg:col-span-2">
                        <h2 className="font-display text-title-lg text-on-surface">Compliance & Moderation</h2>
                        <ul className="mt-4 space-y-3">
                          {complianceAlerts.map((a) => (
                            <li key={a.title} className="rounded-xl bg-surface-container-low p-4">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-label-lg font-semibold text-on-surface">{a.title}</h3>
                                <span className={`rounded-full px-2.5 py-1 text-label-sm font-semibold uppercase ${severityStyles(a.severity)}`}>{a.severity}</span>
                              </div>
                              <p className="mt-2 text-body-sm text-on-surface-variant">{a.detail}</p>
                            </li>
                          ))}
                        </ul>
                      </article>
                      <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                        <h2 className="font-display text-title-lg text-on-surface">System Health</h2>
                        <ul className="mt-4 space-y-3">
                          {systemHealth.map((h) => (
                            <li key={h.name} className="rounded-xl bg-surface-container-low p-4">
                              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">{h.name}</p>
                              <p className="mt-1 font-display text-title-md text-on-surface">{h.status}</p>
                              <p className="mt-1 text-label-sm text-outline">{h.note}</p>
                            </li>
                          ))}
                        </ul>
                      </article>
                    </div>
                  </div>
                )}

                {/* ═══ PROFILE ═══ */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                      <h2 className="font-display text-title-lg text-on-surface">Admin Profile</h2>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div><label className="mb-1.5 block text-label-sm font-semibold text-on-surface">Name</label><input className="input-base" value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold text-on-surface">Email</label><input className="input-base" type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold text-on-surface">Phone</label><input className="input-base" type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold text-on-surface">Role</label><input className="input-base opacity-60" value={isHeadAdmin ? "Head Admin" : "Co-Admin"} disabled /></div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button onClick={handleProfileSave} className="btn-primary">Save</button>
                        {profileStatus.message && <span className={`text-body-sm ${profileStatus.type === "success" ? "text-emerald-700" : "text-rose-700"}`}>{profileStatus.message}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ ALL PROPERTIES ═══ */}
                {activeTab === "properties" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-title-lg text-on-surface">All Properties ({propertiesList?.length || 0})</h2>
                      <button onClick={() => setActiveTab("add-property")} className="btn-primary text-sm">+ Add Property</button>
                    </div>
                    <div className="space-y-2">
                      {propertiesList?.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
                          <div className="h-14 w-14 shrink-0 rounded-xl bg-primary-fixed flex items-center justify-center text-xl">🏠</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-on-surface truncate">{p.title}</p>
                            <p className="text-body-sm text-on-surface-variant">{p.city}, {p.state} • ${p.price?.toLocaleString()} • {p.beds}bd {p.baths}ba</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${p.listingType === "buy" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{p.listingType}</span>
                          <button onClick={() => handleDeleteProp(p.id)} className="rounded-lg p-2 text-on-surface-variant hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Delete">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ ADD PROPERTY ═══ */}
                {activeTab === "add-property" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                      <h2 className="font-display text-title-lg text-on-surface">List a New Property</h2>
                      <p className="mt-1 text-body-sm text-on-surface-variant">Fill out the details to add a new property listing.</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2"><label className="mb-1.5 block text-label-sm font-semibold">Title</label><input className="input-base" placeholder="Modern Apartment in Downtown" value={propForm.title} onChange={(e) => setPropForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className="mb-1.5 block text-label-sm font-semibold">Description</label><textarea className="input-base min-h-[100px] resize-y" placeholder="Describe the property..." value={propForm.description} onChange={(e) => setPropForm(p => ({ ...p, description: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Type</label><select className="input-base" value={propForm.type} onChange={(e) => setPropForm(p => ({ ...p, type: e.target.value }))}><option>House</option><option>Apartment</option><option>Condo</option><option>Townhouse</option><option>Villa</option><option>Commercial</option></select></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Listing Type</label><select className="input-base" value={propForm.listingType} onChange={(e) => setPropForm(p => ({ ...p, listingType: e.target.value }))}><option value="buy">For Sale</option><option value="rent">For Rent</option></select></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Price ($)</label><input className="input-base" type="number" placeholder="450000" value={propForm.price} onChange={(e) => setPropForm(p => ({ ...p, price: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Area (sqft)</label><input className="input-base" type="number" placeholder="2400" value={propForm.area} onChange={(e) => setPropForm(p => ({ ...p, area: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Bedrooms</label><input className="input-base" type="number" placeholder="3" value={propForm.beds} onChange={(e) => setPropForm(p => ({ ...p, beds: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Bathrooms</label><input className="input-base" type="number" placeholder="2" value={propForm.baths} onChange={(e) => setPropForm(p => ({ ...p, baths: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">Address</label><input className="input-base" placeholder="123 Main St" value={propForm.address} onChange={(e) => setPropForm(p => ({ ...p, address: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">City</label><input className="input-base" placeholder="Austin" value={propForm.city} onChange={(e) => setPropForm(p => ({ ...p, city: e.target.value }))} /></div>
                        <div><label className="mb-1.5 block text-label-sm font-semibold">State</label><input className="input-base" placeholder="TX" value={propForm.state} onChange={(e) => setPropForm(p => ({ ...p, state: e.target.value }))} /></div>
                      </div>
                      <div className="mt-6 flex items-center gap-3">
                        <button onClick={handleAddProperty} className="btn-primary">Publish Property</button>
                        {propStatus && <span className={`text-body-sm font-medium ${propStatus.startsWith("✓") ? "text-emerald-700" : "text-rose-700"}`}>{propStatus}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ USER MANAGEMENT ═══ */}
                {activeTab === "users" && isHeadAdmin && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-title-lg text-on-surface">User Management ({allUsers.length})</h2>
                      <button onClick={() => setShowCreateUser(!showCreateUser)} className="btn-primary text-sm">+ Create User</button>
                    </div>

                    {/* Create user form */}
                    <AnimatePresence>
                      {showCreateUser && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                            <h3 className="font-display text-title-md text-on-surface mb-4">Create New User</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <input className="input-base" placeholder="Full Name" value={newUserForm.name} onChange={(e) => setNewUserForm(p => ({ ...p, name: e.target.value }))} />
                              <input className="input-base" placeholder="Email" type="email" value={newUserForm.email} onChange={(e) => setNewUserForm(p => ({ ...p, email: e.target.value }))} />
                              <input className="input-base" placeholder="Password" type="password" value={newUserForm.password} onChange={(e) => setNewUserForm(p => ({ ...p, password: e.target.value }))} />
                              <input className="input-base" placeholder="Phone" value={newUserForm.phone} onChange={(e) => setNewUserForm(p => ({ ...p, phone: e.target.value }))} />
                              <select className="input-base" value={newUserForm.role} onChange={(e) => setNewUserForm(p => ({ ...p, role: e.target.value }))}>
                                <option value="buyer">Buyer</option><option value="seller">Seller</option><option value="agent">Agent</option>
                              </select>
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                              <button onClick={handleCreateUser} className="btn-primary text-sm">Create</button>
                              <button onClick={() => setShowCreateUser(false)} className="btn-secondary text-sm">Cancel</button>
                              {userStatus && <span className={`text-body-sm font-medium ${userStatus.startsWith("✓") ? "text-emerald-700" : "text-rose-700"}`}>{userStatus}</span>}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* User list */}
                    <div className="space-y-2">
                      {allUsers.map((u) => (
                        <div key={u.id} className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-sm font-bold text-on-surface">{u.name?.[0]?.toUpperCase()}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-on-surface">{u.name}</p>
                            <p className="text-label-sm text-on-surface-variant">{u.email}</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${u.role === "admin_head" ? "bg-rose-100 text-rose-700" :
                              u.role === "admin_co" ? "bg-amber-100 text-amber-700" :
                                u.role === "seller" ? "bg-emerald-100 text-emerald-700" :
                                  u.role === "agent" ? "bg-violet-100 text-violet-700" :
                                    "bg-blue-100 text-blue-700"
                            }`}>{u.role}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{u.isActive ? "Active" : "Inactive"}</span>
                          {u.id !== user?.id && (
                            <button onClick={() => handleToggleUser(u.id, u.isActive)} className={`rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${u.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-700 hover:bg-emerald-50"}`}>
                              {u.isActive ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ CO-ADMIN MANAGEMENT ═══ */}
                {activeTab === "co-admins" && isHeadAdmin && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-title-lg text-on-surface">Co-Admin Management</h2>
                        <p className="mt-1 text-body-sm text-on-surface-variant">Create co-admins and assign granular permissions.</p>
                      </div>
                      <button onClick={() => setShowCreateCoAdmin(!showCreateCoAdmin)} className="btn-primary text-sm">+ Create Co-Admin</button>
                    </div>

                    {/* Create co-admin form */}
                    <AnimatePresence>
                      {showCreateCoAdmin && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                            <h3 className="font-display text-title-md text-on-surface mb-4">New Co-Admin</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <input className="input-base" placeholder="Full Name" value={coAdminForm.name} onChange={(e) => setCoAdminForm(p => ({ ...p, name: e.target.value }))} />
                              <input className="input-base" placeholder="Email" type="email" value={coAdminForm.email} onChange={(e) => setCoAdminForm(p => ({ ...p, email: e.target.value }))} />
                              <input className="input-base" placeholder="Password" type="password" value={coAdminForm.password} onChange={(e) => setCoAdminForm(p => ({ ...p, password: e.target.value }))} />
                              <input className="input-base" placeholder="Phone" value={coAdminForm.phone} onChange={(e) => setCoAdminForm(p => ({ ...p, phone: e.target.value }))} />
                            </div>

                            {/* Permission toggles */}
                            <h4 className="mt-6 font-display text-title-sm text-on-surface">Access Permissions</h4>
                            <p className="text-body-sm text-on-surface-variant mb-3">Choose what this co-admin can do:</p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                { key: "canApproveListings", label: "Approve/Reject Listings", icon: "✅" },
                                { key: "canManageUsers", label: "Manage Users", icon: "👥" },
                                { key: "canManageBlogs", label: "Manage Blogs", icon: "📝" },
                                { key: "canListProperties", label: "List Properties", icon: "🏠" },
                                { key: "canViewAnalytics", label: "View Analytics", icon: "📊" },
                                { key: "canManageInquiries", label: "Manage Inquiries", icon: "💬" },
                              ].map((perm) => (
                                <label key={perm.key} className={`flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-200 ${coAdminForm.permissions[perm.key] ? "bg-primary-fixed" : "bg-surface-container-low"
                                  }`}>
                                  <input type="checkbox" className="h-4 w-4 rounded accent-primary"
                                    checked={coAdminForm.permissions[perm.key]}
                                    onChange={(e) => setCoAdminForm(p => ({ ...p, permissions: { ...p.permissions, [perm.key]: e.target.checked } }))}
                                  />
                                  <span className="text-base">{perm.icon}</span>
                                  <span className="text-label-md font-medium text-on-surface">{perm.label}</span>
                                </label>
                              ))}
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                              <button onClick={handleCreateCoAdmin} className="btn-primary text-sm">Create Co-Admin</button>
                              <button onClick={() => setShowCreateCoAdmin(false)} className="btn-secondary text-sm">Cancel</button>
                              {coAdminStatus && <span className={`text-body-sm font-medium ${coAdminStatus.startsWith("✓") ? "text-emerald-700" : "text-rose-700"}`}>{coAdminStatus}</span>}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Existing co-admins */}
                    {coAdmins.length > 0 ? (
                      <div className="space-y-4">
                        {coAdmins.map((ca) => (
                          <div key={ca.id} className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">{ca.name?.[0]?.toUpperCase()}</span>
                                <div>
                                  <p className="font-semibold text-on-surface">{ca.name}</p>
                                  <p className="text-label-sm text-on-surface-variant">{ca.email}</p>
                                </div>
                              </div>
                              <button onClick={() => handleRevokeCoAdmin(ca.id)} className="rounded-lg px-3 py-1.5 text-label-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors">Revoke Access</button>
                            </div>

                            {/* Editable permission toggles */}
                            {ca.permissions && (
                              <div className="grid gap-2 sm:grid-cols-3">
                                {[
                                  { key: "canApproveListings", label: "Approve Listings" },
                                  { key: "canManageUsers", label: "Manage Users" },
                                  { key: "canManageBlogs", label: "Manage Blogs" },
                                  { key: "canListProperties", label: "List Properties" },
                                  { key: "canViewAnalytics", label: "View Analytics" },
                                  { key: "canManageInquiries", label: "Manage Inquiries" },
                                ].map((perm) => (
                                  <label key={perm.key} className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 text-label-sm transition-all ${ca.permissions[perm.key] ? "bg-emerald-50 text-emerald-700" : "bg-surface-container-low text-on-surface-variant"
                                    }`}>
                                    <input type="checkbox" className="h-3.5 w-3.5 rounded accent-primary"
                                      checked={!!ca.permissions[perm.key]}
                                      onChange={(e) => handleUpdatePermissions(ca.id, { [perm.key]: e.target.checked })}
                                    />
                                    {perm.label}
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-surface-container-lowest p-12 text-center shadow-ambient">
                        <span className="text-4xl">🛡️</span>
                        <h3 className="mt-3 font-display text-title-md text-on-surface">No co-admins yet</h3>
                        <p className="mt-2 text-body-sm text-on-surface-variant">Create a co-admin to delegate specific platform management tasks.</p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense>
      <AdminDashboardPageContent />
    </Suspense>
  );
}
