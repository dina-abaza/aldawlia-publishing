"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Facebook,
  MessageCircle,
  Instagram,
  Phone,
  Mail,
  Home,
  Info,
} from "lucide-react";
import api from "@/app/api";
import { useTranslation, Trans } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const isAr = i18n.language?.startsWith("ar");

  const [settings, setSettings] = useState({
    footerText: "",
    phone: "",
    facebookLink: "",
    instagramLink: "",
    whatsappLink: "",
  });

  const contactEmail = "contact@aldawlia-publishing.com";

  const formatExternalUrl = (url) => {
    if (!url || url === "#" || url === "") return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const formatWhatsappUrl = (url) => {
    if (!url || url === "") return "#";
    // If it doesn't look like a URL and doesn't start with wa.me, treat as phone number
    if (!url.startsWith("http") && !url.startsWith("wa.me")) {
      const cleanNum = url.replace(/\D/g, "");
      return `https://wa.me/${cleanNum}`;
    }
    return url.startsWith("http") ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        console.log("بيانات السيرفر:", res.data);
        if (res.data && res.data.status === "success") {
          setSettings(res.data.data);
        }
      } catch (e) {
        console.error("DEBUG: Failed to fetch settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer
      className="bg-sky-950 border-t-8 border-amber-600 pt-12 pb-8 mt-12 shadow-2xl relative text-white"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Quick Links */}
          <div className={`flex flex-col gap-6 ${isAr ? 'items-start' : 'items-start'}`}>
            <h3 className="text-xl font-bold border-b-2 border-amber-600 inline-block pb-2 w-fit">
              {t("footer_main.quick_links")}
            </h3>

            <ul className="flex flex-col gap-4 font-medium">
              <li>
                <Link href="/" className="flex items-center gap-3 hover:text-amber-600 transition-all duration-300">
                  <Home size={18} />
                  <span>{t("footer_main.home")}</span>
                </Link>
              </li>

              <li>
                <Link href="/about" className="flex items-center gap-3 hover:text-amber-600 transition-all duration-300">
                  <Info size={18} />
                  <span>{t("footer_main.about")}</span>
                </Link>
              </li>

              {[
                { name: t("footer_main.hikma"), href: "/hikma-institute" },
                { name: t("footer_main.distribution"), href: "/aldawlia-distribution" },
                { name: t("footer_main.directory"), href: "/islamic-business-directory" },
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="flex items-center gap-3 hover:text-amber-600 transition-all duration-300">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col gap-6 items-start">
            <h3 className="text-xl font-bold border-b-2 border-amber-600 inline-block pb-2 w-fit">
              {t("footer_main.follow_us")}
            </h3>

            <div className="flex gap-4">
              <a
                href={formatExternalUrl(settings.facebookLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
              >
                <Facebook size={20} />
              </a>

              <a
                href={formatExternalUrl(settings.instagramLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
              >
                <Instagram size={20} />
              </a>

              <a
                href={formatWhatsappUrl(settings.whatsappLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
              >
                <MessageCircle size={20} />
              </a>
            </div>

            {/* تم إضافة items-start هنا لضمان المحاذاة */}
            <div className="flex flex-col gap-3 text-sm font-medium items-start w-full">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-amber-600">
                <Mail size={16} className="text-amber-600 shrink-0" />
                <span>{contactEmail}</span>
              </a>

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 hover:text-amber-600"
                  style={{ unicodeBidi: 'plaintext' }} 
                >
                  <Phone size={16} className="text-amber-600 shrink-0" />
                  <span className="tabular-nums">{settings.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-4 items-start">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-black tracking-wider">
                <Trans
                  i18nKey="footer_main.about_title"
                  components={{
                    0: <span className="text-amber-600" />,
                  }}
                />
              </h2>
            </Link>

            <p className="text-sm leading-loose font-medium">
              {t("footer_main.about_desc")}
            </p>
          </div>

        </div>

        <div className="border-t border-amber-600 my-8"></div>

        <div className="text-center text-sm font-light uppercase tracking-widest flex flex-col md:flex-row justify-center items-center gap-2">
          <span>
            {settings.footerText ||
              t("footer_main.default_text", {
                year: new Date().getFullYear(),
              })}
          </span>

          <span className="hidden md:inline">|</span>

          <span>{t("footer_main.rights")}</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;