"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { Trash2, Heart, ArrowRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Activity from "@/app/loading";

const FavoritesPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { favorites, loading, fetchFavorites, removeFromFavorites } = useFavoritesStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
  }, [isAuthenticated, fetchFavorites]);

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <Heart size={80} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-600">سجل دخولك لعرض قائمة المفضلة</h2>
      <Link href="/login" className="bg-amber-600 text-white px-10 py-3 rounded-3xl font-bold shadow-lg mt-4 hover:bg-sky-900 transition-colors">تسجيل الدخول</Link>
    </div>
  );

  if (loading && favorites.length === 0) return <Activity />;

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-32 relative" dir="rtl">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button 
            type="button" 
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }} 
            className="text-sky-900 absolute right-0 p-4 hover:text-amber-600 transition-all active:scale-95 z-50 cursor-pointer"
          >
            <ArrowRight size={28} />
          </button>
          <h1 className="text-sky-900 font-extrabold text-xl flex items-center gap-2"><Heart size={24} fill="currentColor" className="text-amber-600" /> المفضلة</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-6">
            <Heart size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">قائمة المفضلة فارغة حالياً</p>
            <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold mt-6 inline-block hover:bg-sky-900 transition-colors">تصفح الأقسام</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((item, idx) => {
              const book = item.productId || item; // التعامل مع استجابات الـ API المختلفة
              return (
                <div key={item._id || idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex shrink-0 items-center justify-center">
                    <img src={book?.cover || book?.coverUrl || book?.image || "/placeholder.png"} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-full py-1">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{book?.name || book?.title || "اسم غير متوفر"}</h3>
                      <p className="text-amber-600 font-black text-sm mt-1">{((book?.price) / 100)?.toLocaleString() || 0} ج.م</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <button 
                        onClick={() => addToCart(book._id || book.fileId)} 
                        className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold hover:bg-gray-800"
                      >
                        <ShoppingCart size={14} /> للسلة
                      </button>
                      <button 
                        onClick={() => removeFromFavorites(book._id || book.fileId || item.fileId)} 
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="إزالة من المفضلة"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
