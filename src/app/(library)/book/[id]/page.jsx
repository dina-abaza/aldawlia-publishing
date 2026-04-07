"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Activity from "@/app/loading";
import { ArrowRight, Download, Heart, ShoppingCart, Star, CreditCard, Smartphone, CheckCircle, Info, Lock } from "lucide-react";
import { useFavoritesStore } from "@/app/(library)/store/useFavoritesStore";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import Image from "next/image";

const BookDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const { addToCart } = useCartStore();

    const [paymentModal, setPaymentModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentProvider, setPaymentProvider] = useState("paymob");
    const [processing, setProcessing] = useState(false);

    const { data: book, isLoading, error } = useQuery({
        queryKey: ["book", id],
        queryFn: async () => {
            const response = await api.get(`/files/${id}`);
            return response.data.data || response.data;
        },
        enabled: Boolean(id),
    });

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/600x800?text=Aldawlia";
        if (path.startsWith('http')) return path;
        return `https://e-library-api-production.up.railway.app${path}`;
    };

    const handleAction = async () => {
        if (!isAuthenticated) {
            toast.info("يرجى تسجيل الدخول أولاً");
            return router.push("/login");
        }

        if (!book?.price || book.price === 0) {
            try {
                setProcessing(true);
                const response = await api.get(`/files/${id}/download-link`);
                window.open(response.data.data.url, "_blank");
                toast.success("تم بدء التحميل!");
            } catch (err) {
                toast.error(err.response?.data?.message || "فشل الحصول على رابط التحميل");
            } finally {
                setProcessing(false);
            }
        } else {
            setPaymentModal(true);
        }
    };

    const handleAddToCart = async () => {
        try {
            // تأكدي أن الـ Store يستقبل الـ id بشكل صحيح
            await addToCart(book);
            toast.success("تمت الإضافة للسلة");
        } catch (err) {
            toast.error("فشل إضافة المنتج للسلة");
        }
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            toast.info("سجّل الدخول لإضافة المفضلة");
            return router.push("/login");
        }

        if (isFavorite(id)) {
            await removeFromFavorites(id);
        } else {
            await addToFavorites(id);
        }
    };

    if (isLoading) return <Activity />;
    if (!book || error) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <Info size={64} className="text-gray-300 mb-4" />
            <h1 className="text-xl font-bold text-gray-800">عذراً، لم يتم العثور على الكتاب</h1>
            <button onClick={() => router.back()} className="mt-4 text-sky-900 border-b border-sky-900">العودة للخلف</button>
        </div>
    );

    const isPaid = book.price > 0;

    return (
        <div className="bg-white min-h-screen pb-20" dir="rtl">
            {/* Header */}
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-[9999] p-3 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() => {
                            console.log("clicked");
                            router.back();
                        }}
                        className="bg-gray-50 text-sky-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-sky-50 transition-all shadow-sm active:scale-95 cursor-pointer z-[9999]"
                    >
                        <ArrowRight size={20} />
                    </button>

                    <h1 className="text-gray-900 font-bold text-base truncate max-w-[200px] text-center flex-1">
                        تفاصيل الإصدار
                    </h1>

                    <button
                        onClick={toggleFavorite}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${isFavorite(id)
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-50 text-gray-400"
                            }`}
                    >
                        <Heart size={20} fill={isFavorite(id) ? "currentColor" : "none"} />
                    </button>

                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-100">
                        <Image
                            src={getImageUrl(book.cover || book.coverUrl)}
                            alt={book.title}
                            fill
                            priority
                            className="object-cover"
                        />
                        {book.isOnSale && (
                            <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full font-bold text-[10px] shadow-lg uppercase">خصم خاص</div>
                        )}
                    </div>
                </div>

                {/* Data Section */}
                <div className="md:w-1/2 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-800 text-[9px] font-bold uppercase rounded-md tracking-wider">{book.category?.name || "عام"}</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase rounded-md tracking-wider">{book.productType?.name || "كتاب"}</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-950 mb-3 leading-tight">{book.title}</h2>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-gray-400 font-bold text-[10px]">(4.9/5) مراجعات القراء</span>
                    </div>

                    <div className="mb-6">
                        {book.isOnSale ? (
                            <div className="flex flex-col">
                                <span className="text-gray-300 line-through font-bold text-sm">{(book.price / 100).toLocaleString()} ج.م</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-sky-900">{(book.discountPrice / 100).toLocaleString()}</span>
                                    <span className="text-sky-900 font-bold text-xs">جنيه مصري</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className={`text-3xl font-black ${isPaid ? 'text-sky-900' : 'text-emerald-600'}`}>
                                    {isPaid ? (book.price / 100).toLocaleString() : "مـجـانـي"}
                                </span>
                                {isPaid && <span className="text-sky-900 font-bold text-xs">جنيه مصري</span>}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                        <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider">
                            <Info size={12} /> نبذة عن الإصدار
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-medium text-xs md:text-sm">
                            {book.description || "هذا الكتاب يقدم رؤية عميقة وفريدة في مجاله."}
                        </p>
                    </div>

                    {/* Action Buttons - Smaller Size */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleAction}
                            disabled={processing}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${processing ? "bg-gray-300" : isPaid ? "bg-sky-900 text-white hover:bg-sky-800" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
                        >
                            {processing ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div>
                            ) : (
                                <>
                                    {isPaid ? <ShoppingCart size={18} /> : <Download size={18} />}
                                    {isPaid ? "شراء الآن" : "تحميل"}
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleAddToCart}
                            className="bg-white text-sky-900 font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all active:scale-95 border-2 border-sky-900 text-sm"
                        >
                            أضف للسلة
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => setPaymentModal(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-sky-50 text-sky-900 rounded-xl flex items-center justify-center mb-4">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-950 mb-1">إتمام الدفع</h2>
                            <p className="text-gray-500 font-medium text-xs mb-6">اختر وسيلة الدفع المناسبة</p>

                            <div className="w-full space-y-2 mb-6">
                                <button
                                    onClick={() => setPaymentProvider("paymob")}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentProvider === 'paymob' ? 'border-sky-900 bg-sky-50/50' : 'border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Smartphone size={18} className="text-sky-900" />
                                        <span className="font-bold text-xs text-gray-900">محفظة إلكترونية</span>
                                    </div>
                                    {paymentProvider === 'paymob' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                </button>

                                <button
                                    onClick={() => setPaymentProvider("stripe")}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentProvider === 'stripe' ? 'border-sky-900 bg-sky-50/50' : 'border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={18} className="text-sky-900" />
                                        <span className="font-bold text-xs text-gray-900">بطاقة بنكية</span>
                                    </div>
                                    {paymentProvider === 'stripe' && <CheckCircle className="text-sky-900" size={16} fill="currentColor" />}
                                </button>
                            </div>

                            {paymentProvider === 'paymob' && (
                                <div className="w-full mb-6 text-right">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 mr-1 uppercase">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        placeholder="01xxxxxxxxx"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-left font-bold text-sky-950 focus:ring-1 focus:ring-sky-900 outline-none text-sm"
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => {/* startPayment function */ }}
                                disabled={processing}
                                className="w-full py-3.5 bg-sky-900 text-white rounded-xl font-bold text-base hover:bg-sky-800 transition-all disabled:bg-gray-300"
                            >
                                {processing ? "جاري المعالجة..." : "تأكيد العملية"}
                            </button>

                            <button onClick={() => setPaymentModal(false)} className="mt-4 text-gray-400 font-bold text-xs hover:text-gray-600">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;