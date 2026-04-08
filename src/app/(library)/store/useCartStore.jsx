import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },
      loading: false,

      // جلب السلة من السيرفر
      fetchCart: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/cart");
          set({ cart: res.data.data || { items: [], total: 0 } });
        } catch (err) {
          console.error("خطأ جلب السلة:", err.message);
        } finally {
          set({ loading: false });
        }
      },

      // إضافة عنصر (حسب الـ API بتاعك POST /cart/:fileId)
      addToCart: async (fileId) => {
        try {
          const response = await api.post(`/cart/${fileId}`, {
            quantity: 1 
          });
          set({ cart: response.data.data });
          return response.data;
        } catch (error) {
          console.error("فشل الإضافة:", error.response?.data || error);
          throw error;
        }
      },

      // حذف عنصر واحد (DELETE /cart/:fileId)
      removeFromCart: async (fileId) => {
        try {
          const res = await api.delete(`/cart/${fileId}`);
          set({ cart: res.data.data });
          toast.success("تم الحذف من السلة");
        } catch (err) {
          toast.error("فشل حذف العنصر");
        }
      },

      // تفريغ السلة بالكامل (DELETE /cart)
      clearCart: async () => {
        try {
          await api.delete("/cart");
          set({ cart: { items: [], total: 0 } });
          // امسحي بيانات الـ Persist يدوياً لضمان النظافة
          localStorage.removeItem("cart-storage"); 
          toast.success("تم تفريغ السلة");
        } catch (err) {
          // حتى لو الـ API فشل (زي الـ 404 اللي ظهرت لك)، هنصفر الـ UI للأمان
          set({ cart: { items: [], total: 0 } });
          localStorage.removeItem("cart-storage");
        }
      },

      // دالة إضافية لتصفير السلة "محلياً فقط" وقت الـ Logout بدون نداء API
      resetCartLocal: () => {
        set({ cart: { items: [], total: 0 } });
        localStorage.removeItem("cart-storage");
      }
    }),
    {
      name: "cart-storage", // اسم المفتاح في المتصفح
      storage: createJSONStorage(() => localStorage),
    }
  )
);