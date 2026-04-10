import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/app/api";
import { useCartStore } from "./useCartStore";
import { useFavoritesStore } from "./useFavoritesStore";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      // دالة لتحديث الحالة يدوياً لو احتجتي
      setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

      clearUser: () => set({ user: null, isAuthenticated: false, loading: false }),

      login: async (email, password) => {
        try {
          // مفيش داعي نفتح اللودينج هنا لو هنحول الصفحة
          const res = await api.post("/auth/login", { email, password });
          const { token, user } = res.data.data;
          
          if (typeof window !== "undefined") {
            localStorage.setItem('jwtToken', token);
          }
          
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
          
          if (typeof window !== "undefined") {
            localStorage.setItem('jwtToken', token);
          }
          
          set({ user, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false });
          return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
      },

      checkAuth: async () => {
        // لو التوكن مش موجود أصلاً، اقفل اللودينج فوراً بدل ما تستنى الـ API يرد بـ Error
        const token = typeof window !== "undefined" ? localStorage.getItem('jwtToken') : null;
        if (!token) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        try {
          const res = await api.get("/auth/me");
          set({
            user: res.data.data,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          // لو التوكن منتهي أو فيه مشكلة
          localStorage.removeItem("jwtToken");
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

          // تنظيف السلة والمفضلة
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
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // أهم جزء: بنقول لزاستند متعملش Hydration للـ Loading خليها دايماً تبدأ بـ True أو False حسب الحاجة
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);