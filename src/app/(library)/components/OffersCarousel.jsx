"use client";
import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/api"; // استيراد ملف api.jsx للتعامل مع الطلبات

// استيراد Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

// استيراد استايلات Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const OffersCarousel = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await api.get('/files/on-sale', {
        params: { limit: 10 }
      });
      console.log(response.data.data)
      return response.data.data || [];
    },
  });

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x600?text=Aldawlia";
    if (path.startsWith('http')) return path;
    return `https://e-library-api-production.up.railway.app${path}`;
  };


  const toggleFavorite = async (e, book) => {
    e.preventDefault(); // لمنع تحويل الرابط
    console.log("البيانات اللي جاية من الـ API للكتاب ده هي:", book);
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

  if (isLoading) return <div className="py-16 text-center animate-pulse text-amber-600 font-bold">جاري تحميل العروض...</div>;

  return (
    <div className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">عروضنا المميزه</h2>
        </div>

        <div className="relative px-4">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={books.length > 1}
            coverflowEffect={{
              rotate: 30,    // درجة الدوران (مثل الكرة الأرضية)
              stretch: 0,    // تمدد العناصر
              depth: 200,    // عمق العناصر البعيدة
              modifier: 1,   // قوة التأثير
              slideShadows: false, // ظلال السلايد
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".button-next",
              prevEl: ".button-prev",
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiper !pb-12"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id || book._id} style={{ width: "240px" }}>
                {({ isActive }) => (
                  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-500 flex flex-col ${isActive ? 'scale-105 opacity-100' : 'scale-90 opacity-60'}`}>

                    {/* نسبة الخصم */}
                    {book.discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                        -{Math.round(book.discountPercent)}%
                      </div>
                    )}

                    {/* المفضلة */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(e, book);
                      }}
                      className="absolute top-3 left-3 bg-white/90 shadow-sm backdrop-blur p-1.5 rounded-full z-10 hover:bg-sky-50 text-amber-600 transition-colors"
                    >
                      <Heart size={18} fill={isFavorite(book.id) ? "currentColor" : "none"} />
                    </button>

                    <Link href={`/book/${book.id || book._id}`} className="flex flex-col items-center p-3 h-full w-full">
                      <div className="h-40 w-full relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(book.cover || book.coverUrl)}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="240px"
                          loading={isActive ? "eager" : "lazy"}
                          quality={70}
                        />
                      </div>
                      <h3 className="font-bold text-center text-gray-800 line-clamp-2 h-10 px-2 mt-4 hover:text-sky-900 transition-colors">{book.title}</h3>

                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* أزرار التنقل المخصصة */}
          <div className="button-prev absolute top-1/2 left-0 z-30 cursor-pointer bg-white p-3 rounded-full shadow-lg text-amber-600 hover:bg-sky-900 hover:text-amber-600 transition-all -translate-y-1/2">
            <ChevronLeft size={28} />
          </div>
          <div className="button-next absolute top-1/2 right-0 z-30 cursor-pointer bg-white p-3 rounded-full shadow-lg text-amber-600 hover:bg-sky-900 hover:text-amber-600 transition-all -translate-y-1/2">
            <ChevronRight size={28} />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/offers" className="inline-flex items-center gap-2 text-sky-900 font-bold hover:text-amber-600 transition-colors hover:underline">
            تصفح العروض لدينا<ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OffersCarousel);
