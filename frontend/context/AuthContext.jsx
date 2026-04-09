"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Restore session on app mount ── */
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((res) => {
        const u = res?.user || res;
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Login ── */
  const login = useCallback(
    async (email, password) => {
      const { token, user: userData } = await authApi.login({ email, password });
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(userData));
      }
      setUser(userData);
      return userData;
    },
    [],
  );

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/");
  }, [router]);

  /* ── Update user in context (after profile edit etc.) ── */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("authUser", JSON.stringify(next));
      return next;
    });
  }, []);

  const isAuthenticated = !!user;

  const getDashboardPath = useCallback(() => {
    if (!user) return "/auth/login";
    const role = user.role?.toLowerCase() || "buyer";
    const roleMap = {
      buyer: "/dashboard/buyer",
      seller: "/dashboard/seller",
      agent: "/dashboard/agent",
      admin: "/dashboard/admin",
      admin_head: "/dashboard/admin",
      admin_co: "/dashboard/admin",
      admin_co_head: "/dashboard/admin",
    };
    return roleMap[role] || "/dashboard/buyer";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
