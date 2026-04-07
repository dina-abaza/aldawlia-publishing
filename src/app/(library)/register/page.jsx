"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim() || form.name.length < 2) {
      toast.error("الاسم مطلوب ويجب أن يكون على الأقل حرفين");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }
    if (!form.password || form.password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون على الأقل 8 أحرف");
      return;
    }

    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success("تم إنشاء الحساب بنجاح");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">إنشاء حساب</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="الاسم"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-amber-600 text-right"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-amber-600 text-right"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور (8 أحرف على الأقل)"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-amber-600 text-right"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button 
            disabled={loading}
            className={`w-full mt-6 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-amber-600 hover:bg-sky-900 active:scale-95'}`}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <GoogleSignInButton />

        <p className="text-sm text-center mt-6 text-gray-500">
          عندك حساب؟{" "}
          <Link href="/login" className="text-sky-900 font-bold hover:text-amber-600 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
