"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Phone, Info, Heart, BookOpen } from "lucide-react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import api from "@/app/api";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { favorites, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
      fetchCart();
    }
  }, [isAuthenticated, fetchFavorites, fetchCart]);

  // التعديل هنا: إذا لم يكن مسجل دخول، اجعل العدد دائماً 0
  const cartItemsCount = isAuthenticated ? (cart?.items?.length || 0) : 0;

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  return (
    <nav className="bg-[#f2f2f2] sticky top-0 z-300 px-4 h-20 flex items-center" dir="rtl">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto gap-2 md:gap-4">

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 border-l ml-4 pl-4 border-gray-300">
                <Link href="/about" className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors">
                  <Info size={18} />
                  <span className="text-sm">عن الموقع</span>
                </Link>
                <a
                  href="https://wa.me/12017059422?text=مرحبًا%20،%20أود%20التواصل%20معكم"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors"
                >
                  <Phone size={18} />
                  <span className="text-sm">تواصل معنا</span>
                </a>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {/* القلب للموبايل فقط - مظبوط بالمللي */}
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
                  تسجيل خروج
                </button>

                {/* رجعنا حجم الخط الأصلي بتاعك */}
                <span className="font-bold text-sm md:text-base whitespace-nowrap">
                 {user?.name && `مرحبا، ${user.name.split(" ")[0]}`}
                </span>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/about" className="px-3 py-2 text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors">
                <Info size={18} />
                <span>عن الموقع</span>
              </Link>
              <a
                href="https://wa.me/12017059422?text=مرحبًا%20،%20أود%20التواصل%20معكم"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 font-bold hover:text-amber-600 flex items-center gap-1 transition-colors"
              >
                <Phone size={18} />
                <span className="text-sm">تواصل معنا</span>
              </a>
              <span className="text-gray-300 mx-1">|</span>
              <Link href="/login" className="px-4 py-2 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition-all">
                تسجيل دخول
              </Link>
              <Link href="/register" className="bg-sky-900 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-amber-600 transition-all">
                إنشاء حساب
              </Link>
            </div>
          )}

          <div className="hidden md:flex gap-4 border-r pr-4 border-gray-300">
            <Link href="/favorites" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <Heart size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
              <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">المفضلة</span>
              {/* تعديل للمفضلة أيضاً لضمان عدم ظهور الرقم عند الخروج */}
              {isAuthenticated && favorites?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link href="/my-purchases" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
                <BookOpen size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
                <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">مشترياتي</span>
              </Link>
            )}

            <Link href="/cart" className="relative flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <ShoppingCart size={22} className="group-hover:text-amber-600 transition-colors text-sky-900" />
              <span className="text-xs font-bold group-hover:text-amber-600 transition-colors text-sky-900">السلة</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="relative flex-1 min-w-[120px] sm:min-w-[200px] md:max-w-[350px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const v = e.target.value;
                setKeyword(v);
                if (!v.trim()) setSuggestions([]);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="بحث ...."
              className="w-full bg-[#e8e8e8] rounded-2xl py-2 pr-10 pl-4 text-sm outline-none"
            />
            <Search
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              size={18}
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow z-[1000]">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      router.push(`/book/${item._id}`);
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
              src="/logohome.png"
              alt="Logo"
              // هنا بنحدد الحجم الأصغر (للموبايل)
              width={60}
              height={60}
              priority
              // هنا بنكبر الحجم في اللاب باستخدام md:w-[90px]
              className="object-contain w-[60px] md:w-[90px] h-auto"
            />
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;