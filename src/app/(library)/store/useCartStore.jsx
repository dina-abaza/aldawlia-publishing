import { create } from "zustand";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
  cart: [],
  loading: false,

  addToCart: async (id) => {
    console.group("🔍 تحقيق عملية الإضافة للسلة");

    // تأكدي من استخراج الـ ID فقط
    const cleanId = typeof id === 'object' ? (id.id || id._id) : id;

    console.log("1. المعرف المبعوث (ID):", cleanId);
    console.log("2. نوع المعرف (Type):", typeof cleanId);

    try {
      // محاولة الإرسال كما في الدليل
      const res = await api.post("/cart/add", { fileId: cleanId });

      console.log("✅ 3. نجحت العملية! رد السيرفر:", res.data);
      set({ cart: res.data?.data || res.data });
      toast.success("تمت الإضافة للسلة!");
    } catch (err) {
      console.error("❌ 3. فشلت العملية!");
      console.error("حالة الخطأ (Status):", err.response?.status);
      console.error("رد السيرفر بالتفصيل:", err.response?.data);

      // هنا بنشوف لو السيرفر عنده مشكلة في مسار /add
      if (err.response?.status === 404 || err.response?.data?.message?.includes("Cast to ObjectId")) {
        console.warn("⚠️ تنبيه: يبدو أن مسار /add يسبب تداخل. سأجرب إرسال الطلب لـ /cart مباشرة.");
        try {
          const res2 = await api.post("/cart", { fileId: cleanId });
          console.log("✅ 4. نجحت المحاولة البديلة (/cart):", res2.data);
          set({ cart: res2.data?.data || res2.data });
          toast.success("تمت الإضافة!");
          return;
        } catch (innerErr) {
          console.error("❌ 4. فشلت المحاولة البديلة أيضاً:", innerErr.response?.data);
        }
      }

      toast.error(err.response?.data?.message || "فشل الإضافة");
    } finally {
      console.groupEnd();
    }
  },

  fetchCart: async () => {
    try {
      const res = await api.get("/cart");
      set({ cart: res.data?.data || res.data || [] });
    } catch (err) {
      console.error("خطأ جلب السلة:", err.message);
    }
  },
}));