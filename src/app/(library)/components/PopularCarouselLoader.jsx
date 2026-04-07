"use client";
import dynamic from "next/dynamic";
import { Star } from "lucide-react";

// تحميل قسم الأكثر تفضيلاً بشكل ديناميكي (Lazy Loading) لضمان سرعة الصفحة
const PopularCarousel = dynamic(() => import("./PopularCarousel"), {
  ssr: false,
  loading: () => (
    <div className="py-24 text-center animate-pulse text-yellow-600 font-black flex items-center justify-center gap-3">
      <Star className="animate-spin-slow" /> جاري تحميل المفضل لدى الجميع...
    </div>
  ),
});

export default function PopularCarouselLoader() {
  return <PopularCarousel />;
}
