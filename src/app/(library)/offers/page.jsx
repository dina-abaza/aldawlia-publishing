"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/api";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
const OffersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x600?text=Aldawlia";
    if (path.startsWith('http')) return path;
    return `https://e-library-api-production.up.railway.app${path}`;
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get("/files", {
          params: {
            limit: 20,
            isOnSale: true // ✅ جلب العروض فقط كما في الباك اند
          }
        });
        console.log("DEBUG: Offers Page Response Data:", response.data.data);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("خطأ في جلب العروض:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAdd = async (book) => {
    if (!isAuthenticated) {
      toast.info("سجّل الدخول أولاً");
      return router.push("/login");
    }
    try {
      await addToCart(book.id || book._id);
      toast.success("تمت الإضافة للسلة");
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("فشل إضافة الكتاب للسلة");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-amber-600 animate-pulse">
        جاري تحميل أقوى العروض...
      </div>
    );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-sky-900 p-6 rounded-b-[40px] border-b-8 border-amber-600 shadow-lg text-white text-center relative">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="absolute right-6 top-7 text-white/80 hover:text-amber-600 transition-all active:scale-95 z-50 cursor-pointer"
        >
          <ArrowRight size={28} />
        </button>
        <Tag className="mx-auto mb-2 text-amber-600" size={35} />
        <h1 className="text-2xl font-black">عروضنا القوية</h1>
        <p className="text-sm text-sky-200 mt-2">أفضل الأسعار لفترة محدودة</p>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto mt-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id || product._id}
              className="bg-white rounded-[30px] p-3 shadow-sm border border-red-100 flex flex-col relative overflow-hidden"
            >
              {/* نسبة الخصم */}
              {product.discountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl z-10 shadow-sm">
                  خصم {Math.round(product.discountPercent)}%
                </div>
              )}

              <Link href={`/book/${product.id || product._id}`} className="flex flex-col items-center w-full">
                <div className="h-40 w-full flex items-center justify-center mb-3 overflow-hidden rounded-2xl bg-gray-50">
                  <div className="relative w-full h-full">
                    <Image
                      src={getImageUrl(product.cover || product.image || product.coverUrl)}
                      alt={product.title || product.name}
                      fill
                      loading="lazy"
                      quality={70}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="font-black text-sm h-10 line-clamp-2 text-gray-800 text-center px-2 group-hover:text-amber-600 transition-colors">
                  {product.title || product.name}
                </h3>
                <span className="text-[10px] text-amber-600 font-bold mt-2 hover:underline">
                   استكشف التفاصيل والمزيد...
                </span>
              </Link>


              <div className="flex flex-col items-center my-2">
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-gray-400 line-through text-[10px]">
                    {(product.price / 100)?.toLocaleString()} ج.م
                  </span>
                )}
                <span className="text-amber-600 font-black text-sm">
                  {(product.discountPrice / 100)?.toLocaleString() || (product.price / 100)?.toLocaleString()} ج.م
                </span>
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="w-full bg-sky-900 text-white py-2 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-amber-600 transition-all shadow-sm"
              >
                <ShoppingCart size={14} /> إضافة
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold">
            لا توجد عروض حالياً، انتظر مفاجآتنا القادمة!
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
