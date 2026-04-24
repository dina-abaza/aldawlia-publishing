"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/app/api";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { toast } from "react-toastify";
import PageLoader from "@/app/loading";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useTranslation } from "react-i18next";

const CategoryProducts = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation();
  const categoryNameFromQuery = searchParams.get("name");
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";
  
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    if (categoryNameFromQuery) {
      setCategoryName(categoryNameFromQuery);
    }
  }, [categoryNameFromQuery]);

  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: ["category", id, page],
    queryFn: async () => {
      const response = await api.get('/files', {
        params: {
          category: id,
          page: page,
          limit: limit,
        }
      });
      return {
        products: response.data.data || [],
        categoryName: categoryNameFromQuery || t("category_page.books"),
        totalPages: response.data.pagination?.totalPages || 1,
      };
    },
    enabled: Boolean(id),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!queryData) return;
    const realProducts = queryData.products || [];
    setProducts(realProducts);
    setCategoryName(queryData.categoryName || categoryNameFromQuery || t("category_page.books"));
    const tp = queryData?.totalPages ?? queryData?.pages ?? (queryData?.total ? Math.ceil(queryData.total / limit) : null);
    setTotalPages(tp);
  }, [queryData, categoryNameFromQuery, limit]);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  const toggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info(t("category_page.login_for_favorites"));
      return router.push("/login");
    }
    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className={`bg-[#f8f8f8] min-h-screen pb-24 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white text-sky-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-sky-50 transition-all shadow-sm active:scale-95 cursor-pointer z-50"
          >
            {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          <h1 className="text-sky-900 font-extrabold text-xl md:text-2xl">
            {categoryName || t("category_page.products")}
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto">
        {products.length > 0 ? (
          products.map((product, index) => {
            const bookId = product.id || product._id;
            return (
              <div
                key={bookId}
                className="bg-white rounded-3xl shadow-sm flex flex-col items-center relative border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                {/* Discount Tag */}
                {product.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] md:text-[10px] px-2 py-0.5 rounded-full z-20 font-bold shadow-sm">
                    {Math.round(product.discountPercent)}%
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, bookId)}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 md:p-2 rounded-full z-20 text-sky-900 hover:text-amber-600 transition-all shadow-sm"
                >
                  <Heart 
                    size={18} 
                    fill={isFavorite(bookId) ? "currentColor" : "none"} 
                    className={isFavorite(bookId) ? "text-amber-600" : ""} 
                  />
                </button>

                {/* ✅ صورة الغلاف: تملأ المساحة بالكامل (Object Cover) بدون أي فراغات */}
               {/* ✅ صورة الغلاف: معدلة لتظهر بوضوح في الموبايل */}
<div
  className="w-full h-52 md:h-72 cursor-pointer overflow-hidden relative bg-gray-100"
  onClick={() => router.push(`/book/${bookId}`)}
>
  <Image
    src={product.coverUrl || product.cover || "/placeholder.jpg"}
    alt={product.title || product.name}
    fill
    sizes="(max-width: 768px) 50vw, 250px"
    /* ✅ التغيير هنا: استخدمنا object-center بدلاً من top لضمان ظهور الصورة لو كانت أبعادها غريبة */
    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
    priority={index < 4} 
  />
  
  {/* تظليل خفيف - تأكد إنه pointer-events-none عشان ميعطلش اللمس في الموبايل */}
  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
</div>

                {/* منطقة النص: ملمومة ومحاذاتها احترافية */}
                <div
                  className="flex flex-col items-center cursor-pointer p-3 md:p-4 w-full min-h-[85px] md:min-h-[100px] justify-center gap-1"
                  onClick={() => router.push(`/book/${bookId}`)}
                >
                  <h3 className="font-bold text-[12px] md:text-[14px] text-sky-900 text-center line-clamp-2 leading-tight">
                    {product.title || product.name}
                  </h3>
                  
                  <span className="text-[10px] md:text-[11px] text-amber-600 font-extrabold mt-1 uppercase tracking-wider group-hover:text-sky-900 transition-colors">
                    {t("category_page.explore_more")}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold w-full">
            {t("category_page.empty")}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12 mb-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPage(i + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                page === i + 1 ? "bg-sky-900 w-8" : "bg-gray-300 w-2.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;