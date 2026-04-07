import { create } from "zustand";
import api from "@/app/api"; // استيراد ملف api.jsx للتعامل مع الطلبات
import { toast } from "react-toastify";

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,

  // جلب المفضلة
  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/favorites");
      console.log("DEBUG: Favorites Data from API ->", res.data.data);
      set({ favorites: res.data.data || res.data || [] });
    } catch (err) {
      console.error("خطأ في جلب المفضلة:", err.response?.data || err.message);
      set({ favorites: [] });
    } finally {
      set({ loading: false });
    }
  },

  // إضافة كتاب للمفضلة
  addToFavorites: async (fileId) => {
    console.log("DEBUG: Adding book to favorites with ID:", fileId);
    try {
      const res = await api.post("/favorites/add", { fileId });
      // Update the local state
      await get().fetchFavorites();
      toast.success("تمت الإضافة للمفضلة!");
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "فشل الإضافة للمفضلة");
    }
  },

  // إزالة كتاب من المفضلة
  removeFromFavorites: async (fileId) => {
    try {
      const res = await api.delete(`/favorites/remove/${fileId}`);
      // Update the local state
      await get().fetchFavorites();
      toast.success("تم الحذف من المفضلة!");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("فشل الحذف من المفضلة");
    }
  },

  // التحقق هل الكتاب موجود بالمفضلة
  isFavorite: (fileId) => {
    const { favorites } = get();
    // Assuming favorites objects could have productId or fileId or _id
    return favorites.some(item =>
      item.fileId === fileId ||
      item.productId?._id === fileId ||
      item._id === fileId
    );
  }
}));
