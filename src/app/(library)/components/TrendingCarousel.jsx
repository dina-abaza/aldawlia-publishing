"use client";
import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/api";

// استيراد Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

// استيراد استايلات Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const TrendingCarousel = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

    const { data: books = [], isLoading } = useQuery({
        queryKey: ["trending-books"],
        queryFn: async () => {
            const response = await api.get('/files/trending', {
                params: { limit: 12 }
            });
            console.log("Trending Books from API:", response.data.data);
            return response.data.data || [];
        },
    });

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x600?text=Trending";
        if (path.startsWith('http')) return path;
        return `https://e-library-api-production.up.railway.app${path}`;
    };

    const toggleFavorite = async (e, book) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info("سجّل الدخول لإضافة المفضلة");
            return router.push("/login");
        }
        const bookId = book.id || book._id;
        if (isFavorite(bookId)) {
            await removeFromFavorites(bookId);
        } else {
            await addToFavorites(bookId);
        }
    };

    if (isLoading) return (
        <div className="py-16 text-center animate-pulse text-amber-600 font-bold flex items-center justify-center gap-2">
            <Flame className="animate-bounce" /> جاري تحميل الأكثر طلباً...
        </div>
    );

    if (books.length === 0) return (
        <div className="py-12 text-center text-gray-400 text-sm italic">
            (قسم الأكثر طلباً سيظهر هنا بمجرد توفر عمليات شراء)
        </div>
    );

    return (
        <div className="py-16 relative overflow-hidden bg-white/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <Flame size={24} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">إصداراتنا الأكثر طلباً</h2>
                </div>

                <div className="relative px-2">
                    <Swiper
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={"auto"}
                        loop={books.length > 2}
                        coverflowEffect={{
                            rotate: 20,
                            stretch: 20,
                            depth: 150,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        navigation={{
                            nextEl: ".trending-next",
                            prevEl: ".trending-prev",
                        }}
                        modules={[EffectCoverflow, Navigation, Autoplay]}
                        className="mySwiper !pb-14"
                    >
                        {books.map((book) => (
                            <SwiperSlide key={book.id || book._id} style={{ width: "220px" }}>
                                {({ isActive }) => (
                                    <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 transition-all duration-700 flex flex-col group ${isActive ? 'scale-105 ring-2 ring-amber-100' : 'scale-90 opacity-40 grayscale'}`}>

                                        {/* زر المفضلة هائم */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(e, book);
                                            }}
                                            className="absolute top-4 left-4 bg-white/80 shadow-md backdrop-blur-md p-2 rounded-2xl z-10 hover:bg-red-50 text-red-500 transition-all duration-300"
                                        >
                                            <Heart size={18} fill={isFavorite(book.id || book._id) ? "currentColor" : "none"} />
                                        </button>

                                        <Link href={`/book/${book.id || book._id}`} className="flex flex-col p-3 h-full w-full">
                                            <div className="h-44 w-full relative mb-4 rounded-2xl overflow-hidden shadow-inner bg-gray-50">
                                                <Image
                                                    src={getImageUrl(book.cover || book.coverUrl)}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    sizes="220px"
                                                    loading={isActive ? "eager" : "lazy"}
                                                />
                                            </div>
                                            <h3 className="font-bold text-center text-gray-800 line-clamp-2 h-10 px-1 text-sm group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                                                {book.title}
                                            </h3>

                                            <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex justify-center">
                                                <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">مميز</span>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* أزرار تنقل بتصميم مخصص للأكثر طلباً */}
                    <div className="trending-prev absolute top-1/2 left-0 z-30 cursor-pointer bg-amber-600 p-4 rounded-2xl shadow-xl text-white hover:bg-amber-700 transition-all -translate-y-1/2 scale-90 md:scale-100">
                        <ChevronLeft size={24} />
                    </div>
                    <div className="trending-next absolute top-1/2 right-0 z-30 cursor-pointer bg-amber-600 p-4 rounded-2xl shadow-xl text-white hover:bg-amber-700 transition-all -translate-y-1/2 scale-90 md:scale-100">
                        <ChevronRight size={24} />
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/books?sort=trending" className="inline-flex items-center gap-3 py-3 px-8 bg-gray-900 text-white rounded-2xl font-bold hover:bg-amber-600 shadow-xl shadow-gray-200 transition-all group">
                        استكشاف الأكثر طلباً <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* زخرفة خلفية بسيطة */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl -z-10 opacity-30"></div>
        </div>
    );
};

export default React.memo(TrendingCarousel);
