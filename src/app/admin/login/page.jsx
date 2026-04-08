"use client";
import { useState } from "react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, UserCog } from "lucide-react"; // إضافة أيقونات للشكل الجمالي

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const adminLogin = useAdminAuthStore((state) => state.adminLogin);
    const router = useRouter();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        const result = await adminLogin(email, password);
        if (result.success) {
            toast.success("مرحباً بك في لوحة التحكم");
            window.location.href = '/admin/';
        } else {
            toast.error(result.message || "صلاحيات غير كافية أو بيانات خاطئة");
        }
    };

    return (
        // خلفية متدرجة حديثة ونعومة في العرض
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 w-full p-4 animate-in fade-in duration-500" dir="rtl">
            <form onSubmit={handleAdminLogin} className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/20 w-full max-w-md border border-gray-100 dark:border-gray-700 space-y-8">
                
                {/* رأس النموذج - شكل جذاب */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-full border border-red-100 dark:border-red-900/50 shadow-inner">
                        <UserCog className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        لوحة تحكم الادارة
                    </h1>
                    <div className="w-20 h-1 bg-red-600 rounded-full mt-1"></div>
                </div>

                <div className="space-y-6">
                    {/* حقل البريد الإلكتروني - تصميم حديث مع أيقونة */}
                    <div className="relative group">
                        <label className="absolute right-4 -top-2.5 text-xs font-bold text-gray-500 bg-white dark:bg-gray-800 px-1.5 transition-colors group-focus-within:text-red-600">
                            بريد المسؤول
                        </label>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email" 
                            placeholder="admin@example.com"
                            className="w-full p-4 pr-11 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* حقل كلمة السر - تصميم حديث مع أيقونة */}
                    <div className="relative group">
                        <label className="absolute right-4 -top-2.5 text-xs font-bold text-gray-500 bg-white dark:bg-gray-800 px-1.5 transition-colors group-focus-within:text-red-600">
                            كلمة السر
                        </label>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                            <LockKeyhole size={18} />
                        </div>
                        <input
                            type="password" 
                            placeholder="••••••••"
                            className="w-full p-4 pr-11 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* زر تسجيل الدخول - جذاب وقوي */}
                    <button type="submit" className="w-full bg-gray-900 hover:bg-black dark:bg-red-600 dark:hover:bg-red-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group">
                        تسجيل دخول الإدارة
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>
                
                {/* لمسة نهائية جمالية أسفل الفورم */}
                <p className="text-center text-xs text-gray-400 pt-6 border-t border-gray-100 dark:border-gray-700">
                    نظام إدارة المحتوى الآمن © ٢٠٢٤
                </p>
            </form>
        </div>
    );
}