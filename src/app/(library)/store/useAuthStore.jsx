import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. استيراد الـ persist
import api from "@/app/api";
import { useCartStore } from "./useCartStore";
import { useFavoritesStore } from "./useFavoritesStore";

export const useAuthStore = create(
  persist( // 2. تغليف الـ Store بالـ persist
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

      clearUser: () => set({ user: null, isAuthenticated: false, loading: false }),

      login: async (email, password) => {
        try {
          const res = await api.post("/auth/login", { email, password });
          const { token, user } = res.data.data;
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
            user: res.data.data,
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
          console.error("Logout API failed:", error);
        } finally {
          localStorage.removeItem("jwtToken");

          if (useCartStore.getState().resetCartLocal) {
            useCartStore.getState().resetCartLocal();
          } else {
            useCartStore.setState({ cart: { items: [], total: 0 } });
            localStorage.removeItem("cart-storage");
          }

          if (useFavoritesStore.getState().clearFavorites) {
            useFavoritesStore.getState().clearFavorites();
          }

          set({ user: null, isAuthenticated: false, loading: false });

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },
    }),
    {
      name: "auth-storage", // 3. اسم المفتاح في الـ localStorage
    }
  )
);