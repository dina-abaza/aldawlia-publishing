"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowRight, ArrowLeft, Download, Heart, ShoppingCart,
    CreditCard, Smartphone, CheckCircle, Info, Lock, X
} from "lucide-react";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import Image from "next/image";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/app/(library)/components/CheckoutForm";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BookDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const { addToCart } = useCartStore();
    const [redirectionUrl, setRedirectionUrl] = useState("");
    const [paymentModal, setPaymentModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentProvider, setPaymentProvider] = useState("paymob");
    const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'wallet'
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const isArabic = i18n.language?.startsWith("ar");
    const dir = isArabic ? "rtl" : "ltr";

    const { data: book, isLoading, error } = useQuery({
        queryKey: ["book", id],
        queryFn: async () => {
            const response = await api.get(`/files/${id}`);
            return response.data.data || response.data;
        },
        enabled: Boolean(id),
    });

    const handleDownload = async () => {
        try {
            setProcessing(true);
            const response = await api.get(`/files/${id}/download-link`);
            const downloadUrl = response.data.data.url || response.data.data;
            window.open(downloadUrl, "_blank");
            toast.success(t("book_page.download_started"));
        } catch (err) {
            toast.error(err.response?.data?.message || t("book_page.download_link_failed"));
        } finally {
            setProcessing(false);
        }
    };

    const startPayment = async () => {
        if (paymentProvider === 'paymob' && paymentMethod === 'wallet' && !phoneNumber) {
            return toast.error(t("book_page.enter_wallet_phone"));
        }

        const paymentData = {
            bookId: id,
            provider: paymentProvider,
            currency: 'EGP',
            paymentMethod: paymentProvider === 'paymob' ? paymentMethod : 'card'
        };

        if (paymentProvider === 'paymob' && paymentMethod === 'wallet') {
            paymentData.phone = phoneNumber;
        }

        try {
            setProcessing(true);
            const { data } = await api.post('/payments/create-intent', paymentData);

            if (paymentProvider === 'paymob' && data.data.paymentLink) {
                window.location.assign(data.data.paymentLink);
            } 
            else if (paymentProvider === 'stripe' && data.data.clientSecret) {
                setClientSecret(data.data.clientSecret);
                setRedirectionUrl(data.data.redirectionUrl);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || t("book_page.payment_start_failed"));
        } finally {
            setProcessing(false);
        }
    };

    const handleAction = () => {
        if (!isAuthenticated) {
            toast.info(t("book_page.login_first"));
            return router.push("/login");
        }
        if (book.price === 0 || book.isPurchased) {
            handleDownload();
        } else {
            setPaymentModal(true);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info(t("book_page.login_first"));
            return router.push("/login");
        }
        try {
            await addToCart(id);
        } catch (err) {
            toast.error(err.response?.data?.message || t("book_page.add_to_cart_failed"));
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[50vh] mt-10">
            <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-900 rounded-full animate-spin"></div>
        </div>
    );

    if (!book || error) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <Info size={64} className="text-gray-300 mb-4" />
            <h1 className="text-xl font-bold text-gray-800">{t("book_page.not_found")}</h1>
            <button onClick={() => router.back()} className="mt-4 text-sky-900 border-b border-sky-900">{t("book_page.go_back")}</button>
        </div>
    );

    const isPaidAndNotOwned = book.price > 0 && !book.isPurchased;

    return (
        <div className={`bg-white min-h-screen pb-20 ${isArabic ? "text-right" : "text-left"}`} dir={dir}>
            <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-[200] p-3 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-center relative">
                    <button
                        onClick={() => router.back()}
                        className={`absolute text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all ${isArabic ? "right-0" : "left-0"}`}
                    >
                        {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    </button>
                    <h1 className="text-gray-900 font-bold text-base truncate max-w-[200px] text-center">
                        {t("book_page.details_title")}
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-col md:flex-row gap-12">
                <div className="md:w-5/12 flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100 transition-transform hover:scale-[1.02] duration-500">
                        <Image src={book.coverUrl || book.cover || "/placeholder.jpg"} alt={book.title} fill priority sizes="320px" className="object-cover" />
                        {book.isPurchased && (
                            <div className="absolute top-6 right-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                                {t("book_page.owned")}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:w-7/12 flex flex-col">
                    <div className="flex items-center gap-3 mb-5 text-[11px] font-bold uppercase tracking-wider">
                        <span className="px-3 py-1 bg-sky-50 text-sky-800 rounded-lg border border-sky-100/50">{book.category?.name || t("book_page.general")}</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/50">{book.productType?.name || t("book_page.book")}</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-gray-950 mb-5 leading-[1.2] tracking-tight">{book.title}</h2>

                    <div className="mb-8">
                        <div className="flex items-baseline gap-2">
                           <span className={`text-4xl md:text-5xl font-black ${isPaidAndNotOwned ? 'text-sky-900' : 'text-emerald-600'}`}>
                                {!isPaidAndNotOwned 
                                    ? (book.isPurchased ? t("book_page.you_own_it") : t("book_page.free")) 
                                    : (book.isOnSale ? book.discountPrice : book.price).toLocaleString()
                                }
                            </span>
                            {isPaidAndNotOwned && <span className="text-sky-900 font-black text-sm md:text-base">{t("book_page.currency_full")}</span>}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-gray-50/50 rounded-[2rem] mb-8 border border-gray-100 shadow-sm">
                        <h3 className="font-black text-sky-900 mb-4 flex items-center gap-2 text-sm md:text-base uppercase tracking-wide">
                            <Info size={18} className="text-sky-600" /> {t("book_page.summary")}
                        </h3>
                        <p className="text-gray-700 leading-[1.8] text-base md:text-lg font-medium whitespace-pre-line">
                            {book.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleAction}
                            disabled={processing}
                            className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-lg active:scale-95 ${processing ? "bg-gray-300" : isPaidAndNotOwned ? "bg-sky-900 text-white hover:bg-sky-950" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                        >
                            {processing ? <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full"></div> :
                                <>
                                    {isPaidAndNotOwned ? <ShoppingCart size={22} /> : <Download size={22} />} 
                                    {isPaidAndNotOwned ? t("book_page.buy_now") : t("book_page.download_book")}
                                </>
                            }
                        </button>

                        <button 
                            onClick={handleAddToCart} 
                            disabled={book.isPurchased}
                            className={`font-black py-4 md:py-5 rounded-2xl border-2 text-base md:text-lg transition-all ${book.isPurchased ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-sky-900 text-sky-900 hover:bg-sky-50 active:bg-sky-100"}`}
                        >
                            {book.isPurchased ? t("book_page.in_your_library") : t("book_page.add_to_cart")}
                        </button>
                    </div>
                </div>
            </div>

            {paymentModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => { setPaymentModal(false); setClientSecret(""); }}></div>
                    <div className="relative bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 pb-10 animate-in zoom-in duration-300">

                        {clientSecret && paymentProvider === 'stripe' ? (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold text-gray-950 mb-4 text-center">{t("book_page.card_details")}</h2>
                                   <CheckoutForm clientSecret={clientSecret} redirectionUrl={redirectionUrl} />
                                    <button onClick={() => setClientSecret("")} className="mt-6 text-gray-400 text-xs font-bold pb-4">{t("book_page.back_to_methods")}</button>
                                </div>
                            </Elements>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-sky-50 text-sky-900 rounded-xl flex items-center justify-center mb-4"><Lock size={24} /></div>
                                <h2 className="text-xl font-bold text-gray-950 mb-6">{t("book_page.complete_payment")}</h2>

                                <div className="w-full space-y-2 mb-6 text-right">
                                    <button onClick={() => { setPaymentProvider("paymob"); setPaymentMethod("wallet"); }} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'paymob' && paymentMethod === 'wallet' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3"><Smartphone size={18} /><span className="font-bold text-xs">{t("book_page.wallet_option")}</span></div>
                                        {paymentProvider === 'paymob' && paymentMethod === 'wallet' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                    </button>
                                    <button onClick={() => { setPaymentProvider("paymob"); setPaymentMethod("card"); }} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'paymob' && paymentMethod === 'card' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3"><CreditCard size={18} /><span className="font-bold text-xs">{t("book_page.paymob_card_option")}</span></div>
                                        {paymentProvider === 'paymob' && paymentMethod === 'card' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                    </button>
                                    <button onClick={() => { setPaymentProvider("stripe"); setPaymentMethod("card"); }} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'stripe' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3"><CreditCard size={18} /><span className="font-bold text-xs">{t("book_page.stripe_card_option")}</span></div>
                                        {paymentProvider === 'stripe' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                    </button>
                                </div>

                                {paymentProvider === 'paymob' && paymentMethod === 'wallet' && (
                                    <div className="w-full mb-6 text-right">
                                        <input type="tel" placeholder={t("book_page.wallet_phone_placeholder")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-center font-bold outline-none" />
                                    </div>
                                )}

                                <button onClick={startPayment} disabled={processing} className="w-full py-3.5 bg-sky-900 text-white rounded-xl font-bold hover:bg-sky-800 disabled:bg-gray-300 transition-all">
                                    {processing ? t("book_page.processing") : t("book_page.confirm_pay")}
                                </button>
                                <button onClick={() => setPaymentModal(false)} className="mt-4 text-gray-400 font-bold text-xs">{t("book_page.cancel")}</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;