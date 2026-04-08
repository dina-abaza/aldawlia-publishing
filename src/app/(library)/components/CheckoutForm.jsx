"use client";
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // العميل هيروح فين بعد ما يدفع بنجاح
        // اتأكدي إن الصفحة دي موجودة عندك (مثلاً /payment-status)
        return_url: `${window.location.origin}/payment-status`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />

      {errorMessage && (
        <div className="text-red-500 text-xs mt-2 text-center bg-red-50 p-2 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full mt-6 bg-sky-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-sky-800 transition-all disabled:bg-gray-300 disabled:shadow-none active:scale-95"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>جاري تأكيد الدفع...</span>
          </div>
        ) : (
          "تأكيد الدفع الآمن"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;