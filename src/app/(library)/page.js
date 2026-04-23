"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryGrid from "./components/categoriesgrid";
import BannerCarousel from "./components/BannerCarousel";
import HomeShowcase from "./components/HomeShowcase";
import QuickAccessLinks from "./components/QuickAccessLinks";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  const fadeInVariant = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const languages = [
    { id: "ar", label: "العربية", icon: "🇸🇦" },
    { id: "en", label: "English", icon: "🇺🇸" },
    { id: "es", label: "Español", icon: "🇪🇸" },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden flex flex-col gap-8 md:gap-10">
      <div className="w-full">
        <BannerCarousel />
      </div>

      {/* Language Filter Section */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-4 md:-mt-6 relative z-20">
        <div className="flex items-center justify-center gap-6 md:gap-10 max-w-xl mx-auto">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`flex items-center gap-2 py-2 font-black transition-all duration-300 relative ${
                selectedLanguage === lang.id
                  ? "text-sky-900 scale-110"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl md:text-2xl">{lang.icon}</span>
              <span className="text-sm md:text-lg whitespace-nowrap">{lang.label}</span>
              {selectedLanguage === lang.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-sky-900 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
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
        <QuickAccessLinks />
      </motion.section>
    </div>
  );
}