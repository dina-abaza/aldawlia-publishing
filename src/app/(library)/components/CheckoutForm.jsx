"use client";
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// استلام clientSecret و redirectionUrl (الرابط اللي السيرفر بعته) كـ Props
const CheckoutForm = ({ clientSecret, redirectionUrl }) => { 
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    // تنفيذ عملية الدفع
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // هــــــــام: نستخدم الرابط المستلم من السيرفر مباشرة كما نصت الوثيقة
        // السيرفر سيعيد المستخدم لهذا الرابط تلقائياً بعد نجاح الدفع
        return_url: redirectionUrl, 
      },
    });

    // ملاحظة: لو الدفع نجح، Stripe هتعمل Redirect لوحدها للرابط اللي فوق
    // الكود اللي تحت ده هيشتغل بس في حالة وجود خطأ يمنع الـ Redirect
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* مكتبة سترايب هتحقن حقول البطاقة هنا */}
      <div className="mb-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-xs mt-2 text-right bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
          {errorMessage}
        </div>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full mt-6 bg-sky-900 text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:bg-sky-800 transition-all disabled:bg-gray-300 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>جاري معالجة الدفع...</span>
          </>
        ) : (
          "تأكيد عملية الشراء"
        )}
      </button>
      
      <p className="text-[10px] text-gray-400 text-center mt-4">
        تتم معالجة مدفوعاتك بأمان عبر تشفير Stripe العالمي
      </p>
    </form>
  );
};

export default CheckoutForm;