"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Heart, Tag, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import api from '@/app/api';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/(library)/store/useAuthStore';
import { useFavoritesStore } from '@/app/(library)/store/useFavoritesStore';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const BookCarouselSection = ({ title, icon: Icon, books, loading, colorClass }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const isAr = i18n.language === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2.2);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef(null);
  const GAP = 12;

  const maxIndex = Math.max(0, books.length - Math.floor(itemsPerView));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // التحريك التلقائي
  useEffect(() => {
    if (isPaused || loading || books.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // يتحرك كل 3 ثواني

    return () => clearInterval(interval);
  }, [nextSlide, isPaused, loading, books.length]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(2.2); 
      } else if (width < 1024) {
        setItemsPerView(3.5);
      } else {
        setItemsPerView(5);
      }
      
      // نستخدم requestAnimationFrame للتأكد من أن الـ DOM استقر
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          setContainerWidth(carouselRef.current.offsetWidth);
        }
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // حساب العرض بشكل آمن لتجنب القيم السالبة في أول رندر
  const itemWidth = containerWidth > 0 
    ? (containerWidth - (Math.ceil(itemsPerView) - 1) * GAP) / itemsPerView
    : 150; // عرض افتراضي بسيط حتى يتم الحساب

  const getCleanUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    return url.trim().replace(/[`]/g, "");
  };

  const toggleFavorite = async (e, bookId) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) return router.push("/login");
    isFavorite(bookId) ? await removeFromFavorites(bookId) : await addToFavorites(bookId);
  };

  if (loading) return <div className="h-64 bg-gray-100 animate-pulse rounded-3xl" />;

  return (
    <div 
      className="space-y-4 relative" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isAr ? "flex-row" : "flex-row-reverse"}`}>
        <div className={`flex items-center gap-2 ${isAr ? "flex-row" : "flex-row-reverse"}`}>
          <div className={`p-2 rounded-xl ${colorClass === "amber" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-900"}`}>
            <Icon size={20} />
          </div>
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
        </div>
        <div className="flex gap-2" dir="ltr">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white border shadow-sm active:scale-90"><ChevronLeft size={18} /></button>
          <button onClick={nextSlide} className="p-2 rounded-full bg-white border shadow-sm active:scale-90"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Carousel Container */}
      <div ref={carouselRef} className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: `${GAP}px`, width: "max-content" }}
          animate={{ x: isAr ? (currentIndex * (itemWidth + GAP)) : -(currentIndex * (itemWidth + GAP)) }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {books.map((book, idx) => {
            const bookId = book.id || book._id;
            const coverSrc = getCleanUrl(book.coverUrl || book.cover);

            return (
              <div
                key={`${bookId}-${idx}`}
                style={{ width: itemWidth }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative flex flex-col flex-shrink-0"
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, bookId)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-20 text-sky-900 shadow-sm"
                >
                  <Heart size={16} fill={isFavorite(bookId) ? "currentColor" : "none"} className={isFavorite(bookId) ? "text-amber-600" : ""} />
                </button>

                {/* ✅ صورة الكتاب: مالي الكارت بالكامل Edge-to-Edge */}
                <div 
                  className="relative w-full aspect-[3/4] cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => router.push(`/book/${bookId}`)}
                >
                  <Image
                    src={coverSrc}
                    alt={book.title || "book"}
                    fill
                    sizes="(max-width: 640px) 50vw, 250px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized={coverSrc.includes('http')} // عشان لو السيرفر بيمنع الـ optimization
                  />
                </div>

                {/* العنوان */}
                <div 
                  className="p-3 bg-white flex-1 flex items-center justify-center"
                  onClick={() => router.push(`/book/${bookId}`)}
                >
                  <h3 className="font-bold text-[13px] md:text-[15px] text-sky-950 text-center line-clamp-1">
                    {book.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

const HomeShowcase = ({ language = "ar" }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const { data: latestBooks = [], isLoading: loadingLatest } = useQuery({
    queryKey: ['latestBooks', language],
    queryFn: async () => {
      const response = await api.get('/files/latest', { params: { language } });
      return response?.data?.data || [];
    },
  });

  const { data: offerBooks = [], isLoading: loadingOffers } = useQuery({
    queryKey: ['offerBooks', language],
    queryFn: async () => {
      const response = await api.get('/files/on-sale', { params: { limit: 20, language } });
      return response?.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-12">
        <BookCarouselSection title={t('home.showcase.latest_slider')} icon={Sparkles} books={latestBooks} loading={loadingLatest} colorClass="sky" />
        <BookCarouselSection title={t('home.showcase.offers_slider')} icon={Tag} books={offerBooks} loading={loadingOffers} colorClass="amber" />
      </div>
    </section>
  );
};

export default HomeShowcase;