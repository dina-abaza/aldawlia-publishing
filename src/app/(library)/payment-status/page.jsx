"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/api";
import { CheckCircle, Download, BookOpen, ArrowLeft, Loader2, Sparkles, X } from "lucide-react";
import Link from "next/link";

const PaymentStatus = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasCalledApi = useRef(false);
    
    const [status, setStatus] = useState("verifying"); 
    const [paymentData, setPaymentData] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 دقائق افتراضية

    // عداد تنازلي للرابط
    useEffect(() => {
        let timer;
        if (status === "success" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const successParam = searchParams.get("success");
    const orderId = searchParams.get("orderId"); 
    const transactionId = searchParams.get("transactionId");
    const stripePaymentIntent = searchParams.get("payment_intent");
    const stripeStatus = searchParams.get("redirect_status");

    const isUrlSuccess = successParam === "true" || stripeStatus === "succeeded";
    const id = orderId || transactionId || stripePaymentIntent;

    useEffect(() => {
        if (!isUrlSuccess || !id) {
            if (successParam === "false" || stripeStatus === "failed") {
                toast.error("فشلت عملية الدفع، يرجى المحاولة مرة أخرى");
            }
            setStatus("failed");
            return;
        }

        const verifyPayment = async (retryCount = 0) => {
            if (hasCalledApi.current && retryCount === 0) return;
            if (retryCount === 0) hasCalledApi.current = true;

            try {
                const { data } = await api.get(`/payments/${id}`);
                const payment = data.data || data;
                const pStatus = payment.status;

                setPaymentData(payment);

                if (pStatus === "pending" && retryCount < 4) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return verifyPayment(retryCount + 1);
                }

                if (pStatus === "succeeded") {
                    setStatus("success");
                    toast.success("مبروك! تم تأكيد الشراء بنجاح.");
                    
                    // حساب الوقت المتبقي من بيانات السيرفر (إذا وجدت)
                    if (payment.downloadExpiry && payment.serverTime) {
                        const expiry = new Date(payment.downloadExpiry).getTime();
                        const now = new Date(payment.serverTime).getTime();
                        const secondsLeft = Math.max(0, (expiry - now) / 1000);
                        setTimeLeft(secondsLeft);
                    }
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                console.error("Verification Error:", err);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [isUrlSuccess, id]);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            // البحث عن المعرف في كل مكان ممكن (id أو _id)
            const bookId = paymentData?.book?.id || paymentData?.book?._id || paymentData?.bookId;
            
            if (!bookId) {
                console.error("Book ID missing in paymentData:", paymentData);
                return toast.error("عذراً، لم نتمكن من تحديد هوية الكتاب، يرجى المحاولة من 'مكتبتي'");
            }

            const { data } = await api.get(`/files/${bookId}/download-link`);
            const info = data.data;
            if (info.url) {
                // مزامنة الوقت فوراً من السيرفر
                const expiry = new Date(info.expiresAt).getTime();
                const now = new Date(info.serverTime).getTime();
                const secondsLeft = Math.max(0, (expiry - now) / 1000);
                setTimeLeft(secondsLeft);
                
                window.open(info.url, '_blank');
                toast.success("بدأ التحميل الآن...");
            }
        } catch (err) {
            toast.error("فشل الحصول على رابط التحميل، يرجى المحاولة من 'مكتبتي'");
        } finally {
            setDownloading(false);
        }
    };

    if (status === "verifying") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-sky-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-sky-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">جاري تأكيد عملية الشراء</h2>
                    <p className="text-gray-500 text-sm font-medium animate-pulse">يرجى عدم إغلاق الصفحة، نقوم بمعالجة طلبك الآن...</p>
                </div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6" dir="rtl">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center border border-red-50">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <X size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-4">لم يكتمل الدفع</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">عذراً، لم نتمكن من تأكيد عملية الدفع. إذا تم خصم المبلغ، يرجى التواصل مع الدعم الفني.</p>
                    <button onClick={() => router.push("/")} className="w-full bg-sky-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <ArrowLeft size={20} /> العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-amber-100/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-sky-100/30 rounded-full blur-3xl"></div>

            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-50 relative z-10">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-[2rem] animate-ping opacity-10"></div>
                    <CheckCircle size={50} />
                </div>

                <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm mb-2">
                    <Sparkles size={16} /> تهانيناً، الكتاب متاح الآن لك
                </div>
                <h2 className="text-3xl font-black text-sky-950 mb-3 uppercase tracking-tight">تم الدفع بنجاح!</h2>
                <p className="text-gray-500 mb-10 text-sm leading-relaxed">
                    شكراً لثقتك بنا. لقد تمت إضافة <span className="text-sky-900 font-bold">"{paymentData?.book?.title || "الكتاب"}"</span> إلى مكتبتك الخاصة. يمكنك البدء في قراءته الآن.
                </p>

                <div className="space-y-4">
                    {timeLeft > 0 ? (
                        <>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex items-center gap-3 text-right">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 font-black shadow-sm shrink-0">
                                    {formatTime(timeLeft)}
                                </div>
                                <p className="text-[11px] text-amber-800 font-bold leading-tight">
                                    هذا الرابط مؤقت وسينتهي صلاحيته خلال 5 دقائق للأمان. يرجى التحميل الآن.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleDownload}
                                disabled={downloading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {downloading ? <Loader2 className="animate-spin" /> : <Download size={22} />}
                                تحميل الكتاب الآن (PDF)
                            </button>
                        </>
                    ) : (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                            <p className="text-red-800 font-bold mb-2">انتهت صلاحية الرابط المؤقت</p>
                            <p className="text-xs text-red-600 mb-4 italic">يمكنك دائماً إعادة توليد رابط جديد من صفحة "مشترياتي"</p>
                        </div>
                    )}

                    <Link 
                        href="/my-purchases"
                        className="w-full bg-sky-50 text-sky-900 py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-sky-100 transition-all active:scale-95"
                    >
                        <BookOpen size={22} /> الذهاب إلى مكتبتي
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 font-medium">
                        رقم العملية: <span className="select-all">{id}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;