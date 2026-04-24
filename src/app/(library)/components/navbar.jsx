"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// التعديل: استيراد مباشر لكل أيقونة لتقليل حجم الـ JavaScript
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import Search from "lucide-react/dist/esm/icons/search";
import Phone from "lucide-react/dist/esm/icons/phone";
import Info from "lucide-react/dist/esm/icons/info";
import Heart from "lucide-react/dist/esm/icons/heart";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Languages from "lucide-react/dist/esm/icons/languages";

import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import api from "@/app/api";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { favorites, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    if (isAuthenticated) {
      // تعديل الأداء: تأخير بسيط للطلبات عشان الصفحة تفتح الأول
      const timer = setTimeout(() => {
        fetchFavorites();
        fetchCart();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchFavorites, fetchCart]);

  const cartItemsCount = isAuthenticated ? (cart?.items?.length || 0) : 0;

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState("");

  const formatWhatsappUrl = (url) => {
    if (!url || url === "") return "#";
    // Lo el url doesn't start with http or wa.me, it might be a phone number
    if (!url.startsWith("http") && !url.startsWith("wa.me")) {
      const cleanNum = url.replace(/\D/g, ""); // remove non-digits
      return `https://wa.me/${cleanNum}`;
    }
    return url.startsWith("http") ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data && res.data.status === "success") {
          setWhatsappLink(res.data.data.whatsappLink);
        }
      } catch (e) {
        console.error("Failed to fetch settings in navbar", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get('/files', { params: { q: keyword, limit: 5 } });
        const results = response.data.data || [];
        setSuggestions(results);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setSuggestions([]);
    router.push(`/search?keyword=${keyword}`);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-[#f2f2f2] sticky top-0 z-[300] px-4 h-20 flex items-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto gap-2 md:gap-4">

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition-all text-sky-900 font-bold shadow-sm"
            title={i18n.language === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
          >
            <Languages size={18} />
            <span className="text-xs uppercase">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 border-l ml-4 pl-4 border-gray-300">
                <Link href="/about" className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors">
                  <Info size={18} />
                  <span className="text-sm">{t('navbar.about')}</span>
                </Link>
                <a
                  href={formatWhatsappUrl(whatsappLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors"
                >
                  <Phone size={18} />
                  <span className="text-sm">{t('navbar.contact')}</span>
                </a>
              </div>

              <div className="flex items-center gap-1 md:gap-3">
                <Link href="/favorites" className="md:hidden relative flex items-center justify-center w-8 h-8">
                  <Heart size={22} className="text-sky-900" />
                  {favorites?.length > 0 && (
                    <span className="absolute top-0 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  className="hidden md:block bg-sky-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-600 transition-all"
                >
                  {t('navbar.logout')}
                </button>

                <span className="font-bold text-sm md:text-base whitespace-nowrap">
                  {user?.name && `${t('navbar.welcome')} ${user.name.split(" ")[0]}`}
                </span>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/about" className="px-3 py-2 text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors">
                <Info size={18} />
                <span>{t('navbar.about')}</span>
              </Link>
              <a
                href={formatWhatsappUrl(whatsappLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors"
              >
                <Phone size={18} />
                <span className="text-sm">{t('navbar.contact')}</span>
              </a>
              <span className="text-gray-300 mx-1">|</span>
              <Link href="/login" className="px-4 py-2 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition-all">
                {t('navbar.login')}
              </Link>
              <Link href="/register" className="bg-sky-900 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-amber-600 transition-all">
                {t('navbar.register')}
              </Link>
            </div>
          )}

          <div className="hidden md:flex gap-4 border-r pr-4 border-gray-300">
            <Link href="/favorites" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <Heart size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
              <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">{t('navbar.favorites')}</span>
              {isAuthenticated && favorites?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

           
              <Link href="/my-purchases" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
                <BookOpen size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
                <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">{t('navbar.my_purchases')}</span>
              </Link>
           

            <Link href="/cart" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <ShoppingCart size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
              <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">{t('navbar.cart')}</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="relative flex-1 min-w-[110px] sm:min-w-[200px] md:max-w-[350px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const v = e.target.value;
                setKeyword(v);
                if (!v.trim()) setSuggestions([]);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t('navbar.search')}
              className="w-full bg-[#e8e8e8] rounded-2xl py-2 pr-10 pl-4 text-sm outline-none"
            />
            <Search
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              size={18}
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow z-[1000]">
                {suggestions.map((item, index) => (
                  <div
                    key={item.id || item._id || index}
                    onClick={() => {
                      router.push(`/book/${item.id || item._id}`);
                      setKeyword("");
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {item.title || item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/"
            className="flex-shrink-0 flex items-end justify-center h-full -mt-4 md:-mt-6"
          >
            <Image
              src="/logohome.webp"
              alt="Logo"
              width={60}
              height={60}
              priority
              className="object-contain w-[55px] md:w-[80px] h-auto"
            />
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;