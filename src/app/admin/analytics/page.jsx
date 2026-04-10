"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
    LineChart, 
    BarChart as BarChartIcon, 
    UserPlus, 
    FileArchive, 
    Target, 
    TrendingUp, 
    DollarSign,
    LayoutDashboard
} from "lucide-react";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentPayments, setRecentPayments] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            console.log("🚀 جاري جلب البيانات...");
            const [statsRes, paymentsRes] = await Promise.allSettled([
                api.get('/admin/stats/advanced'),
                api.get('/payments?limit=10&status=succeeded') // زودنا الليمت للتأكد
            ]);

            if (statsRes.status === 'fulfilled') {
                console.log("📊 Stats Data:", statsRes.value.data.data);
                setStats(statsRes.value.data.data);
            }

            if (paymentsRes.status === 'fulfilled') {
                // محاولة قراءة الداتا من أكتر من مسار محتمل
                const rawPayments = paymentsRes.value.data;
                const pData = rawPayments?.data?.results || rawPayments?.results || rawPayments?.data || [];
                console.log("💳 Payments Data:", pData);
                setRecentPayments(pData);
            }
        } catch (err) {
            console.error("❌ Error:", err);
            toast.error("فشل تحديث بعض الأرقام");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-pink-500 font-bold animate-pulse text-xl italic">
                    تحميل لوحة التحليلات...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-pink-600 rounded-2xl shadow-lg shadow-pink-100">
                        <LineChart className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">لوحة ذكاء الأعمال</h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Business Intelligence</p>
                    </div>
                </div>
                <button onClick={fetchAnalytics} className="p-3 hover:bg-pink-50 rounded-full transition-all">
                    <TrendingUp className="w-5 h-5 text-pink-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. AOV - شغال تمام */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-emerald-600">
                        <Target className="w-6 h-6" />
                        <h3 className="font-bold text-gray-700">متوسط قيمة الطلب</h3>
                    </div>
                    <div className="text-4xl font-black text-gray-900">
                        {Number(stats.aov?.averageAmount || stats.aov?.averageCents || 0).toLocaleString()} <span className="text-lg font-normal text-gray-400">ج.م</span>
                    </div>
                </div>

                {/* 2. قنوات التسجيل - اتظبطت */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <UserPlus className="w-6 h-6" />
                        <h3 className="font-bold text-gray-700">قنوات التسجيل</h3>
                    </div>
                    <div className="space-y-2">
                        {(Array.isArray(stats.signupChannels) ? stats.signupChannels : []).map((chan, idx) => (
                            <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded-xl border border-gray-100/50">
                                <span className="text-xs font-bold text-gray-600 uppercase">
                                    {chan.channel === 'google' ? 'جوجل' : (chan.channel === 'local' ? 'إيميل' : chan.channel)}
                                </span>
                                <span className="font-black text-blue-600">{chan.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. الكتب الراكدة */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-red-500">
                        <FileArchive className="w-6 h-6" />
                        <h3 className="font-bold text-gray-700">كتب لم تُبع</h3>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">
                        {Array.isArray(stats.stagnantBooks) ? stats.stagnantBooks.length : 0}
                    </div>
                    <p className="text-[10px] text-gray-400 italic">كتب مر عليها 30 يوم بدون مبيعات</p>
                </div>

                {/* التصنيفات والمبيعات */}
                <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Category Chart */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2">
                            <BarChartIcon className="text-pink-600" /> الربح حسب القسم
                        </h3>
                        <div className="space-y-6">
                            {Array.isArray(stats.categoryPerformance) && stats.categoryPerformance.length > 0 ? (
                                stats.categoryPerformance.map((cat, i) => {
                                    if (!cat) return null;
                                    const amount = Number(cat.totalRevenue || cat.totalRevenueCents) || 0;
                                    const max = Math.max(...stats.categoryPerformance.map(c => Number(c?.totalRevenue || c?.totalRevenueCents) || 0), 1);
                                    const percent = (amount / max) * 100;
                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm font-black">
                                                <span>{cat.category || cat.name || cat.categoryName || cat._id?.name || "قسم عام"}</span>
                                                <span className="text-pink-600">{amount.toLocaleString()} ج.م</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-pink-500" style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-10 text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-3xl">
                                    لا توجد بيانات تصنيفات حالياً من السيرفر
                                </div>
                            )}
                        </div>
                    </div>

                    {/* أحدث العمليات */}
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2 text-sm">
                            <LayoutDashboard className="w-4 h-4 text-pink-500" /> آخر 5 مبيعات ناجحة
                        </h3>
                        <div className="space-y-4">
                            {recentPayments.length > 0 ? (
                                recentPayments.map((pay, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-transparent hover:border-pink-100 transition-all">
                                        <div className="flex items-center gap-3 truncate">
                                            <div className="w-8 h-8 rounded-lg bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
                                                <DollarSign size={14} className="text-emerald-500" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-[10px] font-black text-gray-800 truncate">{pay.book?.title || 'طلب كتاب'}</p>
                                                <p className="text-[8px] text-gray-400">{pay.user?.name || 'عميل'}</p>
                                            </div>
                                        </div>
                                        <div className="text-left font-black text-emerald-600 text-xs">
                                            +{Number(pay?.amount || 0).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-20 text-[10px] text-gray-300 italic">لم يتم العثور على عمليات دفع ناجحة</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}