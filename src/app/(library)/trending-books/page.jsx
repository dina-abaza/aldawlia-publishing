"use client";
import React from "react";
import { Flame, Heart } from "lucide-react"; // ضفنا Heart
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TrendingPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const isArabic = i18n.language?.startsWith("ar");
    const dir = isArabic ? "rtl" : "ltr";
    const selectedLanguage = searchParams.get("language") || "ar";

    const { data: books = [], isLoading } = useQuery({
        queryKey: ["trending-books-page", selectedLanguage],
        queryFn: async () => {
            const response = await api.get('/files/trending', { 
                params: { 
                    limit: 30,
                    language: selectedLanguage
                } 
            });
            return response.data.data || [];
        },
    });

    // دالة القلب
    const toggleFavorite = async (e, bookId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info(t("trending_page.login_for_favorites"));
            return router.push("/login");
        }

        if (isFavorite(bookId)) {
            await removeFromFavorites(bookId);
        } else {
            await addToFavorites(bookId);
        }
    };

    if (isLoading) return <div className="py-24 text-center text-amber-600 font-black animate-bounce text-xl tracking-widest uppercase">{t("trending_page.loading")}</div>;

    return (
        <main className={`min-h-screen bg-slate-50/50 py-16 px-4 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 mb-4 shadow-inner">
                        <Flame size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-black text-sky-950 uppercase tracking-tighter">{t("trending_page.title")}</h1>
                    <div className="w-12 h-1 bg-amber-600 mt-4 rounded-full"></div>
                </div>

                {books.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {books.map((book) => {
                            const productId = book._id || book.id;
                            const activeFav = isFavorite(productId);

                            return (    
                                <Link
                                    key={productId}
                                    href={`/book/${productId}`}
                                    className="group bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
                                >
                                    {/* زر القلب - بنفس التصميم بالظبط */}
                                    <button
                                        onClick={(e) => toggleFavorite(e, productId)}
                                        className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                                            activeFav ? "bg-amber-50 text-amber-600" : "bg-white/80 text-gray-400 backdrop-blur-sm"
                                        }`}
                                    >
                                        <Heart size={16} fill={activeFav ? "currentColor" : "none"} />
                                    </button>

                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-3">
                                        <Image
                                            src={book.coverUrl || book.cover}
                                            alt={book.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="px-2 pb-4 text-center">
                                        <h3 className="font-black text-[11px] md:text-xs text-sky-950 line-clamp-2 h-8 leading-snug uppercase tracking-tighter">
                                            {book.title}
                                        </h3>
                                        <div className="mt-3 inline-block">
                                            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase border border-amber-100">{t("trending_page.hot_now")}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center col-span-full">
                        <p className="text-slate-400 font-black text-lg uppercase tracking-widest">{t("home.showcase.no_books_found")}</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TrendingPage;