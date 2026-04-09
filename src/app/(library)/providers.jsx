"use client";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import PageLoader from "@/app/loading";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Providers({ children }) {
  const loading = useAuthStore((state) => state.loading);

  // تعليق checkAuth مؤقتاً لتجنب infinite loop
  // سيتم تفعيله بعد التأكد من اتصال الـ API
  useEffect(() => {
    const checkAuthAsync = async () => {
      try {
        await useAuthStore.getState().checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuthAsync();
  }, []);

  const childrenWithLoaders = (
    <>
      {children}

      {loading && (
        <div className="fixed top-20 bottom-0 left-0 right-0 flex items-center justify-center bg-white/70 z-50">
          <PageLoader />
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl
        pauseOnHover={false}
        theme="light"
      />
    </>
  );

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {childrenWithLoaders}
    </GoogleOAuthProvider>
  );
}
