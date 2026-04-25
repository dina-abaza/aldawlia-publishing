"use client";
import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";

const PopularPage = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const searchParams = useSearchParams();
    const selectedLanguage = searchParams.get("language") || "ar";
    const isArabic = i18n.language?.startsWith("ar");
    const dir = isArabic ? "rtl" : "ltr";

    const { data: books = [], isLoading } = useQuery({
        queryKey: ["popular-books", selectedLanguage],
        queryFn: async () => {
            const response = await api.get('/files/popular', {
                params: {
                    limit: 30,
                    language: selectedLanguage
                }
            });
            return response.data.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const toggleFavorite = async (e, bookId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            toast.info(t("popular_page.login_for_favorites") || t("search_page.login_for_favorites"));
            return router.push("/login");
        }

        if (isFavorite(bookId)) {
            await removeFromFavorites(bookId);
        } else {
            await addToFavorites(bookId);
        }
    };

    if (isLoading) return <div className="py-24 text-center text-amber-600 font-black animate-bounce text-xl">{t("popular_page.loading")}</div>;

    return (
        <main className={`min-h-screen bg-slate-50/50 py-16 px-4 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="p-3 bg-white rounded-2xl text-amber-600 mb-4 shadow-sm border border-slate-100">
                        <Star size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-sky-950">{t("popular_page.title")}</h1>
                    <div className="w-12 h-1 bg-amber-600 mt-4 rounded-full"></div>
                </div>

                {books.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                        {books.map((book, index) => {
                            const bookId = book._id || book.id;
                            const activeFav = isFavorite(bookId);
                            return (
                                <div key={bookId} className="relative group">
                                    {/* زرار القلب - فوق الكارت */}
                                    <button
                                        onClick={(e) => toggleFavorite(e, bookId)}
                                        className={`absolute top-2 right-2 z-20 bg-white/90 p-1.5 md:p-2 rounded-full shadow-md hover:scale-110 transition-transform active:scale-90 ${
                                            activeFav ? "text-amber-600" : "text-slate-400"
                                        }`}
                                    >
                                        <Heart
                                            size={18}
                                            fill={activeFav ? "currentColor" : "none"}
                                        />
                                    </button>

                                    {/* الكارت */}
                                    <Link
                                        href={`/book/${bookId}`}
                                        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md h-full"
                                    >
                                        {/* ✅ الصورة: تملأ المساحة بالكامل (Edge-to-Edge) بدون فراغات */}
                                        <div className="relative w-full h-52 md:h-72 bg-slate-100 overflow-hidden">
                                            <Image
                                                src={book.coverUrl || book.cover || "/placeholder.jpg"}
                                                alt={book.title}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 250px"
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                                priority={index < 6}
                                            />
                                            {/* ظل خفيف في الأسفل لعمق الغلاف */}
                                            <div className="absolute inset-0 shadow-[inset_0_-15px_15px_rgba(0,0,0,0.03)] pointer-events-none" />
                                        </div>

                                        {/* ✅ منطقة النص: ملمومة ومحاذية (المسطرة) */}
                                        <div className="p-3 md:p-4 text-center flex flex-col justify-center items-center flex-1 min-h-[85px] md:min-h-[100px] gap-1">
                                            <h3 className="font-bold text-[12px] md:text-[14px] text-slate-900 line-clamp-2 leading-tight">
                                                {book.title}
                                            </h3>
                                            <p className="text-amber-600 font-extrabold text-[10px] md:text-[11px] mt-1 uppercase tracking-wider">
                                                {t("popular_page.explore_more")}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-lg">{t("home.showcase.no_books_found")}</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PopularPage;