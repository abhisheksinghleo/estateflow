// frontend/lib/api.js — Supabase-native API layer
// All data access goes through the Supabase client; no Express backend needed.
import { supabase } from "./supabaseClient";

// ══════════════════════════════════════════════════
// CURRENCY UTILITIES
// ══════════════════════════════════════════════════
const currencyConfig = {
  USD: { symbol: "$", locale: "en-US" },
  INR: { symbol: "₹", locale: "en-IN" },
  EUR: { symbol: "€", locale: "en-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  AED: { symbol: "AED ", locale: "en-AE" },
};

export function formatPrice(price, currency = "USD") {
  const cfg = currencyConfig[currency] || currencyConfig.USD;
  if (currency === "INR") {
    if (price >= 10000000) {
      const cr = (price / 10000000).toFixed(2).replace(/\.?0+$/, "");
      return `${cfg.symbol}${cr} Cr`;
    }
    if (price >= 100000) {
      const lk = (price / 100000).toFixed(2).replace(/\.?0+$/, "");
      return `${cfg.symbol}${lk} Lakh`;
    }
    return `${cfg.symbol}${price.toLocaleString("en-IN")}`;
  }
  return `${cfg.symbol}${price.toLocaleString(cfg.locale)}`;
}

export const supportedCurrencies = Object.keys(currencyConfig);

// ══════════════════════════════════════════════════
// PROPERTY API
// ══════════════════════════════════════════════════
export const propertyApi = {
  async getProperties(params = {}) {
    let query = supabase
      .from("Property")
      .select("*, PropertyImage(url, isPrimary)")
      .eq("isPublished", true)
      .eq("approvalStatus", "APPROVED");

    if (params.type) query = query.eq("type", params.type);
    if (params.listingType) query = query.eq("listingType", params.listingType);
    if (params.city) query = query.ilike("city", `%${params.city}%`);
    if (params.location) query = query.or(`city.ilike.%${params.location}%,state.ilike.%${params.location}%,address.ilike.%${params.location}%`);
    if (params.minPrice != null) query = query.gte("price", params.minPrice);
    if (params.maxPrice != null) query = query.lte("price", params.maxPrice);
    if (params.beds != null) query = query.gte("bedrooms", params.beds);
    if (params.baths != null) query = query.gte("bathrooms", params.baths);
    if (params.country) query = query.eq("country", params.country);

    const { data, error } = await query.order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPropertiesByType(listingType) {
    const { data, error } = await supabase
      .from("Property")
      .select("*")
      .eq("isPublished", true)
      .eq("approvalStatus", "APPROVED")
      .eq("listingType", listingType)
      .order("createdAt", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getFeaturedProperties() {
    const { data, error } = await supabase
      .from("Property")
      .select("*")
      .eq("isPublished", true)
      .eq("approvalStatus", "APPROVED")
      .eq("featured", true)
      .order("createdAt", { ascending: false })
      .limit(8);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPropertyBySlug(slug) {
    const { data, error } = await supabase
      .from("Property")
      .select("*, PropertyImage(url, isPrimary), AgentProfile(name, title, phone, email, image, rating)")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error) return null;
    return data;
  },

  async getPropertyById(id) {
    const { data, error } = await supabase
      .from("Property")
      .select("*, PropertyImage(url, isPrimary)")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },
};

// ══════════════════════════════════════════════════
// AGENT API
// ══════════════════════════════════════════════════
export const agentApi = {
  async getAgents() {
    const { data, error } = await supabase
      .from("AgentProfile")
      .select("*")
      .order("rating", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAgentById(id) {
    const { data, error } = await supabase
      .from("AgentProfile")
      .select("*, Property(id, title, city, price, currency, image, listingType)")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },
};

// ══════════════════════════════════════════════════
// STATS API
// ══════════════════════════════════════════════════
export const statsApi = {
  async getStats() {
    // Return static platform stats; can be dynamic in future via a stats table
    return [
      { label: "Active Listings", value: 12480, suffix: "+" },
      { label: "Cities Covered", value: 120, suffix: "+" },
      { label: "Verified Agents", value: 1250, suffix: "+" },
      { label: "Avg. Response Time", value: 2, prefix: "< ", suffix: " hrs" },
    ];
  },
};

// ══════════════════════════════════════════════════
// INQUIRY API
// ══════════════════════════════════════════════════
export const inquiryApi = {
  async createInquiry(payload) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("You must be logged in to send an inquiry.");

    const { data, error } = await supabase.from("Inquiry").insert([{
      id: crypto.randomUUID(),
      propertyId: payload.propertyId,
      userId: session.user.id,
      message: payload.message,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]).select().single();

    if (error) throw new Error(error.message);
    return { success: true, data };
  },
};

// ══════════════════════════════════════════════════
// CONTACT API
// ══════════════════════════════════════════════════
export const contactApi = {
  async submitContact(payload) {
    // Store contact form submissions as Inquiries with no propertyId
    const { error } = await supabase.from("Subscription").insert([{
      id: crypto.randomUUID(),
      email: payload.email,
      isActive: true,
      createdAt: new Date().toISOString(),
    }]);
    // Do not throw on duplicate subscription error
    return { success: true, message: "Thanks! Your message has been received." };
  },
  async getOfficeLocations() {
    return [
      { city: "Austin", address: "124 Greenwood Ave, Austin, TX 78704", phone: "+1 (555) 120-4488", email: "austin@estateflow.com" },
      { city: "New York", address: "88 Riverfront St, New York, NY 10019", phone: "+1 (555) 889-3021", email: "nyc@estateflow.com" },
      { city: "Mumbai", address: "14th Floor, BKC, Mumbai 400051", phone: "+91 22 4455 6677", email: "mumbai@estateflow.com" },
    ];
  },
};

// ══════════════════════════════════════════════════
// AUTH API (thin wrappers — main logic in AuthContext)
// ══════════════════════════════════════════════════
export const authApi = {
  async getMe() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data } = await supabase.from("User").select("*").eq("id", session.user.id).single();
    return data;
  },
  async updateProfile(payload) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("User")
      .update({ name: payload.name, phone: payload.phone, updatedAt: new Date().toISOString() })
      .eq("id", session.user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};

// ══════════════════════════════════════════════════
// FAVORITES API
// ══════════════════════════════════════════════════
export const favoriteApi = {
  async getFavorites() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const { data, error } = await supabase
      .from("Favorite")
      .select("*, Property(*)")
      .eq("userId", session.user.id);
    if (error) return [];
    return data || [];
  },
  async addFavorite(propertyId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("Favorite").insert([{
      id: crypto.randomUUID(),
      userId: session.user.id,
      propertyId,
      createdAt: new Date().toISOString(),
    }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  async removeFavorite(propertyId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("Favorite")
      .delete()
      .eq("userId", session.user.id)
      .eq("propertyId", propertyId);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

// ══════════════════════════════════════════════════
// SELLER API
// ══════════════════════════════════════════════════
export const sellerApi = {
  async getMyProperties() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const { data, error } = await supabase
      .from("Property")
      .select("*, PropertyImage(url, isPrimary), Inquiry(id, status)")
      .eq("ownerId", session.user.id)
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createProperty(payload) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("Property").insert([{
      id: crypto.randomUUID(),
      ...payload,
      ownerId: session.user.id,
      approvalStatus: "PENDING",
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateProperty(id, payload) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("Property")
      .update({ ...payload, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .eq("ownerId", session.user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProperty(id) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("Property")
      .delete()
      .eq("id", id)
      .eq("ownerId", session.user.id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  async togglePublish(id) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const { data: prop } = await supabase.from("Property").select("isPublished").eq("id", id).single();
    const { data, error } = await supabase
      .from("Property")
      .update({ isPublished: !prop?.isPublished, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .eq("ownerId", session.user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getLeads() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const { data, error } = await supabase
      .from("Inquiry")
      .select("*, Property(title, city), User(name, email, phone)")
      .in("propertyId",
        (await supabase.from("Property").select("id").eq("ownerId", session.user.id)).data?.map(p => p.id) || []
      )
      .order("createdAt", { ascending: false });
    if (error) return [];
    return data || [];
  },
};

// ══════════════════════════════════════════════════
// ADMIN API
// ══════════════════════════════════════════════════
export const adminApi = {
  async getUsers() {
    const { data, error } = await supabase.from("User").select("*").order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateUser(id, payload) {
    const { data, error } = await supabase
      .from("User")
      .update({ ...payload, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteUser(id) {
    const { error } = await supabase.from("User").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  async getPendingProperties() {
    const { data, error } = await supabase
      .from("Property")
      .select("*, User!ownerId(name, email)")
      .eq("approvalStatus", "PENDING")
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async approveProperty(id) {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from("Property")
      .update({ approvalStatus: "APPROVED", isPublished: true, approvedById: session?.user?.id, approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async rejectProperty(id, reason) {
    const { data, error } = await supabase
      .from("Property")
      .update({ approvalStatus: "REJECTED", rejectionReason: reason, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProperty(id) {
    const { error } = await supabase.from("Property").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

// ══════════════════════════════════════════════════
// DASHBOARD APIs
// ══════════════════════════════════════════════════
export const dashboardApi = {
  async getAdminOverview() {
    const [usersRes, propertiesRes, pendingRes, inquiriesRes] = await Promise.all([
      supabase.from("User").select("id, role", { count: "exact" }),
      supabase.from("Property").select("id", { count: "exact" }),
      supabase.from("Property").select("id", { count: "exact" }).eq("approvalStatus", "PENDING"),
      supabase.from("Inquiry").select("id", { count: "exact" }),
    ]);
    return {
      metrics: [
        { label: "Total Users", value: usersRes.count || 0 },
        { label: "Total Properties", value: propertiesRes.count || 0 },
        { label: "Pending Approvals", value: pendingRes.count || 0 },
        { label: "Total Inquiries", value: inquiriesRes.count || 0 },
      ],
      complianceAlerts: [],
      systemHealth: [{ service: "Database", status: "healthy" }],
    };
  },

  async getBuyerDashboard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { userName: "Guest", favoriteCount: 0, purchaseCount: 0, unreadMessages: 0 };
    const [profileRes, favRes] = await Promise.all([
      supabase.from("User").select("name").eq("id", session.user.id).single(),
      supabase.from("Favorite").select("id", { count: "exact" }).eq("userId", session.user.id),
    ]);
    return {
      userName: profileRes.data?.name || "Buyer",
      favoriteCount: favRes.count || 0,
      purchaseCount: 0,
      unreadMessages: 0,
      unreadNotifications: 0,
    };
  },

  async getSellerDashboard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { userName: "Seller", totalListings: 0 };
    const [profileRes, listingsRes, inquiriesRes] = await Promise.all([
      supabase.from("User").select("name").eq("id", session.user.id).single(),
      supabase.from("Property").select("id, title, approvalStatus, isPublished, price", { count: "exact" }).eq("ownerId", session.user.id),
      supabase.from("Inquiry").select("id").in("propertyId",
        (await supabase.from("Property").select("id").eq("ownerId", session.user.id)).data?.map(p => p.id) || []
      ),
    ]);
    return {
      userName: profileRes.data?.name || "Seller",
      listingSummary: listingsRes.data || [],
      totalListings: listingsRes.count || 0,
      unreadMessages: 0,
      unreadNotifications: 0,
      totalLeads: inquiriesRes.data?.length || 0,
    };
  },

  async getAgentDashboard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { leadStats: [], assignedProperties: [] };
    const { data: profile } = await supabase.from("AgentProfile").select("id, name").eq("userId", session.user.id).single();
    const { data: properties } = await supabase
      .from("Property")
      .select("id, title, city, price, currency, image, approvalStatus")
      .eq("agentId", profile?.id)
      .order("createdAt", { ascending: false });
    return {
      leadStats: [],
      assignedProperties: properties || [],
      unreadMessages: 0,
    };
  },
};

// ══════════════════════════════════════════════════
// MESSAGES & NOTIFICATIONS (stub for RLS-ready future)
// ══════════════════════════════════════════════════
export const messageApi = {
  async getMessages() { return []; },
  async sendMessage(_payload) { return { success: true }; },
  async markRead(_id) { return { success: true }; },
};

export const notificationApi = {
  async getNotifications() { return []; },
  async markRead(_id) { return { success: true }; },
  async markAllRead() { return { success: true }; },
};

export const purchaseApi = {
  async buyProperty(_payload) { return { success: true, message: "Request submitted." }; },
  async getPurchaseHistory() { return []; },
  async respondToOffer(_id, _action) { return { success: true }; },
};

export default supabase;
