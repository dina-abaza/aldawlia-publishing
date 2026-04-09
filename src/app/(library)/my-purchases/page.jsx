"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, ShoppingCart, Download, Loader2, Clock, AlertCircle } from "lucide-react";
import api from "@/app/api";
import { useAuthStore } from "@/app/(library)/store/useAuthStore";
import PageLoader from "@/app/loading";

const MyPurchasesPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState({}); // { bookId: "url" }
  const [timers, setTimers] = useState({});             // { bookId: secondsLeft }
  const [fetchingLink, setFetchingLink] = useState({}); // { bookId: true/false }

  const totalPrice = purchases.reduce((sum, purchase) => sum + (Number(purchase.book?.price) || 0), 0);

  // تحديث العدادات كل ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
            next[id] -= 1;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleGetDownloadLink = async (bookId) => {
    if (!bookId) return;
    try {
      setFetchingLink((prev) => ({ ...prev, [bookId]: true }));
      const { data } = await api.get(`/files/${bookId}/download-link`);
      const info = data.data;
      
      if (info.url) {
        setDownloadLinks((prev) => ({ ...prev, [bookId]: info.url }));
        
        // حساب الوقت المتبقي بدقة بناءً على توقيت السيرفر
        const expiry = new Date(info.expiresAt).getTime();
        const now = new Date(info.serverTime).getTime();
        const secondsLeft = Math.max(0, (expiry - now) / 1000);
        
        setTimers((prev) => ({ ...prev, [bookId]: secondsLeft }));
        window.open(info.url, "_blank");
        
        // تحديث حالة المشتريات محلياً لتغيير شكل الزر
        setPurchases(prev => prev.map(p => {
          const pId = p.book?._id || p.bookId || p.book?.id;
          if (pId === bookId) return { ...p, isDownloaded: true, downloadExpiry: info.expiresAt };
          return p;
        }));
      }
    } catch (err) {
      console.error("Download Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "فشل الحصول على الرابط");
    } finally {
      setFetchingLink((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const res = await api.get("/payments/my-purchases");
        const data = res.data?.data || [];
        const serverTime = res.data.serverTime || new Date();
        
        // إعادة بناء العدادات لمن تم تحميلهم مسبقاً وما زال وقتهم فعالاً
        const initialTimers = {};
        data.forEach(p => {
          if (p.isDownloaded && p.downloadExpiry) {
            const expiry = new Date(p.downloadExpiry).getTime();
            const now = new Date(serverTime).getTime();
            const secondsLeft = Math.max(0, (expiry - now) / 1000);
            if (secondsLeft > 0) {
              const bookId = p.book?._id || p.bookId || p.book?.id;
              if (bookId) initialTimers[bookId] = secondsLeft;
            }
          }
        });
        
        setTimers(initialTimers);
        setPurchases(data);
      } catch (error) {
        console.error("[My Purchases] Failed to load:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center" dir="rtl">
        <BookOpen size={80} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-600">سجل دخولك لعرض مشترياتك</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          يمكنك عرض جميع الكتب التي اشتريتها بنجاح من هنا بعد تسجيل الدخول.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="bg-amber-600 text-white px-8 py-3 rounded-3xl font-bold shadow-lg hover:bg-sky-900 transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="border border-sky-900 text-sky-900 px-8 py-3 rounded-3xl font-bold hover:bg-sky-100 transition-colors">
            إنشاء حساب
          </Link>
        </div>
      </div>
    );
  }

  if (loading && purchases.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-24" dir="rtl">
      <div className="bg-white/95 backdrop-blur-md sticky top-0 z-40 p-4 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sky-900 hover:text-amber-600 transition-all active:scale-95"
          >
            <ArrowRight size={26} />
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black text-sky-900 flex items-center justify-center gap-2">
              <BookOpen size={28} className="text-amber-600" /> مشترياتي
            </h1>
            <p className="text-sm text-gray-500">عرض جميع الكتب التي اشتريتها بنجاح</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">عدد المشتريات</p>
            <h2 className="mt-3 text-3xl font-black text-sky-950">{purchases.length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">إجمالي قيمة المشتريات</p>
            <h2 className="mt-3 text-3xl font-black text-sky-950">{totalPrice.toLocaleString()} ج.م</h2>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">تصفح كامل مكتبتك</p>
            <Link href="/" className="inline-flex items-center gap-2 mt-3 text-amber-600 font-bold hover:text-sky-900 transition-colors">
              العودة إلى المتجر
            </Link>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 text-center">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700">لم تقم بأي شراء بعد</h2>
            <p className="text-gray-500 mt-2">ابدأ الآن بتصفح الكتب وإضافة ما يعجبك إلى السلة.</p>
            <Link href="/" className="mt-6 inline-flex bg-amber-600 text-white px-8 py-3 rounded-3xl font-bold hover:bg-sky-900 transition-colors">
              تصفح الكتب
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 p-5">
                  <div className="w-full h-44 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={
                        purchase.book?.coverUrl || 
                        purchase.coverUrl || 
                        purchase.bookCover ||
                        "/logo.png"
                      }
                      alt={purchase.book?.title || purchase.bookTitle || "book cover"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target;
                        if (img && img.src && !img.src.endsWith('/logo.png')) {
                          img.src = "/logo.png";
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-amber-500 font-bold">عملية شراء ناجحة</span>
                      <h3 className="mt-3 text-lg md:text-xl font-black text-sky-950 line-clamp-2">
                        {purchase.book?.title || purchase.bookTitle || purchase.title || "كتاب غير معروف"}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        رقم الكتاب: {purchase.book?.id || purchase.bookId || "غير متوفر"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        السعر: {
                          purchase.book?.price || purchase.price || purchase.amount 
                            ? `${Number(purchase.book?.price || purchase.price || purchase.amount).toLocaleString()} ج.م` 
                            : "غير متوفر"
                        }
                      </p>
                      {purchase.book === null && (
                        <p className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                          ⚠️ بيانات الكتاب قيد التحديث، يرجى إعادة تحميل الصفحة
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-4 py-2 text-xs font-black self-start">
                          <CheckCircle2 size={16} /> تم تأكيد الملكية
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/book/${purchase.book?._id || purchase.bookId || purchase.book?.id}`}
                            className="p-3 rounded-2xl border border-gray-100 text-sky-900 hover:bg-gray-50 bg-white shadow-sm flex items-center gap-2 text-xs font-bold transition-all"
                          >
                            <BookOpen size={16} /> عرض التفاصيل
                          </Link>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-100 pt-4">
                        {timers[purchase.book?._id || purchase.bookId || purchase.book?.id] > 0 ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between bg-amber-50 rounded-2xl p-4 border border-amber-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 font-black shadow-sm shrink-0">
                                  {formatTime(timers[purchase.book?._id || purchase.bookId || purchase.book?.id])}
                                </div>
                                <div>
                                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">رابط فعال الآن</p>
                                  <p className="text-xs text-amber-900 font-medium tracking-tight">يرجى حفظ الملف فوراً.</p>
                                </div>
                              </div>
                              <a 
                                href={downloadLinks[purchase.book?._id || purchase.bookId || purchase.book?.id]} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-600 text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:bg-amber-700 transition-all shadow-amber-100"
                              >
                                <Download size={14} /> استلام الملف
                              </a>
                            </div>
                          </div>
                        ) : purchase.isDownloaded ? (
                          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-gray-400">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm shrink-0">
                              <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider">تم التحميل مسبقاً</p>
                                <p className="text-xs font-medium">تم استهلاك رابط التحميل المؤقت لهذا الكتاب.</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGetDownloadLink(purchase.book?._id || purchase.bookId || purchase.book?.id)}
                            disabled={fetchingLink[purchase.book?._id || purchase.bookId || purchase.book?.id]}
                            className="w-full bg-sky-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-sky-100 hover:bg-sky-950 transition-all active:scale-95 disabled:opacity-70 group"
                          >
                            {fetchingLink[purchase.book?._id || purchase.bookId || purchase.book?.id] ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                            )}
                            تحميل الكتاب المباشر (PDF)
                          </button>
                        )}
                        <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                          <AlertCircle size={10} /> 
                          {!purchase.isDownloaded 
                            ? "ملاحظة: يمكنك إصدار رابط تحميل واحد فقط لكل عملية شراء." 
                            : "لديك 5 دقائق لتحميل الملف بعد الضغط على الزر لأول مرة."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchasesPage;
