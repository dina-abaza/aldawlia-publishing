"use client";
import dynamic from "next/dynamic";
import { Flame } from "lucide-react";

// تحميل قسم الأكثر طلباً بشكل ديناميكي (Lazy Loading) لضمان سرعة الصفحة
const TrendingCarousel = dynamic(() => import("./TrendingCarousel"), {
  ssr: false,
  loading: () => (
    <div className="py-24 text-center animate-pulse text-amber-600 font-black flex items-center justify-center gap-3">
      <Flame className="animate-bounce" /> جاري تجهيز الأكثر طلباً...
    </div>
  ),
});

export default function TrendingCarouselLoader() {
  return <TrendingCarousel />;
}
