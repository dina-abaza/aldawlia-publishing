"use client";
import React from "react";
import api from "@/app/api";
 import { ShoppingCart, Tag, ArrowRight, ArrowLeft, Heart } from "lucide-react"; // ضفنا Heart
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore"; // ضفنا الـ Store
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

const OffersPage = () => {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const selectedLanguage = searchParams.get("language") || "ar";
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";
  
  // دوال المفضلة
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["offers-page", selectedLanguage],
    queryFn: async () => {
      const response = await api.get("/files/on-sale", {
        params: {
          limit: 20,
          language: selectedLanguage
        }
      });
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleAdd = async (book) => {
    if (!isAuthenticated) {
      toast.info(t("offers_page.login_first"));
      return router.push("/login");
    }
    try {
      await addToCart(book.id || book._id);
      
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(t("offers_page.add_cart_failed"));
    }
  };

  // دالة الضغط على القلب
  const toggleFavorite = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info(t("offers_page.login_for_favorites"));
      return router.push("/login");
    }

    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-amber-600 animate-pulse">
        {t("offers_page.loading")}
      </div>
    );

  return (
    <div className={`bg-[#f8f8f8] min-h-screen pb-20 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
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
          className={`absolute top-7 text-white/80 hover:text-amber-600 transition-all active:scale-95 z-50 cursor-pointer ${isArabic ? "right-6" : "left-6"}`}
        >
          {isArabic ? <ArrowRight size={28} /> : <ArrowLeft size={28} />}
        </button>
        <Tag className="mx-auto mb-2 text-amber-600" size={35} />
        <h1 className="text-2xl font-black">{t("offers_page.title")}</h1>
        <p className="text-sm text-sky-200 mt-2">{t("offers_page.subtitle")}</p>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto mt-4">
        {products.length > 0 ? (
          products.map((product) => {
            const productId = product.id || product._id;
            const activeFav = isFavorite(productId);

            return (
              <div
                key={productId}
                className="bg-white rounded-[30px] p-3 shadow-sm border border-red-100 flex flex-col relative overflow-hidden group"
              >
                {/* نسبة الخصم */}
                {product.discountPercent > 0 && (
                  <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-2xl z-10 shadow-sm">
                    {t("offers_page.discount")} {Math.round(product.discountPercent)}%
                  </div>
                )}

                {/* زر القلب */}
                <button
                  onClick={(e) => toggleFavorite(e, productId)}
                  className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                    activeFav ? "bg-amber-50 text-amber-600" : "bg-white/80 text-gray-400 backdrop-blur-sm"
                  }`}
                >
                  <Heart size={16} fill={activeFav ? "currentColor" : "none"} />
                </button>

                <Link href={`/book/${productId}`} className="flex flex-col items-center w-full">
                  <div className="h-80 md:h-[420px] w-full flex items-center justify-center mb-3 overflow-hidden rounded-2xl bg-gray-50/50 p-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.cover || product.image || product.coverUrl}
                        alt={product.title || product.name}
                        fill
                        loading="lazy"
                        quality={70}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                      />
                    </div>
                  </div>
                  <h3 className="font-black text-sm h-10 line-clamp-2 text-gray-800 text-center px-2 group-hover:text-amber-600 transition-colors">
                    {product.title || product.name}
                  </h3>
                  <span className="text-[10px] text-amber-600 font-bold mt-2 hover:underline">
                    {t("offers_page.explore_more")}
                  </span>
                </Link>


                <div className="flex flex-col items-center my-2">
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="text-gray-400 line-through text-[10px]">
                      {product.price?.toLocaleString()} {t("offers_page.currency")}
                    </span>
                  )}
                  <span className="text-amber-600 font-black text-sm">
                    {product.discountPrice?.toLocaleString() || product.price?.toLocaleString()} {t("offers_page.currency")}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  className="w-full bg-sky-900 text-white py-2 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-amber-600 transition-all shadow-sm"
                >
                  <ShoppingCart size={14} /> {t("offers_page.add")}
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold">
            {t("offers_page.empty")}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;