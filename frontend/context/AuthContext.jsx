"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full user profile from the public.User table
  const fetchProfile = async (authId) => {
    const { data, error } = await supabase.from('User').select('*').eq('id', authId).single();
    if (error) {
      console.error("Error fetching user profile:", error.message);
      // Fallback if row might not be created immediately
      setUser({ id: authId, role: "BUYER", email: "" });
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  /* ── Restore session on app mount ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ── Login ── */
  const login = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      
      const { data: profile, error: profileError } = await supabase
        .from('User')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!profileError && profile) {
        setUser(profile);
        return profile;
      }
      return data.user;
    },
    [],
  );

  /* ── Register ── */
  const register = useCallback(
    async (userData) => {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "BUYER",
          }
        }
      });
      if (error) throw new Error(error.message);
      
      if (!data.user) throw new Error("Registration failed");

      // For safety if trigger fails or we want explicit control:
      const { data: profile, error: profileError } = await supabase
        .from('User')
        .insert([{
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || "BUYER",
          password: "hash-not-needed",
          phone: userData.phone || null
        }])
        .select()
        .single();

      if (profile) {
        setUser(profile);
        return profile;
      }
      return data.user;
    },
    [],
  );

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }, [router]);

  /* ── Update user in context (after profile edit etc.) ── */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
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
        register,
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
