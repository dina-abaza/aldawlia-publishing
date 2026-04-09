"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { toast } from "react-toastify";
import PageLoader from "@/app/loading";

const AuthSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    const authenticate = async () => {
      if (token) {
        // 1. حفظ التوكن فوراً
        localStorage.setItem("jwtToken", token);

        try {
          // 2. أهم خطوة: استني لما بيانات اليوزر تيجي فعلياً
          // تأكدي إن checkAuth في الـ store بتعمل await للطلب
          const userData = await checkAuth();


          // 3. التحويل للصفحة الرئيسية بعد التأكد من وجود البيانات
          router.replace("/");
        } catch (error) {
          toast.error("حدث خطأ أثناء جلب بيانات الحساب");
          router.replace("/login");
        }
      }
    };

    authenticate();
  }, [searchParams, router, checkAuth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f8f8f8]">
      <PageLoader />
      <h2 className="mt-4 text-xl font-bold text-gray-700">جاري تسجيل الدخول...</h2>
    </div>
  );
};

export default AuthSuccessPage;
