"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { Trash2, ShoppingBasket, ArrowRight, CreditCard, Lock, Smartphone, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/api";

// إضافات Stripe زي التفاصيل
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/app/(library)/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CartPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  // أضفنا loading هنا من الستور
  const { cart, fetchCart, removeFromCart, loading } = useCartStore();

  const [paymentModal, setPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [redirectionUrl, setRedirectionUrl] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const totalPrice = cart?.total || 0;

  const handleStartPayment = async () => {
    if (!cart?.items || cart.items.length === 0) {
      return toast.error("سلتك فارغة");
    }

    if (paymentProvider === 'paymob' && !phoneNumber) {
      return toast.error("يرجى إدخال رقم الهاتف للمحفظة");
    }

    const firstItem = cart.items[0];
    const firstBookId = firstItem.file?._id || firstItem.file?.id;

    if (!firstBookId) {
      return toast.error("بيانات الكتاب غير مكتملة في السلة");
    }

    const paymentData = {
      bookId: firstBookId, 
      provider: paymentProvider,
      currency: 'EGP',
    };

    if (paymentProvider === 'paymob') paymentData.phone = phoneNumber;

    try {
      setProcessing(true);
      const { data } = await api.post('/payments/create-intent', paymentData);

      if (paymentProvider === 'paymob' && data.data.paymentLink) {
        window.location.assign(data.data.paymentLink);
      } else if (paymentProvider === 'stripe' && data.data.clientSecret) {
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

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <ShoppingBasket size={80} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-600">سجل دخولك لمتابعة التسوق</h2>
      <button onClick={() => router.push("/login")} className="bg-amber-600 text-white px-10 py-3 rounded-3xl font-bold mt-4">تسجيل الدخول</button>
    </div>
  );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-32 relative" dir="rtl">
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button onClick={() => router.back()} className="text-sky-900 absolute right-0 p-4"><ArrowRight size={28} /></button>
          <h1 className="text-sky-900 font-extrabold text-xl">سلة المشتريات</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {/* التعديل هنا: لو بيحمل يعرض لودينج، لو خلص والأيتمز صفر يعرض سلة فارغة */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-sky-900 font-bold animate-pulse">جاري تحميل سلتك...</p>
          </div>
        ) : !cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
             <ShoppingBasket size={40} className="text-gray-200 mx-auto mb-4" />
             <p className="text-gray-500 font-bold">سلتك فارغة</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.items.map((item, idx) => (
                <div key={item.file?._id || item.file?.id || idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={item.file?.coverUrl} className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-1" alt="cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">{item.file?.title}</h3>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-amber-600 font-black text-sm">
                          {((item.file?.isOnSale && item.file?.discountPrice) ? item.file.discountPrice : item.file?.price) / 100} ج.م
                        </p>
                        {item.file?.isOnSale && (
                          <span className="text-gray-400 line-through text-[10px]">
                            {(item.file?.price / 100).toLocaleString()} ج.م
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.file?._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white rounded-[2.5rem] p-6 shadow-xl border border-sky-50 text-center">
              <p className="text-gray-400 font-bold mb-1">المبلغ الإجمالي</p>
              <h2 className="text-3xl font-black text-sky-900 mb-6">{(totalPrice / 100).toLocaleString()} ج.م</h2>
              
              <button
                onClick={() => setPaymentModal(true)}
                className="w-full bg-sky-900 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
              >
                <CreditCard size={24} /> إتمام الشراء الآن
              </button>
            </div>
          </>
        )}
      </div>

      {paymentModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => { setPaymentModal(false); setClientSecret(""); }}></div>
          <div className="relative bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6">
            
            {clientSecret && paymentProvider === 'stripe' ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-gray-950 mb-4 text-center">بيانات البطاقة</h2>
                  <CheckoutForm clientSecret={clientSecret} redirectionUrl={redirectionUrl} />
                  <button onClick={() => { setClientSecret(""); setRedirectionUrl(""); }} className="mt-6 text-gray-400 text-xs font-bold">رجوع</button>
                </div>
              </Elements>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-sky-50 text-sky-900 rounded-xl flex items-center justify-center mb-4"><Lock size={24}/></div>
                <h2 className="text-xl font-bold text-gray-950 mb-6">إتمام الدفع</h2>

                <div className="w-full space-y-2 mb-6">
                  <button onClick={() => setPaymentProvider("paymob")} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'paymob' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3"><Smartphone size={18}/><span className="font-bold text-xs">محفظة إلكترونية</span></div>
                    {paymentProvider === 'paymob' && <CheckCircle className="text-sky-900" size={16} fill="currentColor"/>}
                  </button>
                  <button onClick={() => setPaymentProvider("stripe")} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentProvider === 'stripe' ? 'border-sky-900 bg-sky-50' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3"><CreditCard size={18}/><span className="font-bold text-xs">بطاقة بنكية</span></div>
                    {paymentProvider === 'stripe' && <CheckCircle className="text-sky-900" size={16} fill="currentColor"/>}
                  </button>
                </div>

                {paymentProvider === 'paymob' && (
                  <input type="tel" placeholder="رقم المحفظة" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl mb-4 text-center outline-none focus:ring-1 focus:ring-sky-900"/>
                )}

                <button onClick={handleStartPayment} disabled={processing} className="w-full py-4 bg-sky-900 text-white rounded-xl font-bold">
                  {processing ? "جاري المعالجة..." : "تأكيد ودفع"}
                </button>
                <button onClick={() => setPaymentModal(false)} className="mt-4 text-gray-400 text-xs">إلغاء</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;