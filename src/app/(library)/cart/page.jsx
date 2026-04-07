"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import { useCartStore } from "@/app/(library)/store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/app/api";

const CartPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, loading, fetchCart, removeFromCart, emptyCart } = useCartStore();
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [provider, setProvider] = useState("stripe");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  // حساب المجموع الكلي
  const totalPrice = cart?.totalPrice ? cart.totalPrice / 100 : (cart?.items || []).reduce(
    (acc, item) => acc + ((item.priceAtAdd || item.productId?.price || 0) * (item.qty || 1)),
    0
  ) / 100;

const handleCheckout = async () => {
  if (!cart?.items || cart.items.length === 0) {
    return toast.error("سلتك فارغة ولا يمكن إتمام الشراء");
  }

  if (provider === "paymob" && !phone) {
    return toast.error("يرجى إدخال رقم الهاتف لإتمام الدفع عبر Paymob");
  }

  setCheckoutLoading(true);
  try {
    // نأخذ أول عنصر في السلة كمثال، أو يمكن تعديل المنطق ليشمل كل العناصر
    const firstItem = cart.items[0];
    const response = await api.post('/payments/create-intent', {
      bookId: firstItem.productId?._id || firstItem.fileId,
      quantity: firstItem.qty || 1,
      provider: provider,
      ...(provider === "paymob" && { phone: phone })
    });
    
    const paymentData = response.data.data;
    
    if (paymentData.provider === "paymob") {
      toast.info("جاري توجيهك لصفحة الدفع...");
      window.location.assign(paymentData.paymentLink);
    } else {
      const clientSecret = paymentData.clientSecret;
      toast.info("تم البدء، يرجى استكمال عملية الدفع...");
      console.log("Stripe Client Secret:", clientSecret);
      // ملاحظة: يجب إضافة Stripe Elements هنا لاحقاً
    }
  } catch (error) {
    console.error("خطأ في بدء الدفع:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "فشل بدء عملية الدفع. حاول لاحقاً");
  } finally {
    setCheckoutLoading(false);
  }
};

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <ShoppingBasket size={80} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-600">سجل دخولك لمتابعة التسوق</h2>
      <Link href="/login" className="bg-amber-600 text-white px-10 py-3 rounded-3xl font-bold shadow-lg mt-4 hover:bg-sky-900 transition-colors">تسجيل الدخول</Link>
    </div>
  );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-32 relative" dir="rtl">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button 
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }} 
            className="text-sky-900 absolute right-0 p-4 hover:text-amber-600 transition-all active:scale-95 z-50 cursor-pointer"
          >
            <ArrowRight size={28} />
          </button>
          <h1 className="text-sky-900 font-extrabold text-xl">سلة المشتريات</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-6">
            <ShoppingBasket size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">سلتك فارغة حالياً</p>
            <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold mt-6 inline-block hover:bg-sky-900 transition-colors">تصفح الأقسام</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.items.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                  <img src={item.productId?.image || "/placeholder.png"} className="max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{item.productId?.name || "اسم غير متوفر"}</h3>
                  <p className="text-amber-600 font-black text-sm">{((item.priceAtAdd || item.productId?.price) / 100)?.toLocaleString() || 0} د.ع</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <span className="font-bold text-gray-700">الكمية:</span>
                      <span className="font-black">{item.qty || 1}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.fileId || item._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 bg-white rounded-3xl p-6 shadow-xl border border-sky-50">
              <div className="flex justify-between items-center mb-6 pt-3">
                <span className="text-gray-800 font-extrabold text-lg">المبلغ الإجمالي:</span>
                <span className="text-2xl font-black text-amber-600">{totalPrice?.toLocaleString()} د.ع</span>
              </div>

              <div className="mb-6 border-t border-gray-100 pt-4">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">طريقة الدفع</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="stripe" checked={provider === "stripe"} onChange={(e) => setProvider(e.target.value)} className="accent-sky-900" />
                    <span className="font-bold text-sm">بطاقة ائتمانية</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="paymob" checked={provider === "paymob"} onChange={(e) => setProvider(e.target.value)} className="accent-sky-900" />
                    <span className="font-bold text-sm">المحافظ الإلكترونية</span>
                  </label>
                </div>
                
                {provider === "paymob" && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 mb-2">رقم الهاتف (مطلوب لـ Paymob)</label>
                    <input 
                      type="text" 
                      placeholder="أدخل رقم هاتفك" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-600 outline-none"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className={`w-full bg-sky-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-sky-800 transition-colors ${checkoutLoading ? 'opacity-50' : ''}`}
              >
                <CreditCard size={24} />
                {checkoutLoading ? "جاري البدء..." : "إتمام الشراء الآن"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
