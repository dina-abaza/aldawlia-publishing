"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/app/api"; // استيراد ملف api.jsx للتعامل مع الطلبات
import { Heart, Flame, Star, Search as SearchIcon, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { toast } from "react-toastify";
import PageLoader from "@/app/loading";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort");
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "ar");
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";

  const [products, setProducts] = useState([]);

  const { data, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ["search", keyword, sort, selectedLanguage],
    queryFn: async () => {
      let endpoint = '/files';
      let params = { language: selectedLanguage };

      if (sort === 'trending') {
        endpoint = '/files/trending';
      } else if (sort === 'popular') {
        endpoint = '/files/popular';
      } else if (sort === 'latest') {
        endpoint = '/files/latest';
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

  const languages = [
    { id: "ar", label: "العربية", icon: "🇸🇦" },
    { id: "en", label: "English", icon: "🇺🇸" },
    { id: "fr", label: "Français", icon: "🇫🇷" },
    { id: "es", label: "Español", icon: "🇪🇸" },
  ];

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const getPageTitle = () => {
    if (sort === "trending") return { title: t("search_page.trending_title"), icon: <Flame className="text-orange-500" fill="currentColor" /> };
    if (sort === "popular") return { title: t("search_page.popular_title"), icon: <Star className="text-amber-600" fill="currentColor" /> };
    if (sort === "latest") return { title: t("search_page.latest_title"), icon: <Sparkles className="text-amber-600" /> };
    return { title: `${t("search_page.results_for")} ${keyword || ""}`, icon: <SearchIcon className="text-sky-900" /> };
  };

  const { title, icon } = getPageTitle();

  if (queryLoading) return <PageLoader />;

  const toggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info(t("search_page.login_for_favorites"));
      return router.push("/login");
    }
    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 mt-12 mb-20 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-2xl">
            {icon}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
            {title}
          </h1>
        </div>

        {/* Language Filter in Search Page */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner self-start md:self-center">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                selectedLanguage === lang.id
                  ? "bg-white text-sky-900 shadow-md"
                  : "text-gray-500 hover:text-sky-900 hover:bg-white/50"
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <SearchIcon size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">{t("search_page.empty_title")}</h2>
          <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
            {t("search_page.empty_description")}
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 px-8 py-3 bg-sky-900 text-white rounded-full font-bold hover:bg-amber-600 transition-all shadow-xl shadow-sky-100"
          >
            {t("search_page.back_home")} {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product._id} className="group rounded-3xl hover:shadow-md transition-all duration-500 bg-white flex flex-col relative border border-gray-100 overflow-hidden">
              {/* المفضلة */}
              <button
                onClick={(e) => toggleFavorite(e, product._id)}
                className="absolute top-3 left-3 bg-white/90 shadow-sm p-1.5 rounded-full z-10 text-sky-900 hover:text-amber-600 transition-all"
                title={t("search_page.favorites")}
              >
                <Heart size={16} fill={isFavorite(product._id) ? "currentColor" : "none"} className={isFavorite(product._id) ? "text-amber-600" : ""} />
              </button>

              {/* رابط للصورة والاسم */}
              <Link href={`/book/${product._id}`} className="flex flex-col h-full">
                {/* ✅ التعديل: توحيد مقاس حاوية الصورة واستخدام object-cover */}
                <div className="relative w-full h-44 md:h-56 bg-gray-100">
                  <Image
                    src={product.coverUrl || product.cover || "/placeholder.jpg"}
                    alt={product.title || product.name}
                    fill
                    loading="lazy"
                    quality={80}
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* ✅ التعديل: توحيد ارتفاع منطقة النصوص (h-28) وتوزيع العناصر */}
                <div className="p-3 text-center flex flex-col justify-between flex-1 h-28">
                  <h3 className="text-[13px] md:text-[14px] font-bold text-gray-800 line-clamp-2 leading-tight flex items-center justify-center h-10 group-hover:text-amber-600 transition-colors">
                    {product.title || product.name}
                  </h3>
                  <p className="text-[11px] text-amber-600 font-bold mt-auto pt-2">
                     {t("search_page.explore_more")}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}