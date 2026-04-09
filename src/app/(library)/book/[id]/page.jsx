"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowRight, Download, Heart, ShoppingCart, Star,
    CreditCard, Smartphone, CheckCircle, Info, Lock, X
} from "lucide-react";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import Image from "next/image";

// الإضافات الجديدة لـ Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/app/(library)/components/CheckoutForm";

// حطي مفتاح العميل هنا
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BookDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const { addToCart } = useCartStore();
const [redirectionUrl, setRedirectionUrl] = useState("");
    const [paymentModal, setPaymentModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentProvider, setPaymentProvider] = useState("paymob");
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(""); // لتخزين سر Stripe

    // 1. جلب بيانات الكتاب
    const { data: book, isLoading, error, refetch } = useQuery({
        queryKey: ["book", id],
        queryFn: async () => {
            const response = await api.get(`/files/${id}`);
            return response.data.data || response.data;
        },
        enabled: Boolean(id),
    });

    // 2. دالة التحميل
    const handleDownload = async () => {
        try {
            setProcessing(true);
            const response = await api.get(`/files/${id}/download-link`);
            // التأكد من جلب الرابط حسب هيكلة رد السيرفر
            const downloadUrl = response.data.data.url || response.data.data;
            window.open(downloadUrl, "_blank");
            toast.success("تم بدء التحميل!");
        } catch (err) {
            toast.error(err.response?.data?.message || "فشل الحصول على رابط التحميل");
        } finally {
            setProcessing(false);
        }
    };

    // 3. دالة بدء عملية الدفع المتطورة
    const startPayment = async () => {
        if (paymentProvider === 'paymob' && !phoneNumber) {
            return toast.error("يرجى إدخال رقم الهاتف للمحفظة");
        }

        const paymentData = {
            bookId: id,
            provider: paymentProvider,
            currency: 'EGP',
        };

        if (paymentProvider === 'paymob') {
            paymentData.phone = phoneNumber;
        }

        try {
            setProcessing(true);
            const { data } = await api.post('/payments/create-intent', paymentData);

            if (paymentProvider === 'paymob' && data.data.paymentLink) {
                // تحويل لـ Paymob
                window.location.assign(data.data.paymentLink);
            } 
            else if (paymentProvider === 'stripe' && data.data.clientSecret) {
                // تفعيل فورم Stripe وتخزين رابط الرجوع المستلم من السيرفر
                setClientSecret(data.data.clientSecret);
                setRedirectionUrl(data.data.redirectionUrl);
            }
        } catch (err) {
            console.error("Payment Initiation Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || err.message || "فشل في بدء عملية الدفع");
        } finally {
            setProcessing(false);
        }
    };

    const handleAction = () => {
        if (!isAuthenticated) {
            toast.info("يرجى تسجيل الدخول أولاً");
            return router.push("/login");
        }
        // تعديل: لو الكتاب مجاني أو تم شراؤه مسبقاً، حمل فوراً
        if (book.price === 0 || book.isPurchased) {
            handleDownload();
        } else {
            setPaymentModal(true);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info("يرجى تسجيل الدخول أولاً");
            return router.push("/login");
        }
        try {
            await addToCart(id);
            toast.success("تمت الإضافة للسلة بنجاح");
        } catch (err) {
            toast.error(err.response?.data?.message || "فشل إضافة المنتج للسلة");
        }
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            toast.info("سجّل الدخول لإضافة المفضلة");
            return router.push("/login");
        }
        isFavorite(id) ? await removeFromFavorites(id) : await addToFavorites(id);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[50vh] mt-10">
            <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-900 rounded-full animate-spin"></div>
        </div>
    );
    if (!book || error) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <Info size={64} className="text-gray-300 mb-4" />
            <h1 className="text-xl font-bold text-gray-800">عذراً، لم يتم العثور على الكتاب</h1>
            <button onClick={() => router.back()} className="mt-4 text-sky-900 border-b border-sky-900">العودة للخلف</button>
        </div>
    );

    // متغير لتحديد هل الكتاب يحتاج شراء أم هو متاح للتحميل
    const isPaidAndNotOwned = book.price > 0 && !book.isPurchased;

    return (
        <div className="bg-white min-h-screen pb-20" dir="rtl">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-[200] p-3 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-center relative">
                    <button
                        onClick={() => router.back()}
                        className="absolute right-0 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-gray-900 font-bold text-base truncate max-w-[200px] text-center">
                        تفاصيل الإصدار
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-100">
                        <Image src={book.coverUrl || book.cover || "/placeholder.jpg"} alt={book.title} fill priority className="object-cover" />
                        {book.isPurchased && (
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
                                مـمـلوك
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-[9px] font-bold uppercase">
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md">{book.category?.name || "عام"}</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md">{book.productType?.name || "كتاب"}</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-950 mb-3 leading-tight">{book.title}</h2>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                           <span className={`text-3xl font-black ${isPaidAndNotOwned ? 'text-sky-900' : 'text-emerald-600'}`}>
    {!isPaidAndNotOwned 
        ? (book.isPurchased ? "أنت تمتلكه" : "مـجـانـي") 
        : ((book.isOnSale ? book.discountPrice : book.price) / 100).toLocaleString()
    }
</span>
                            {isPaidAndNotOwned && <span className="text-sky-900 font-bold text-xs">جنيه مصري</span>}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                        <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2 text-[11px] uppercase"><Info size={12} /> نبذة</h3>
                        <p className="text-gray-600 leading-relaxed text-xs md:text-sm">{book.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleAction}
                            disabled={processing}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${processing ? "bg-gray-300" : isPaidAndNotOwned ? "bg-sky-900 text-white" : "bg-emerald-600 text-white"}`}
                        >
                            {processing ? <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div> :
                                <>
                                    {isPaidAndNotOwned ? <ShoppingCart size={18} /> : <Download size={18} />} 
                                    {isPaidAndNotOwned ? "شراء الآن" : "تحميل الكتاب"}
                                </>
                            }
                        </button>

                        <button 
                            onClick={handleAddToCart} 
                            disabled={book.isPurchased}
                            className={`font-bold py-3.5 rounded-xl border-2 text-sm transition-all ${book.isPurchased ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-sky-900 text-sky-900 hover:bg-sky-50"}`}
                        >
                            {book.isPurchased ? "في مكتبتك" : "أضف للسلة"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => { setPaymentModal(false); setClientSecret(""); }}></div>
                    <div className="relative bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 pb-10 animate-in zoom-in duration-300 custom-scrollbar">

                        {clientSecret && paymentProvider === 'stripe' ? (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold text-gray-950 mb-4 text-center">بيانات البطاقة</h2>
                                   <CheckoutForm 
    clientSecret={clientSecret} 
    redirectionUrl={redirectionUrl} // نمرر الرابط الجاهز بدلاً من الـ ID
/>
                                    <button onClick={() => setClientSecret("")} className="mt-6 text-gray-400 text-xs font-bold pb-4">رجوع للوسائل</button>
                                </div>
                            </Elements>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-sky-50 text-sky-900 rounded-xl flex items-center justify-center mb-4"><Lock size={24} /></div>
                                <h2 className="text-xl font-bold text-gray-950 mb-6">إتمام الدفع</h2>

                                <div className="w-full space-y-2 mb-6 text-right">
                                    <button onClick={() => setPaymentProvider("paymob")} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'paymob' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3"><Smartphone size={18} /><span className="font-bold text-xs">محفظة إلكترونية</span></div>
                                        {paymentProvider === 'paymob' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                    </button>
                                    <button onClick={() => setPaymentProvider("stripe")} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'stripe' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3"><CreditCard size={18} /><span className="font-bold text-xs">بطاقة بنكية</span></div>
                                        {paymentProvider === 'stripe' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                    </button>
                                </div>

                                {paymentProvider === 'paymob' && (
                                    <div className="w-full mb-6 text-right">
                                        <input type="tel" placeholder="رقم المحفظة (01xxxxxxxxx)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-center font-bold outline-none focus:ring-1 focus:ring-sky-900" />
                                    </div>
                                )}

                                <button onClick={startPayment} disabled={processing} className="w-full py-3.5 bg-sky-900 text-white rounded-xl font-bold hover:bg-sky-800 disabled:bg-gray-300 transition-all">
                                    {processing ? "جاري المعالجة..." : "تأكيد ودفع"}
                                </button>
                                <button onClick={() => setPaymentModal(false)} className="mt-4 text-gray-400 font-bold text-xs">إلغاء</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;