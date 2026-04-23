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
    <div className={`max-w-7xl mx-auto px-4 py-4 mb-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-blue-800">
        {t('home.category_grid.title')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <Link
              href={{
                pathname: `/category/${category._id}`,
                query: { name: category.name },
              }}
              key={category._id}
              className="relative h-72 md:h-96 overflow-hidden rounded-2xl shadow-lg group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <Image
                src={category.coverUrl || category.coverImageKey || category.image || "/placeholder.jpg"}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 bg-black/20 backdrop-blur-sm rounded-t-2xl flex flex-col items-center transition-all duration-500">
                <span className="text-white font-bold text-base md:text-lg uppercase tracking-tight text-center">
                  {category.name}
                </span>
                <p className="text-white text-[10px] md:text-xs mt-1 text-center opacity-80 line-clamp-2">
                  {t('home.category_grid.browse')}
                </p>
              </div>

              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            {t('home.category_grid.empty')}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;
