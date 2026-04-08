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
      // الباك إند يرسل البيانات في res.data.data بناءً على الـ Console
      const data = res.data.data || res.data || [];
      console.log("DEBUG: Favorites Data from API ->", data);
      set({ favorites: data });
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
      await api.post("/favorites/add", { fileId });
      // تحديث الحالة بعد الإضافة
      await get().fetchFavorites();
      toast.success("تمت الإضافة للمفضلة!");
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "فشل الإضافة للمفضلة");
    }
  },

  // إزالة كتاب من المفضلة
  removeFromFavorites: async (id) => {
    console.log("DEBUG: Removing from favorites with ID:", id);
    try {
      // الرابط الصحيح بناءً على كلام الباك إند: /favorites/remove/:fileId
      // وبما أن المعرف في الكونسول هو 'id' فنحن نرسله هنا
      await api.delete(`/favorites/remove/${id}`);

      // تحديث القائمة محلياً فوراً لتحسين تجربة المستخدم
      set((state) => ({
        favorites: state.favorites.filter(item => (item.id || item._id) !== id)
      }));

      toast.success("تم الحذف من المفضلة!");
    } catch (err) {
      console.error("فشل الحذف:", err.response?.data || err.message);
      toast.error("فشل الحذف من المفضلة");
      // في حال الفشل، نعيد جلب البيانات من السيرفر للتأكد
      get().fetchFavorites();
    }
  },

  // التحقق هل الكتاب موجود بالمفضلة
  isFavorite: (id) => {
    const { favorites } = get();
    // بناءً على الـ Console، الأجسام داخل المصفوفة تحتوي على id
    return favorites.some(item =>
      (item.id === id) ||
      (item._id === id) ||
      (item.fileId === id)
    );
  }
}));