"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Zap, Heart, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/app/api';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/(library)/store/useAuthStore';
import { useFavoritesStore } from '@/app/(library)/store/useFavoritesStore';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const BookCarouselSection = ({ title, icon: Icon, books, loading, colorClass, viewAllPath }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const isAr = i18n.language === 'ar';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(2);
  const autoPlayRef = useRef(null);

  // تحديث عدد العناصر المعروضة بناءً على حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1.2); // للموبايل عرض كتاب وجزء من التالي
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(4);
      } else {
        setItemsPerView(5); // للشاشات الكبيرة جداً
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCleanUrl = (url) => {
    if (!url || typeof url !== 'string') return "/placeholder.jpg";
    return url.trim().replace(/[`]/g, "");
  };

  const nextSlide = useCallback(() => {
    if (books.length <= itemsPerView) return;
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next > books.length - Math.floor(itemsPerView) ? 0 : next;
    });
  }, [books.length, itemsPerView]);

  const prevSlide = useCallback(() => {
    if (books.length <= itemsPerView) return;
    setCurrentIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? Math.max(0, books.length - Math.floor(itemsPerView)) : next;
    });
  }, [books.length, itemsPerView]);

  useEffect(() => {
    if (!isPaused && books.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide, isPaused, books.length, itemsPerView]);

  const toggleFavorite = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info(t("search_page.login_for_favorites"));
      return router.push("/login");
    }
    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="min-w-[200px] bg-white rounded-3xl p-3 border border-gray-100 animate-pulse">
            <div className="h-40 bg-gray-100 rounded-2xl mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 relative group/carousel" 
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}>
      <div className={`flex items-center justify-between ${isAr ? "flex-row" : "flex-row-reverse"}`}>
        <div className={`flex items-center gap-2 ${isAr ? "flex-row" : "flex-row-reverse"}`}>
          <div className={`p-2 rounded-xl ${colorClass === "amber" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-900"}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-lg font-black text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(viewAllPath)}
            className={`text-xs font-bold ${colorClass === "amber" ? "text-amber-600" : "text-sky-900"} hover:underline`}
          >
            {t("home.showcase.view_all")}
          </button>
          
          {books.length > itemsPerView && (
            <div className="flex gap-1.5">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-sky-50 hover:text-sky-900 transition-all active:scale-90"
              >
                {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-sky-50 hover:text-sky-900 transition-all active:scale-90"
              >
                {isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl -mx-2 px-2 py-1">
        <motion.div 
          className="flex gap-4"
          animate={{ x: isAr ? `${currentIndex * (100 / itemsPerView)}%` : `-${currentIndex * (100 / itemsPerView)}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ 
            width: books.length > itemsPerView ? `${(books.length * 100) / itemsPerView}%` : '100%',
            display: 'flex'
          }}
        >
          {books.length > 0 ? (
            books.map((book, idx) => {
              const bookId = book.id || book._id;
              return (
                <div
                  key={`${bookId}-${idx}`}
                  style={{ width: books.length > itemsPerView ? `calc(100% / ${books.length})` : `calc(100% / ${itemsPerView})` }}
                  onClick={() => router.push(`/book/${bookId}`)}
                  className="bg-white rounded-[2rem] shadow-sm flex flex-col items-center relative border border-gray-100 overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <button
                    onClick={(e) => toggleFavorite(e, bookId)}
                    className="absolute top-4 right-4 bg-white/95 p-2 rounded-full z-10 text-sky-900 hover:text-amber-600 hover:bg-sky-50 transition-all shadow-md active:scale-90"
                  >
                    <Heart size={16} fill={isFavorite(bookId) ? "currentColor" : "none"} className={isFavorite(bookId) ? "text-amber-600" : ""} />
                  </button>

                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={getCleanUrl(book.coverUrl || book.cover)}
                      alt={book.title || "Book"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-col items-center pb-6 w-full px-4 pt-4">
                    <h3 className="font-bold text-[14px] text-center line-clamp-1 h-6 leading-snug text-gray-800 group-hover:text-sky-900 transition-colors">
                      {book.title || book.name}
                    </h3>
                    
                    {/* نبذة عن الكتاب */}
                    <p className="text-[11px] text-gray-500 text-center line-clamp-2 h-8 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {book.description || t("home.showcase.no_description")}
                    </p>

                    <div className="w-8 h-1 bg-amber-500/20 rounded-full mt-3 group-hover:w-16 group-hover:bg-amber-500 transition-all duration-500" />
                    <span className="text-[11px] text-amber-600 font-black mt-3 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      {t("search_page.explore_more")}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-200">
              {t("home.showcase.no_books_found")}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const HomeShowcase = ({ language = "ar" }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [latestBooks, setLatestBooks] = useState([]);
  const [offerBooks, setOffersBooks] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoadingLatest(true);
      try {
        const response = await api.get('/files/latest', { params: { language } });
        setLatestBooks(response?.data?.data || []);
      } catch (err) {
        console.error("Latest fetch error:", err);
      } finally {
        setLoadingLatest(false);
      }
    };

    const fetchOffers = async () => {
      setLoadingOffers(true);
      try {
        const response = await api.get('/files/on-sale', { params: { limit: 20, language } });
        setOffersBooks(response?.data?.data || []);
      } catch (err) {
        console.error("Offers fetch error:", err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchLatest();
    fetchOffers();
  }, [language]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-16 md:gap-24">
        {/* Latest Releases */}
        <div className="flex flex-col gap-8">
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-2 h-8 bg-sky-900 rounded-full"></div>
            <h2 className={`text-2xl md:text-3xl font-black text-sky-950 tracking-tight ${isAr ? 'font-noto' : ''}`}>
              {t('home.showcase.latest_title')}
            </h2>
          </div>
          <BookCarouselSection
            title={t('home.showcase.latest_slider')}
            icon={Sparkles} 
            books={latestBooks} 
            loading={loadingLatest} 
            colorClass="sky"
            viewAllPath={`/search?sort=latest&language=${language}`}
          />
        </div>

        {/* Offers / On Sale */}
        <div className="flex flex-col gap-8">
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
            <h2 className={`text-2xl md:text-3xl font-black text-sky-950 tracking-tight ${isAr ? 'font-noto' : ''}`}>
              {t('home.showcase.offers_title')}
            </h2>
          </div>
          <BookCarouselSection
            title={t('home.showcase.offers_slider')}
            icon={Tag} 
            books={offerBooks} 
            loading={loadingOffers} 
            colorClass="amber"
            viewAllPath={`/offers?language=${language}`}
          />
        </div>
      </div>
    </section>
  );
};

export default HomeShowcase;
