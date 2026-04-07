"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Package, CreditCard, Activity, CheckCircle, Search } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/payments?status=succeeded');
            // تأكدنا من الـ Console أن البيانات موجودة داخل res.data.data
            setOrders(res.data.data || []);
        } catch (err) {
            toast.error("فشل جلب أحدث الطلبات والمدفوعات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // تحديث الفلتر ليتناسب مع أسماء الحقول الجديدة (book و transactionId)
    const filteredOrders = orders.filter(o =>
        o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.transactionId?.toString().includes(searchTerm)
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">المدفوعات والطلبات</h2>
                        <p className="text-gray-500 text-xs font-medium">متابعة العمليات الناجحة عبر Stripe و Paymob</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="ابحث بالبريد، اسم الكتاب أو رقم العملية..."
                        className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-3.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-gray-500 font-bold mb-1">الطلبات المعروضة</p>
                        <h3 className="text-3xl font-black text-gray-800 dark:text-white">{filteredOrders.length}</h3>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-full">
                        <Activity className="text-orange-500 w-8 h-8" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-gray-500 font-bold mb-1">إجمالي المبالغ المنفذة</p>
                        <h3 className="text-3xl font-black text-gray-800 dark:text-white">
                            {(filteredOrders.reduce((acc, curr) => acc + curr.amount, 0) / 100).toLocaleString()} <span className="text-sm">ج.م</span>
                        </h3>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full">
                        <CreditCard className="text-green-500 w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[900px] text-right table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="p-5 font-bold">العميل</th>
                                <th className="p-5 font-bold">الكتاب المُشترى</th>
                                <th className="p-5 font-bold">رقم العملية (ID)</th>
                                <th className="p-5 font-bold text-center">المبلغ</th>
                                <th className="p-5 font-bold text-center">التاريخ</th>
                                <th className="p-5 font-bold text-center">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center font-black text-orange-500 animate-pulse">جاري جلب المدفوعات...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center font-medium text-gray-500">لا توجد طلبات مطابقة</td></tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{order.user?.name || "بدون اسم"}</p>
                                        <p className="text-xs text-gray-500 mt-1">{order.user?.email || "غير متوفر"}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1 max-w-[200px]" title={order.book?.title}>
                                            {/* التغيير هنا: من file إلى book */}
                                            {order.book?.title || "كتاب غير محدد أو محذوف"}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs text-gray-400 font-mono tracking-wider">
                                        {/* التغيير هنا: استخدام transactionId بدلاً من stripePaymentIntentId */}
                                        {order.transactionId || "—"}
                                        <span className="block text-[10px] text-gray-400 mt-1 opacity-60 uppercase">المزود: {order.provider}</span>
                                    </td>
                                    <td className="p-5 text-center font-black text-orange-600">
                                        {(order.amount / 100).toLocaleString()} {order.currency === 'egp' ? 'ج.م' : order.currency}
                                    </td>
                                    <td className="p-5 text-center text-sm text-gray-500 font-semibold">
                                        {new Date(order.createdAt).toLocaleString('en-GB', { hour12: false })}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mx-auto max-w-max">
                                            <CheckCircle size={14} />
                                            {order.status === 'succeeded' ? 'مكتمل' : order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}