import { create } from "zustand";
import api from "@/app/api"; // استيراد ملف api.jsx للتعامل مع الطلبات

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

  clearUser: () => set({ user: null, isAuthenticated: false, loading: false }),

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      console.log("User object:", user);
      localStorage.setItem('jwtToken', token);
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('jwtToken', token);
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/me");
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("jwtToken");
      set({ user: null, isAuthenticated: false, loading: false });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },
}));
