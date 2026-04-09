"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/app/api"; // استيراد ملف api.jsx للتعامل مع الطلبات
import { ShoppingCart, Plus, Minus, Heart, Flame, Star, Search as SearchIcon, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { toast } from "react-toastify";
import PageLoader from "@/app/loading";
import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort"); // 🔹 جلب معطى الترتيب الجديد

  const { addToCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  const [products, setProducts] = useState([]);

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["search", keyword, sort],
    queryFn: async () => {
      let endpoint = '/files';
      let params = {};

      if (sort === 'trending') {
        endpoint = '/files/trending';
      } else if (sort === 'popular') {
        endpoint = '/files/popular';
      } else if (keyword) {
        params.q = keyword;
      } else {
        return [];
      }

      const response = await api.get(endpoint, { params });
      return response.data.data || [];
    },
    enabled: Boolean(keyword || sort),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const getPageTitle = () => {
    if (sort === 'trending') return { title: "الإصدارات الأكثر طلباً وحركة", icon: <Flame className="text-orange-500" fill="currentColor" /> };
    if (sort === 'popular') return { title: "الكتب الأكثر تفضيلاً لدى القراء", icon: <Star className="text-amber-600" fill="currentColor" /> };
    return { title: `نتائج البحث عن: ${keyword || ""}`, icon: <SearchIcon className="text-sky-900" /> };
  };

  const { title, icon } = getPageTitle();

  if (queryLoading) return <PageLoader />;

  const toggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("سجّل الدخول لإضافة المفضلة");
      return router.push("/login");
    }
    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-12 mb-20" dir="rtl">
      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-100">
        <div className="p-3 bg-gray-50 rounded-2xl">
          {icon}
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
          {title}
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <SearchIcon size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">عذراً، القائمة فارغة حالياً</h2>
          <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
            يبدو أنه لا توجد بيانات كافية لعرضها في هذا القسم حالياً. يمكنك استكشاف باقي أقسام المتجر!
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 px-8 py-3 bg-sky-900 text-white rounded-full font-bold hover:bg-amber-600 transition-all shadow-xl shadow-sky-100"
          >
            العودة للرئيسية <ArrowLeft size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product._id} className="group border-0 rounded-3xl p-3 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col relative border border-gray-50">
              {/* المفضلة */}
              <button
                onClick={(e) => toggleFavorite(e, product._id)}
                className="absolute top-5 left-5 bg-white/90 shadow-lg p-2 rounded-2xl z-10 text-sky-900 hover:text-amber-600 hover:bg-red-50 transition-all"
                title="المفضلة"
              >
                <Heart size={18} fill={isFavorite(product._id) ? "currentColor" : "none"} className={isFavorite(product._id) ? "text-amber-600" : ""} />
              </button>

              {/* رابط للصورة والاسم */}
              <Link href={`/book/${product._id}`} className="flex-grow">
                <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-2xl overflow-hidden group-hover:shadow-inner">
                  <Image
                    src={product.coverUrl || product.cover || "/placeholder.jpg"}
                    alt={product.title || product.name}
                    fill
                    loading="lazy"
                    quality={80}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-sm font-black text-gray-800 text-center line-clamp-2 px-2 group-hover:text-amber-600 transition-colors leading-snug tracking-tight">
                  {product.title || product.name}
                </h3>
                <p className="text-[10px] text-amber-600 font-bold text-center mt-2 opacity-100 md:opacity-50 group-hover:opacity-100 transition-all">
                   استكشف التفاصيل والمزيد...
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
