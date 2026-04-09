"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/api"; // تأكدي من مسار ملف الـ axios الخاص بك

const PaymentStatus = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasCalledApi = useRef(false); // لمنع استدعاء الـ API مرتين بسبب الـ StrictMode

    // الحصول على المعرفات من الرابط (السيرفر بيبعت orderId لبيموب أو transactionId لسترايب)
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId"); 
    const transactionId = searchParams.get("transactionId");
    
    // المعرف المتوفر حالياً
    const id = orderId || transactionId;

    useEffect(() => {
        // لو مفيش نجاح في الرابط أو مفيش ID، نرجعه للرئيسية
        if (success !== "true" || !id) {
            if (success === "false") toast.error("فشلت عملية الدفع، يرجى المحاولة مرة أخرى");
            router.push("/");
            return;
        }

        const verifyPayment = async () => {
            if (hasCalledApi.current) return;
            hasCalledApi.current = true;

            try {
                // 1. التحقق من حالة الدفع من السيرفر (بند 4 في الوثيقة)
                // المسار: GET /payments/:transactionId
                const { data } = await api.get(`/payments/${id}`);
                
                // 2. استخراج بيانات الكتاب من رد السيرفر
                // الوثيقة بتقول البيانات بترجع فيها book يحتوي على id
                const bookId = data.data?.book?.id || data.data?.bookId;

                toast.success("تم تأكيد الدفع بنجاح!");

                // 3. التوجيه لصفحة الكتاب عشان يقدر يحمله فوراً
                if (bookId) {
                    router.push(`/book/${bookId}`);
                } else {
                    router.push("/my-library"); // أو صفحة المشتريات لو الـ ID تاه
                }
            } catch (err) {
                console.error("Verification Error:", err);
                toast.error(err.response?.data?.message || "حدث خطأ أثناء التحقق من الدفع");
                router.push("/");
            }
        };

        verifyPayment();
    }, [success, id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
            <div className="text-center">
                {/* أنيميشن لطيف أثناء التحقق */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-sky-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-sky-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">جاري تأكيد عملية الشراء</h2>
                <p className="text-gray-500 text-sm font-medium">يرجى عدم إغلاق الصفحة، نقوم بمعالجة طلبك الآن...</p>
            </div>
        </div>
    );
};

export default PaymentStatus;