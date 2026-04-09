"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/api";
import { PackageSearch, Users, DollarSign, Activity, LayoutDashboard, History } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalFiles: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        console.log( stats.recentSales, "AdminDashboard mounted, fetching stats..."); // إضافة لوج للتأكد من أن الـ useEffect يعمل
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/dashboard");
            console.log("Raw dashboard data from API:", data.data);
            const d = data.data || {};
            setStats({
                totalRevenueCents: d.totalRevenue || 0, // تغيير d.totalRevenueCents إلى d.totalRevenue
                totalUsers: d.totalUsers || 0,
                totalBooks: d.totalFiles || 0,      // تغيير d.totalBooks إلى d.totalFiles
                recentSales: d.recentSales || []
            });
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Activity className="w-12 h-12 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-10 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-300 dark:border-gray-700 pb-4">
                <LayoutDashboard className="w-10 h-10 text-red-500" />
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    لوحة تحكم المتجر
                </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatCard
                    title="الكتب والإصدارات"
                    value={stats.totalBooks}
                    icon={<PackageSearch className="w-8 h-8 text-white" />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="إجمالي المستخدمين"
                    value={stats.totalUsers}
                    icon={<Users className="w-8 h-8 text-white" />}
                    color="bg-green-600"
                />
                <StatCard
                    title="إجمالي الإيرادات"
                    value={`${(stats.totalRevenueCents / 100).toLocaleString()} ج.م`}
                    icon={<DollarSign className="w-8 h-8 text-white" />}
                    color="bg-amber-500"
                />
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-10">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex items-center gap-3">
                    <History className="text-gray-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">أحدث عمليات البيع</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right table-auto">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4 font-bold">العميل</th>
                                <th className="p-4 font-bold">الكتاب</th>
                                <th className="p-4 font-bold">المبلغ</th>
                                <th className="p-4 font-bold">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {stats.recentSales.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">لا توجد مبيعات حديثة</td>
                                </tr>
                            ) : (
                                stats.recentSales.map((sale, index) => (
                                    <tr key={sale._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                                            {sale.userName || "عميل غير متاح"}
                                            <span className="block text-xs text-gray-400 mt-1">{sale.user?.email}</span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            {sale.bookTitle || "كتاب محذوف"}
                                        </td>
                                        <td className="p-4 font-bold text-green-600">
                                            {(sale.amount / 100).toLocaleString()} ج.م
                                        </td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {new Date(sale.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div
            className={`${color} 
        /* تقليل الـ padding في المساحات الضيقة */
        p-4 min-[1000px]:p-6 
        rounded-3xl shadow-lg flex flex-col justify-between 
        hover:scale-105 transition-transform duration-300 cursor-pointer h-full`}
        >
            <div className="flex flex-row items-center justify-between mb-4 gap-2">
                {/* العنوان */}
                <div className="flex items-center gap-1.5 min-[1000px]:gap-2">
                    {/* تصغير الخط والخط الجانبي في المساحة الضيقة */}
                    <div className="w-0.5 min-[1000px]:w-1 h-6 min-[1000px]:h-8 bg-white rounded-full"></div>
                    <p className="text-white font-semibold text-md min-[1000px]:text-2xl border-b border-white/50 pb-1 truncate">
                        {title}
                    </p>
                </div>

                {/* الأيقونة - تصغير حجم الدائرة حولها */}
                <div className="rounded-full p-1.5 min-[1000px]:p-2 bg-white/30 shrink-0">
                    {/* تصغير الأيقونة نفسها */}
                    <div className="w-5 h-5 min-[1000px]:w-8 min-[1000px]:h-8 flex items-center justify-center">
                        {React.cloneElement(icon, { className: "w-full h-full text-white" })}
                    </div>
                </div>
            </div>

            {/* تصغير حجم الرقم في المساحة الضيقة */}
            <h2 className="text-3xl min-[1000px]:text-5xl text-white font-normal">
                {value}
            </h2>
        </div>
    );
}
