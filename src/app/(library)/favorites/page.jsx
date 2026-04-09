"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { Trash2, Heart, ArrowRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLoader from "@/app/loading";

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

  if (loading && favorites.length === 0) return <PageLoader />;

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-32 relative" dir="rtl">
      {/* Header - Fixed & Clean */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative px-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sky-900 hover:text-amber-600 transition-all active:scale-95"
          >
            <ArrowRight size={28} />
          </button>
          <h1 className="text-sky-900 font-extrabold text-xl flex items-center gap-2">
            <Heart size={24} fill="currentColor" className="text-amber-600" /> المفضلة
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-6">
            <Heart size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">قائمة المفضلة فارغة حالياً</p>
            <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold mt-6 inline-block hover:bg-sky-900 transition-colors">تصفح الأقسام</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((item, idx) => {
              // بناءً على الـ Console: الكتاب هو الـ item مباشرة
              const book = item;
              // المعرف الصحيح هو id
              const currentId = book.id || book._id;

              return (
                <div key={currentId || idx} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">

                  {/* الصورة */}
                  <div className="w-24 h-32 bg-gray-50 rounded-2xl p-1 flex shrink-0 items-center justify-center overflow-hidden border border-slate-50">
                    <img
                      src={book?.cover || book?.coverUrl || book?.image || "/logo.png"}
                      className="w-full h-full object-cover rounded-xl"
                      alt={book?.title || "book cover"}
                      onError={(e) => {
                        const img = e.target;
                        if (img && img.src && !img.src.endsWith('/logo.png')) {
                          img.src = "/logo.png";
                        }
                      }}
                    />
                  </div>

                  {/* التفاصيل */}
                  <div className="flex-1 flex flex-col justify-between h-32 py-1">
                    <div>
                      <h3 className="font-bold text-sky-900 text-[13px] md:text-sm line-clamp-2 leading-tight uppercase">
                        {book?.name || book?.title || "اسم غير متوفر"}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-amber-600 font-black text-sm">
                          {((book?.isOnSale && book?.discountPrice) ? book.discountPrice : (book?.price || 0)) / 100} ج.م
                        </p>
                        {book?.isOnSale && (
                          <span className="text-gray-400 line-through text-[10px]">
                            {((book?.price) / 100).toLocaleString()} ج.م
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <button
                        onClick={() => addToCart(currentId)}
                        className="bg-sky-950 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold hover:bg-amber-600 transition-all active:scale-95"
                      >
                        <ShoppingCart size={14} /> للسلة
                      </button>

                      <button
                        onClick={() => removeFromFavorites(currentId)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        title="إزالة"
                      >
                        <Trash2 size={20} />
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