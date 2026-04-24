"use client";
import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const PopularPage = () => {
    const { t, i18n } = useTranslation();
    const [likedBooks, setLikedBooks] = useState({});
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

    // دالة الإعجاب المنفصلة
    const handleLike = (e, id) => {
        e.preventDefault(); // دي أهم حتة: بتمنع الرابط إنه يفتح
        e.stopPropagation(); // بتمنع الحدث إنه يوصل للكارت

        setLikedBooks(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        if (!likedBooks[id]) {
            toast.success(t("popular_page.added_to_favorites"));
        }
    };

    if (isLoading) return <div className="py-24 text-center text-amber-600 font-black animate-bounce text-xl">{t("popular_page.loading")}</div>;

    return (
        <main className={`min-h-screen bg-slate-50/50 py-16 px-4 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="p-3 bg-white rounded-2xl text-amber-600 mb-4 shadow-sm border border-slate-100">
                        <Star size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-sky-950">{t("popular_page.title")}</h1>
                    <div className="w-12 h-1 bg-amber-600 mt-4 rounded-full"></div>
                </div>

                {books.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <div key={book._id || book.id} className="relative group">
                                {/* زرار القلب منفصل تماماً ومحطوط فوق الكارت */}
                                <button
                                    onClick={(e) => handleLike(e, book._id || book.id)}
                                    className="absolute top-6 right-6 z-20 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform active:scale-90"
                                >
                                    <Heart
                                        size={20}
                                        className={likedBooks[book._id || book.id] ? "text-amber-600" : "text-slate-400"}
                                        fill={likedBooks[book._id || book.id] ? "currentColor" : "none"}
                                    />
                                </button>

                                {/* الكارت اللي بيودي للتفاصيل */}
                                <Link
                                    href={`/book/${book._id || book.id}`}
                                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 h-full"
                                >
                                    {/* ✅ التعديل: توحيد مقاس الصورة واستخدام object-cover */}
                                    <div className="relative w-full h-48 md:h-64 bg-slate-100">
                                        <Image
                                            src={book.coverUrl || book.cover || "/placeholder.jpg"}
                                            alt={book.title}
                                            fill
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* ✅ التعديل: توحيد ارتفاع منطقة النص وتوزيع العناصر */}
                                    <div className="p-4 text-center flex flex-col justify-between flex-1 h-32">
                                        <h3 className="font-bold text-[14px] md:text-[16px] text-slate-900 mb-2 line-clamp-2 leading-tight flex items-center justify-center">
                                            {book.title}
                                        </h3>
                                        <p className="text-amber-600 font-bold text-[12px] mt-auto">
                                            {t("popular_page.explore_more")}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
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