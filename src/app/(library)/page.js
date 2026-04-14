"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryGrid from "./components/categoriesgrid";
import BannerCarousel from "./components/BannerCarousel";
import HomeShowcase from "./components/HomeShowcase";
import QuickAccessLinks from "./components/QuickAccessLinks";
import HikmaResume from "./components/hikma resume";
import IslamicResume from "./components/islamic resume";
import { Languages } from "lucide-react";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  const fadeInVariant = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const languages = [
    { id: "ar", label: "كتب عربية", icon: "🇸🇦" },
    { id: "en", label: "English Books", icon: "🇺🇸" },
    { id: "fr", label: "Livres Français", icon: "🇫🇷" },
    { id: "es", label: "Libros Españoles", icon: "🇪🇸" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 overflow-hidden flex flex-col gap-8 md:gap-10">
      <div className="w-full">
        <BannerCarousel />
      </div>

      {/* Language Filter Section */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-6 md:-mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl md:rounded-3xl shadow-xl border border-white/20 flex flex-wrap justify-center gap-2 md:gap-4 max-w-2xl mx-auto">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-300 ${
                selectedLanguage === lang.id
                  ? "bg-sky-900 text-white shadow-lg shadow-sky-200 scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-xl">{lang.icon}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLanguage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <motion.section {...fadeInVariant} className="relative z-10">
            <HomeShowcase language={selectedLanguage} />
          </motion.section>

          <motion.section {...fadeInVariant}>
            <CategoryGrid language={selectedLanguage} />
          </motion.section>
        </motion.div>
      </AnimatePresence>

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