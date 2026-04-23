"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/app/api";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { toast } from "react-toastify";
import PageLoader from "@/app/loading";
// ✅ Stores
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

    const tp =
      queryData?.totalPages ??
      queryData?.pages ??
      (queryData?.total ? Math.ceil(queryData.total / limit) : null);
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

  if (loading) return <PageLoader/>;

  return (
    <div className={`bg-[#f8f8f8] min-h-screen pb-24 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>

      {/* عنوان القسم */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-50 text-sky-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-sky-50 transition-all shadow-sm active:scale-95 cursor-pointer z-[9999]"
          >
            {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          <h1 className="text-sky-900 font-extrabold text-xl md:text-2xl">
            {categoryName || t("category_page.products")}
          </h1>
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-[2.5rem] shadow-sm flex flex-col items-center relative border border-gray-100 w-[calc(50%-16px)] md:w-[260px] overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] px-3 py-1 rounded-full z-10 font-bold">
                  {product.discountPercent} %
                </div>
              )}

              <button
                onClick={(e) => toggleFavorite(e, product.id)}
                className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full z-10 text-sky-900 hover:text-amber-600 transition-all shadow-sm"
              >
                <Heart size={24} fill={isFavorite(product.id) ? "currentColor" : "none"} className={isFavorite(product.id) ? "text-amber-600" : ""} />
              </button>

              {/* حاوية الصورة عريضة وفخمة */}
              <div
                className="w-full h-80 md:h-[420px] flex items-center justify-center mb-3 cursor-pointer overflow-hidden rounded-2xl relative bg-gray-50/50 p-2"
                onClick={() => router.push(`/book/${product.id}`)}
              >
                <Image
                  src={product.coverUrl || "/placeholder.jpg"}
                  alt={product.title || product.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 220px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                  priority={index < 4}
                />
              </div>

              <div
                className="flex flex-col items-center cursor-pointer py-6 w-full px-4"
                onClick={() => router.push(`/book/${product.id}`)}
              >
                <h3 className="font-bold text-[17px] text-sky-900 text-center line-clamp-2 h-12 leading-snug hover:text-amber-600 transition-colors">
                  {product.title || product.name}
                </h3>
                <span className="text-[14px] text-amber-600 font-extrabold mt-3 flex items-center gap-1 hover:underline">
                  {t("category_page.explore_more")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold w-full">
            {t("category_page.empty")}
          </div>
        )}
      </div>

      {totalPages && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-2.5 rounded-full transition-all duration-300 ${page === i + 1 ? "bg-sky-900 w-8" : "bg-gray-300 w-2.5"}`}
              aria-label={`${t("category_page.go_to_page")} ${i + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default CategoryProducts;