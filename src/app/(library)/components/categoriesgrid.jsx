"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageLoader from '@/app/loading';
import api from '@/app/api';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

const CategoryGrid = ({ language = "ar" }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories', language],
    queryFn: async () => {
      const response = await api.get('/categories', { params: { language } });
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <div className="text-center text-red-500 mt-6">{t('home.category_grid.error')}</div>;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 mb-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* عنوان القسم مع خط "المسطرة" */}
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-sky-950">
          {t('home.category_grid.title')}
        </h2>
        <div className="w-12 h-1 bg-amber-500 mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <Link
              href={{
                pathname: `/category/${category._id}`,
                query: { name: category.name },
              }}
              key={category._id}
              className="relative h-60 md:h-80 overflow-hidden rounded-[2rem] shadow-sm border border-gray-100 group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white"
            >
              {/* ✅ الحاوية: خلفية فاتحة وصورة كاملة متوسنة */}
              <div className="relative w-full h-full bg-slate-50">
                <Image
                  src={category.coverUrl || category.coverImageKey || category.image || "/placeholder.jpg"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 250px"
                  /* استخدمنا cover مع center عشان تملأ الكارت بشكل شيك، 
                     ولو الصور عندك أيقونات، غيرها لـ object-contain */
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  unoptimized={true}
                />
                
                {/* Overlay تدريجي عشان الكلام يظهر بوضوح */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
              </div>

              {/* نصوص القسم - في الأسفل دايمًا ومحاذية */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center">
                <span className="text-white font-bold text-sm md:text-base uppercase tracking-wide text-center">
                  {category.name}
                </span>
                <p className="text-white/80 text-[10px] md:text-xs mt-1 text-center font-medium">
                  {t('home.category_grid.browse')}
                </p>
                
                {/* خط التزيين عند الهوفر */}
                <div className="w-0 group-hover:w-10 h-1 bg-amber-500 mt-2 rounded-full transition-all duration-500"></div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-200">
            {t('home.category_grid.empty')}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;