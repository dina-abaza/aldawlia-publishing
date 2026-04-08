"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Info, Phone } from "lucide-react"; // استيراد الأيقونات الجديدة
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";

const NavBottom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const cartItemsCount = isAuthenticated ? (cart?.items?.length || 0) : 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50 px-2" dir="rtl">

      {/* الرئيسية */}
      <div
        onClick={() => router.push('/')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/' ? 'text-amber-600' : 'text-gray-400'}`}
      >
        <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
        <span className={`text-[10px] mt-1 ${pathname === '/' ? 'font-bold' : ''}`}>الرئيسية</span>
      </div>

      {/* تواصل معنا - مضافة بجانب الرئيسية */}
      <div
        onClick={() => router.push('/contact')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/contact' ? 'text-amber-600' : 'text-gray-400'}`}
      >
        <Phone size={24} strokeWidth={pathname === '/contact' ? 2.5 : 2} />
        <span className={`text-[10px] mt-1 ${pathname === '/contact' ? 'font-bold' : ''}`}>تواصل معنا</span>
      </div>

      {/* زر السلة */}
      <div
        onClick={() => router.push('/cart')}
        className="relative -mt-10 flex flex-col items-center cursor-pointer"
      >
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-50">
          <div className={`p-3 rounded-full ${pathname === '/cart' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <ShoppingCart size={28} />
          </div>
          {/* عداد المنتجات */}
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
              {cartItemsCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] mt-1 ${pathname === '/cart' ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
          السلة
        </span>
      </div>

      {/* عن الموقع - بدلاً من العروض */}
      <div
        onClick={() => router.push('/about')}
        className={`flex flex-col items-center cursor-pointer ${pathname === '/about' ? 'text-amber-600' : 'text-gray-400'}`}
      >
        <Info size={24} strokeWidth={pathname === '/about' ? 2.5 : 2} />
        <span className={`text-[10px] mt-1 ${pathname === '/about' ? 'font-bold' : ''}`}>عن الموقع</span>
      </div>

      {/* الحساب / تسجيل خروج */}
      {isAuthenticated ? (
        <div
          onClick={logout}
          className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-amber-600"
        >
          <User size={24} />
          <span className="text-[10px] mt-1 font-bold">تسجيل خروج</span>
        </div>
      ) : (
        <div
          onClick={() => router.push('/register')}
          className={`flex flex-col items-center cursor-pointer ${pathname === '/register' ? 'text-amber-600' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className={`text-[10px] mt-1 ${pathname === '/register' ? 'font-bold' : ''}`}>إنشاء حساب</span>
        </div>
      )}

    </div>
  );
};

export default NavBottom;