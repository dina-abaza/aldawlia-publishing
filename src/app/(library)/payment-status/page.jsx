"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PaymentStatus = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // بيموب بيبعت success، وسترايب إنتي حددتي له الـ return_url
    const success = searchParams.get("success");
    // بنحاول نجيب id الكتاب عشان نرجعه عليه، لو مش موجود نرجعه للرئيسية
    const bookId = searchParams.get("bookId"); 

    useEffect(() => {
        if (success === "true") {
            toast.success("تمت عملية الشراء بنجاح!");
            
            // التعديل الجوهري هنا:
            // لو معاكي id الكتاب، رجعيه لصفحة التفاصيل عشان يحمل
            if (bookId) {
                router.push(`/book-details/${bookId}`); 
            } else {
                router.push("/"); // لو مفيش id ارجعي للرئيسية
            }
        } else if (success === "false") {
            toast.error("فشلت عملية الدفع، يرجى المحاولة مرة أخرى");
            router.push("/");
        }
    }, [success, bookId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-sky-900 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="font-bold text-gray-600">جاري التحقق من حالة الدفع...</p>
            </div>
        </div>
    );
};

export default PaymentStatus;