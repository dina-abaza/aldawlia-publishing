"use client";
import dynamic from 'next/dynamic';
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// استخدمت اسم مختلف هنا (GoogleProvider) عشان ميعملش Conflict مع الاسم اللي تحت
const GoogleProvider = dynamic(
  () => import('@react-oauth/google').then(mod => mod.GoogleOAuthProvider),
  { ssr: false }
);

import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import PageLoader from "@/app/loading";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Providers({ children }) {
  const loading = useAuthStore((state) => state.loading);

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
    <GoogleProvider clientId={clientId}>
      {childrenWithLoaders}
    </GoogleProvider>
  );
}