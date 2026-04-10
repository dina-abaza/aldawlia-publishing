import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },
      loading: false,

      fetchCart: async () => {
        // مبيعملش لودينج لو الداتا موجودة أصلاً عشان نحسن السرعة
        if (get().cart.items.length === 0) set({ loading: true });
        try {
          const res = await api.get("/cart");
          set({ cart: res.data.data || { items: [], total: 0 } });
        } catch (err) {
          console.error("خطأ جلب السلة:", err.message);
        } finally {
          set({ loading: false });
        }
      },

      addToCart: async (fileId) => {
        const { cart } = get();
        const isExist = cart.items.some(item => (item.file?._id === fileId || item.file?.id === fileId));

        if (isExist) {
          toast.info("هذا الكتاب مضاف بالفعل إلى السلة");
          return;
        }

        try {
          const response = await api.post(`/cart/${fileId}`, { quantity: 1 });
          set({ cart: response.data.data });
          toast.success("تمت الإضافة للسلة");
          return response.data;
        } catch (error) {
          toast.error("فشل إضافة الكتاب للسلة");
          throw error;
        }
      },

      removeFromCart: async (fileId) => {
        try {
          const res = await api.delete(`/cart/${fileId}`);
          set({ cart: res.data.data });
          toast.success("تم الحذف من السلة");
        } catch (err) {
          toast.error("فشل حذف العنصر");
        }
      },

      clearCart: async () => {
        try {
          await api.delete("/cart");
          set({ cart: { items: [], total: 0 } });
          localStorage.removeItem("cart-storage");
          toast.success("تم تفريغ السلة");
        } catch (err) {
          set({ cart: { items: [], total: 0 } });
          localStorage.removeItem("cart-storage");
        }
      },

      resetCartLocal: () => {
        set({ cart: { items: [], total: 0 }, loading: false });
        localStorage.removeItem("cart-storage");
      }
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // بنحفظ بس بيانات السلة، مش حالة الـ Loading
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);