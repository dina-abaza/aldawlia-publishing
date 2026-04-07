"use client";
import React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/api";

// استيراد Swiper

import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";



const PopularCarousel = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

    const { data: books = [], isLoading } = useQuery({
        queryKey: ["popular-books"],
        queryFn: async () => {
            const response = await api.get('/files/popular', {
                params: { limit: 12 }
            });
            console.log("Popular Books from API:", response.data.data);
            return response.data.data || [];
        },
    });

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x600?text=Popular";
        if (path.startsWith('http')) return path;
        return `https://e-library-api-production.up.railway.app${path}`;
    };

    const toggleFavorite = async (e, book) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info("سجّل الدخول لإضافة المفضلة");
            return router.push("/login");
        }
        const bookId = book.id;
        if (isFavorite(bookId)) {
            await removeFromFavorites(bookId);
        } else {
            await addToFavorites(bookId);
        }
    };

    if (isLoading) return (
        <div className="py-24 text-center animate-pulse text-amber-600 font-bold flex items-center justify-center gap-2">
            <Star className="animate-spin-slow" /> جاري تحميل المفضل لدى الجميع...
        </div>
    );

    if (books.length === 0) return (
        <div className="py-12 text-center text-gray-400 text-sm italic">
            (قسم الأكثر تفضيلاً سيظهر هنا عند حفظ القراء للكتب)
        </div>
    );

    return (
        <div className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 pb-1 bg-amber-600 rounded-full"></div>
                        <Star className="text-amber-600" size={32} fill="currentColor" />
                        <div className="w-12 h-1 pb-1 bg-amber-600 rounded-full"></div>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">إصداراتنا الأكثر تفضيلاً</h2>
                    <p className="mt-4 text-gray-500 font-semibold max-w-lg">مجموعة مختارة من الكتب التي نالت إعجاب قُرّائنا وتمت إضافتها للمفضلة بكثافة</p>
                </div>

                <div className="relative">
                    <Swiper
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={"auto"}
                        loop={books.length > 2}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 40,
                            depth: 250,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        navigation={{
                            nextEl: ".popular-next",
                            prevEl: ".popular-prev",
                        }}
                        modules={[EffectCoverflow, Navigation, Autoplay]}
                        className="mySwiper !pb-20"
                    >
                        {books.map((book) => (
                            <SwiperSlide key={book.id || book._id} style={{ width: "260px" }}>
                                {({ isActive }) => (
                                    <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-1000 group border border-gray-100 ${isActive ? 'scale-110' : 'scale-90 opacity-30 grayscale blur-[1px]'}`}>

                                        {/* زر المفضلة */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(e, book);
                                            }}
                                            className="absolute top-4 right-4 bg-white/90 shadow-lg p-2.5 rounded-full z-10 text-rose-500 transform group-hover:scale-110 transition-transform"
                                        >
                                            <Heart size={20} fill={isFavorite(book.id || book._id) ? "currentColor" : "none"} />
                                        </button>

                                        <Link href={`/book/${book.id || book._id}`} className="block h-full">
                                            <div className="h-56 relative w-full overflow-hidden">
                                                <Image
                                                    src={getImageUrl(book.cover || book.coverUrl)}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-115"
                                                    sizes="260px"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <span className="text-white text-xs font-bold bg-yellow-500 px-3 py-1 rounded-full">عرض التفاصيل</span>
                                                </div>
                                            </div>

                                            <div className="p-5 text-center bg-white">
                                                <h3 className="font-black text-gray-900 line-clamp-2 h-12 text-sm leading-snug">
                                                    {book.title}
                                                </h3>
                                                <div className="mt-4 flex items-center justify-center gap-1 text-amber-600">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-xs font-black text-gray-400 tracking-widest uppercase">Popular Choice</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* أزرار تنقل فخمة */}
                    <div className="popular-prev absolute top-1/2 left-0 z-30 cursor-pointer bg-white/90 p-5 rounded-full shadow-2xl text-amber-600 hover:bg-amber-600 hover:text-white transition-all -translate-y-1/2 -translate-x-4">
                        <ChevronLeft size={32} strokeWidth={3} />
                    </div>
                    <div className="popular-next absolute top-1/2 right-0 z-30 cursor-pointer bg-white/90 p-5 rounded-full shadow-2xl text-amber-600 hover:bg-amber-600 hover:text-white transition-all -translate-y-1/2 translate-x-4">
                        <ChevronRight size={32} strokeWidth={3} />
                    </div>
                </div>

                <div className="text-center mt-12 mb-10">
                    <Link href="/books?sort=popular" className="inline-flex items-center gap-4 py-4 px-12 border-2 border-amber-600 text-amber-600 rounded-full font-black hover:bg-amber-600 hover:text-white transition-all duration-300">
                        <ArrowLeft size={18} /> تصفح كل المفضلات
                    </Link>
                </div>
            </div>

            <div className="absolute top-1/4 left-0 w-80 h-80 bg-amber-50 rounded-full blur-[120px] opacity-40 -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-50 rounded-full blur-[120px] opacity-40 -z-10"></div>
        </div>
    );
};

export default React.memo(PopularCarousel);
