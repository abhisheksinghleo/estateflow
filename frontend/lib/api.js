// REAL ESTATE/frontend/lib/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// ── Mock fallback data ──
import {
  properties as mockProperties,
  agents as mockAgents,
  stats as mockStats,
  featuredProperties as mockFeatured,
  getPropertyBySlug as mockGetBySlug,
  getPropertiesByListingType as mockGetByType,
} from "./mockData";

const useMockFallback = true;

const withMockFallback = async (apiCall, fallbackValue) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (useMockFallback) return fallbackValue;
    throw error;
  }
};

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
    const fallback = applyPropertyFilters(mockProperties, params);
    return withMockFallback(() => api.get("/properties", { params }), fallback);
  },

  async getPropertiesByType(listingType) {
    return withMockFallback(
      () => api.get("/properties", { params: { listingType } }),
      mockGetByType(listingType),
    );
  },

  async getFeaturedProperties() {
    return withMockFallback(() => api.get("/properties/featured"), mockFeatured);
  },

  async getPropertyBySlug(slug) {
    return withMockFallback(() => api.get(`/properties/${slug}`), mockGetBySlug(slug) || null);
  },
};

// ══════════════════════════════════════════════════
// AGENT API
// ══════════════════════════════════════════════════

export const agentApi = {
  async getAgents() { return withMockFallback(() => api.get("/agents"), mockAgents); },
  async getAgentById(id) {
    return withMockFallback(() => api.get(`/agents/${id}`), mockAgents.find((a) => a.id === id) || null);
  },
};

// ══════════════════════════════════════════════════
// STATS API
// ══════════════════════════════════════════════════

export const statsApi = {
  async getStats() { return withMockFallback(() => api.get("/stats"), mockStats); },
};

// ══════════════════════════════════════════════════
// INQUIRY API
// ══════════════════════════════════════════════════

export const inquiryApi = {
  async createInquiry(payload) {
    return withMockFallback(() => api.post("/inquiries", payload), { success: true, message: "Inquiry submitted successfully.", data: payload });
  },
};

// ══════════════════════════════════════════════════
// CONTACT API
// ══════════════════════════════════════════════════

export const contactApi = {
  async submitContact(payload) {
    return withMockFallback(() => api.post("/contact", payload), { success: true, message: "Thanks! Your message has been sent." });
  },
  async getOfficeLocations() {
    return withMockFallback(() => api.get("/contact/offices"), [
      { city: "Austin", address: "124 Greenwood Ave, Austin, TX 78704", phone: "+1 (555) 120-4488", email: "austin@estateflow.com" },
      { city: "New York", address: "88 Riverfront St, New York, NY 10019", phone: "+1 (555) 889-3021", email: "nyc@estateflow.com" },
      { city: "Mumbai", address: "14th Floor, BKC, Mumbai 400051", phone: "+91 22 4455 6677", email: "mumbai@estateflow.com" },
    ]);
  },
};

// ══════════════════════════════════════════════════
// AUTH API
// ══════════════════════════════════════════════════

export const authApi = {
  async login(payload) { return (await api.post("/auth/login", payload)).data; },
  async register(payload) { return (await api.post("/auth/register", payload)).data; },
  async getMe() { return (await api.get("/auth/me")).data; },
  async updateProfile(payload) { return (await api.put("/auth/profile", payload)).data; },
};

// ══════════════════════════════════════════════════
// FAVORITES API
// ══════════════════════════════════════════════════

export const favoriteApi = {
  async getFavorites() { return withMockFallback(() => api.get("/favorites"), []); },
  async addFavorite(propertyId) { return (await api.post(`/favorites/${propertyId}`)).data; },
  async removeFavorite(propertyId) { return (await api.delete(`/favorites/${propertyId}`)).data; },
};

// ══════════════════════════════════════════════════
// SELLER API — Property management for sellers
// ══════════════════════════════════════════════════

export const sellerApi = {
  async getMyProperties() { return (await api.get("/seller/properties")).data; },

  async createProperty(payload) { return (await api.post("/seller/properties", payload)).data; },

  async updateProperty(id, payload) { return (await api.put(`/seller/properties/${id}`, payload)).data; },

  async deleteProperty(id) { return (await api.delete(`/seller/properties/${id}`)).data; },

  async togglePublish(id) { return (await api.put(`/seller/properties/${id}/publish`)).data; },

  async getLeads() { return (await api.get("/seller/leads")).data; },

  async getSoldProperties() { return (await api.get("/seller/sold")).data; },
};

// ══════════════════════════════════════════════════
// PURCHASE API — Buy/Offer for buyers
// ══════════════════════════════════════════════════

export const purchaseApi = {
  /** type: 'buy_now' | 'offer' */
  async buyProperty(payload) { return (await api.post("/purchases", payload)).data; },

  async getPurchaseHistory() { return (await api.get("/purchases")).data; },

  async respondToOffer(purchaseId, action) {
    return (await api.put(`/purchases/${purchaseId}/respond`, { action })).data;
  },
};

// ══════════════════════════════════════════════════
// MESSAGES API
// ══════════════════════════════════════════════════

export const messageApi = {
  async getMessages() { return (await api.get("/messages")).data; },

  async sendMessage(payload) { return (await api.post("/messages", payload)).data; },

  async markRead(id) { return (await api.put(`/messages/${id}/read`)).data; },
};

// ══════════════════════════════════════════════════
// NOTIFICATIONS API
// ══════════════════════════════════════════════════

export const notificationApi = {
  async getNotifications() { return (await api.get("/notifications")).data; },

  async markRead(id) { return (await api.put(`/notifications/${id}/read`)).data; },

  async markAllRead() { return (await api.put("/notifications/read-all")).data; },
};

// ══════════════════════════════════════════════════
// ADMIN API
// ══════════════════════════════════════════════════

export const adminApi = {
  async getUsers() { return (await api.get("/admin/users")).data; },
  async createUser(payload) { return (await api.post("/admin/users", payload)).data; },
  async updateUser(id, payload) { return (await api.put(`/admin/users/${id}`, payload)).data; },
  async deleteUser(id) { return (await api.delete(`/admin/users/${id}`)).data; },
  async getCoAdmins() { return (await api.get("/admin/co-admins")).data; },
  async createCoAdmin(payload) { return (await api.post("/admin/co-admins", payload)).data; },
  async updateCoAdminPermissions(id, permissions) { return (await api.put(`/admin/co-admins/${id}/permissions`, permissions)).data; },
  async revokeCoAdmin(id) { return (await api.delete(`/admin/co-admins/${id}`)).data; },
  async createProperty(payload) { return (await api.post("/admin/properties", payload)).data; },
  async deleteProperty(id) { return (await api.delete(`/admin/properties/${id}`)).data; },
};

// ══════════════════════════════════════════════════
// DASHBOARD APIs
// ══════════════════════════════════════════════════

export const dashboardApi = {
  async getAdminOverview() {
    return withMockFallback(() => api.get("/dashboard/admin"), {
      metrics: [], complianceAlerts: [], systemHealth: [],
    });
  },
  async getBuyerDashboard() {
    return withMockFallback(() => api.get("/dashboard/buyer"), {
      userName: "User", favoriteCount: 0, purchaseCount: 0, unreadMessages: 0, unreadNotifications: 0,
    });
  },
  async getSellerDashboard() {
    return withMockFallback(() => api.get("/dashboard/seller"), {
      userName: "Seller", listingSummary: [], totalListings: 0, unreadMessages: 0, unreadNotifications: 0,
    });
  },
  async getAgentDashboard() {
    return withMockFallback(() => api.get("/dashboard/agent"), {
      leadStats: [], assignedProperties: [], unreadMessages: 0,
    });
  },
};

// ── Filter utility for mock mode ──
function applyPropertyFilters(properties, params = {}) {
  let result = [...properties];
  if (params.type) result = result.filter((p) => p.type === String(params.type));
  if (params.listingType) result = result.filter((p) => p.listingType === String(params.listingType));
  if (params.city) { const c = String(params.city).toLowerCase(); result = result.filter((p) => p.city.toLowerCase().includes(c)); }
  if (params.location) { const l = String(params.location).toLowerCase(); result = result.filter((p) => `${p.city} ${p.state} ${p.address}`.toLowerCase().includes(l)); }
  if (params.minPrice != null) result = result.filter((p) => p.price >= Number(params.minPrice));
  if (params.maxPrice != null) result = result.filter((p) => p.price <= Number(params.maxPrice));
  if (params.beds != null) result = result.filter((p) => p.beds >= Number(params.beds));
  if (params.baths != null) result = result.filter((p) => p.baths >= Number(params.baths));
  return result;
}

export default api;
