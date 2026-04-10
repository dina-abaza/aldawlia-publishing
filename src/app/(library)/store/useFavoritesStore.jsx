import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,

      fetchFavorites: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/favorites");
          const data = res.data.data || res.data || [];
          set({ favorites: data });
        } catch (err) {
          console.error("خطأ في جلب المفضلة:", err.message);
          set({ favorites: [] });
        } finally {
          set({ loading: false });
        }
      },

      addToFavorites: async (fileId) => {
        try {
          await api.post("/favorites/add", { fileId });
          await get().fetchFavorites();
          toast.success("تمت الإضافة للمفضلة!");
        } catch (err) {
          toast.error(err.response?.data?.message || "فشل الإضافة للمفضلة");
        }
      },

      removeFromFavorites: async (id) => {
        try {
          await api.delete(`/favorites/remove/${id}`);
          // تحديث محلي فوري
          set((state) => ({
            favorites: state.favorites.filter(item => (item.id || item._id || item.fileId) !== id)
          }));
          toast.success("تم الحذف من المفضلة!");
        } catch (err) {
          toast.error("فشل الحذف من المفضلة");
          get().fetchFavorites();
        }
      },

      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some(item => 
          (item.id === id) || (item._id === id) || (item.fileId === id) || (item.file?.id === id) || (item.file?._id === id)
        );
      },
      
      clearFavorites: () => {
        set({ favorites: [], loading: false });
        localStorage.removeItem("favorites-storage");
      }
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);