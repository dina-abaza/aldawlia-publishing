"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SubNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const mainSections = [
    {
      id: "library",
      label: t("navbar.aldawlia_publishing"),
      path: "/",
      icon: <BookOpen className="w-5 h-5" />,
      active: pathname === "/" || pathname === ""
    },
    {
      id: "hikma",
      label: t("navbar.hikma_institute"),
      path: "/hikma-institute",
      icon: <GraduationCap className="w-5 h-5" />,
      active: pathname.startsWith("/hikma-institute")
    },
    {
      id: "islamic",
      label: t("navbar.islamic_directory"),
      path: "/islamic-business-directory",
      icon: <Building2 className="w-5 h-5" />,
      active: pathname.startsWith("/islamic-business-directory")
    },
  ];

  return (
    <div className="w-full sticky top-[72px] md:top-[88px] z-40 py-1 md:py-2 pointer-events-none">
      <div className="max-w-7xl mx-auto px-0 md:px-4 flex justify-center">
        {/* Floating Pill Container with Glassmorphism */}
        <nav className="pointer-events-auto bg-white/75 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(15,23,42,0.12)] rounded-[2rem] p-1 flex md:p-1.5 items-center justify-between md:justify-center gap-0.5 md:gap-2 relative w-full max-w-[95%] md:max-w-fit">
          {mainSections.map((section) => (
            <button
              key={section.id}
              onClick={() => router.push(section.path)}
              className={`relative flex items-center justify-center gap-1.5 md:gap-2 px-2.5 py-2 md:px-6 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-500 whitespace-nowrap flex-1 md:flex-none group ${section.active
                  ? "text-white"
                  : "text-slate-500 hover:text-sky-900"
                }`}
            >
              {/* Active Background Bubble */}
              {section.active && (
                <motion.div
                  layoutId="activePillBg"
                  className="absolute inset-0 bg-sky-900 shadow-lg shadow-sky-900/20"
                  style={{ borderRadius: 9999 }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <span
                className={`relative hidden sm:inline-flex z-10 transition-transform duration-500 ${section.active ? "scale-110" : "group-hover:scale-110"
                  }`}
              >
                {React.cloneElement(section.icon, {
                  className: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                })}
              </span>
              <span className="relative z-10 leading-none">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubNavbar;
