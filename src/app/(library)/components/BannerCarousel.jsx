"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BannerCarousel() {
  const slides = useMemo(
    () => [
      { src: "/book1.jpg", brand: "كتب إلكترونية", title: "عالم من المعرفة", subtitle: "استكشف آلاف الكتب الرقمية في مختلف المجالات بلمسة زر واحدة" },
      { src: "/book2.jpg", brand: "الكتب إلكترونية", title: "قراءة بلا حدود", subtitle: "من الكلمه الى الخطة...ومن الحلم الى الواقع" },
      { src: "/book3.jpg", brand: "عروض مميزة", title: "أفضل الأسعار", subtitle: "ننشر الفكرة ...لنصنع الآثر" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const stopAutoPlay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [index]);

  const goTo = (i) => {
    stopAutoPlay();
    setIndex(i);
  };

  return (
    <section className="relative mx-auto mt-4 md:mt-6 overflow-hidden rounded-2xl" style={{ height: "min(70vh, 620px)" }}>
      {/* Stack all slides */}
      {slides.map((slide, i) => (
        <motion.div
          key={slide.src}
          initial={{ opacity: 0 }}
          // رجعنا الـ animate زي ما كان بالظبط عشان الصور متختفيش من الـ Memory
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ zIndex: i === index ? 10 : 0 }}
        >
          <Image 
            src={slide.src} 
            alt={slide.title} 
            fill 
            className="object-cover" 
            // التحسين الفعلي هنا وبدون تعطيل التحميل:
            priority={i === 0} // الصورة الأولى فقط تحمل فوراً
            loading={i === 0 ? "eager" : "lazy"} // الصور الباقية تحمل في الخلفية بهدوء
            sizes="100vw" // عشان المتصفح ميرتبكش في الحسابات
            quality={90} // رفعنا الجودة لـ 90 عشان الوضوح
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 20 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <span className="inline-block text-s md:text-md uppercase tracking-widest text-white mb-4 x-4 py-1 rounded-full">{slide.brand}</span>
                <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white mb-4 leading-tight">{slide.title}</h2>
                <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-100 max-w-2xl">{slide.subtitle}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3" suppressHydrationWarning>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 ease-out h-3 rounded-full ${i === index ? 'w-12 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`}
            aria-label={`اذهب إلى الشريحة ${i + 1}`}
            suppressHydrationWarning
          />
        ))}
      </div>
    </section>
  );
}