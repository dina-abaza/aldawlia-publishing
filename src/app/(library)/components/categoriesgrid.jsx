"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageLoader from '@/app/loading';
import api from '@/app/api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حصل خطأ أثناء تحميل البيانات');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <div className="text-center text-red-500 mt-6">{error}</div>;



  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mb-20" dir="rtl">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
        تصنيفات المتجر
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {categories?.map((category) => (
          <Link
            href={{
              pathname: `/category/${category._id}`,
              query: { name: category.name },
            }}
            key={category._id}
            className="relative h-64 md:h-80 overflow-hidden rounded-2xl shadow-lg group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* التعديل هنا: استخدام coverUrl أو coverImageKey بدلاً من image */}
            <img
              src={category.coverUrl || category.coverImageKey || category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Glass effect overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-black/20 backdrop-blur-sm rounded-t-2xl flex flex-col items-center transition-all duration-500">
              <span className="text-white font-bold text-base md:text-lg uppercase tracking-tight text-center">
                {category.name}
              </span>

              {/* إضافة مكان الوصف هنا */}
              <p className="text-white text-[10px] md:text-xs mt-1 text-center opacity-80 line-clamp-2">
                {"تصفح المنتجات في هذا القسم"}
              </p>
            </div>

            {/* Decorative gold accent */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;