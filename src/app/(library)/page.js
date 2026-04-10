"use client";
import { motion } from "framer-motion";
import CategoryGrid from "./components/categoriesgrid";
import BannerCarousel from "./components/BannerCarousel";
import QuickAccessLinks from "./components/QuickAccessLinks";
import HikmaResume from "./components/hikma resume";
import IslamicResume from "./components/islamic resume";

export default function Home() {
  const fadeInVariant = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 }, // تعديل: amount بدلاً من margin لتحسين المراقبة
    transition: { duration: 0.5, ease: "easeOut" } // تقليل المدة لسرعة الاستجابة
  };

  return (
    <main className="min-h-screen bg-gray-50 overflow-hidden">
      {/* 1. البانر: شيلنا الـ motion.div التقيل وخليناه عادي لأن البانر نفسه جواه أنميشن */}
      <div className="max-w-7xl mx-auto px-4">
        <BannerCarousel />
      </div>

      {/* 2. السكاشن الباقية: استخدمنا motion.section عشان المتصفح يفهم التقسيم */}
      <motion.section {...fadeInVariant}>
        <CategoryGrid />
      </motion.section>

      <motion.section {...fadeInVariant}>
        <HikmaResume />
      </motion.section>

      <motion.section {...fadeInVariant}>
        <IslamicResume />
      </motion.section>

      <motion.section {...fadeInVariant}>
        <QuickAccessLinks />
      </motion.section>
    </main>
  );
}