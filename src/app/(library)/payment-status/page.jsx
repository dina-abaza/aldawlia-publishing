"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { toast } from "react-toastify";

const PaymentStatus = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId"); // أو transactionId حسب سترايب

    useEffect(() => {
        if (success === "true") {
            toast.success("تمت عملية الشراء بنجاح!");
            // ممكن هنا تنادي GET /payments/:transactionId عشان تظهري بيانات الكتاب
            router.push("/my-purchases"); // يروح للمكتبة بتاعته
        } else {
            toast.error("فشلت عملية الدفع");
            router.push("/");
        }
    }, [success, orderId]);

    return <div>جاري التحقق من حالة الدفع...</div>;
};

export default PaymentStatus;