// REAL ESTATE/frontend/lib/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional request interceptor for auth token support
api.interceptors.request.use(
  (config) => {
    // TODO: replace with your auth/session implementation
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: integrate toast/logger service here if needed
    return Promise.reject(error);
  },
);

// ---- Mock fallback data for MVP mode ----
const MOCK_PROPERTIES = [
  {
    id: "p1",
    slug: "modern-villa-california",
    title: "Modern Villa in California",
    type: "buy",
    price: 1250000,
    beds: 4,
    baths: 3,
    area: 3200,
    city: "Los Angeles",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "p2",
    slug: "downtown-luxury-apartment",
    title: "Downtown Luxury Apartment",
    type: "rent",
    price: 3200,
    beds: 2,
    baths: 2,
    area: 1100,
    city: "New York",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "p3",
    slug: "suburban-family-home",
    title: "Suburban Family Home",
    type: "buy",
    price: 640000,
    beds: 3,
    baths: 2,
    area: 2100,
    city: "Austin",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

const useMockFallback =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
  process.env.NODE_ENV !== "production";

const withMockFallback = async (apiCall, fallbackValue) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (useMockFallback) {
      // TODO: remove fallback when backend API is stable
      return fallbackValue;
    }
    throw error;
  }
};

// ---- Property API helpers ----
export const propertyApi = {
  /**
   * Fetch all properties.
   * @param {Object} params - Optional query params: { type, minPrice, maxPrice, city, beds, baths, page, limit }
   */
  async getProperties(params = {}) {
    const fallback = applyPropertyFilters(MOCK_PROPERTIES, params);
    return withMockFallback(() => api.get("/properties", { params }), fallback);
  },

  /**
   * Fetch featured properties.
   */
  async getFeaturedProperties() {
    const fallback = MOCK_PROPERTIES.filter((p) => p.featured);
    return withMockFallback(() => api.get("/properties/featured"), fallback);
  },

  /**
   * Fetch single property by slug.
   */
  async getPropertyBySlug(slug) {
    const fallback =
      MOCK_PROPERTIES.find((p) => p.slug === slug) || MOCK_PROPERTIES[0];
    return withMockFallback(() => api.get(`/properties/${slug}`), fallback);
  },
};

// ---- Generic helpers (optional for future use) ----
export const inquiryApi = {
  /**
   * Submit a property inquiry.
   */
  async createInquiry(payload) {
    const fallback = {
      success: true,
      message: "Inquiry submitted (mock mode).",
      data: payload,
    };
    return withMockFallback(() => api.post("/inquiries", payload), fallback);
  },
};

export const authApi = {
  async login(payload) {
    const fallback = {
      token: "mock-jwt-token",
      user: { id: "u1", name: "Demo User", role: "buyer" },
    };
    return withMockFallback(() => api.post("/auth/login", payload), fallback);
  },

  async register(payload) {
    const fallback = {
      token: "mock-jwt-token",
      user: { id: "u2", name: payload?.name || "New User", role: "buyer" },
    };
    return withMockFallback(
      () => api.post("/auth/register", payload),
      fallback,
    );
  },
};

// ---- Local filter utility for mock mode ----
function applyPropertyFilters(properties, params = {}) {
  let result = [...properties];

  if (params.type) {
    result = result.filter((p) => p.type === String(params.type));
  }

  if (params.city) {
    const city = String(params.city).toLowerCase();
    result = result.filter((p) => p.city.toLowerCase().includes(city));
  }

  if (params.minPrice != null) {
    result = result.filter((p) => p.price >= Number(params.minPrice));
  }

  if (params.maxPrice != null) {
    result = result.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.beds != null) {
    result = result.filter((p) => p.beds >= Number(params.beds));
  }

  if (params.baths != null) {
    result = result.filter((p) => p.baths >= Number(params.baths));
  }

  return result;
}

export default api;
