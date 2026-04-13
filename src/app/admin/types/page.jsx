"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyPlus, Edit, Trash2, AlignRight } from "lucide-react";

export default function AdminProductTypesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });

    // جلب التوكن من الـ localStorage (تأكدي من المسمى عندك)
    const getAuthToken = () => localStorage.getItem("jwtToken");

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/product-types');
            setItems(res.data.data || []);
        } catch (err) {
            toast.error("فشل جلب الأنواع");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.warn("اسم النوع مطلوب");

        setSubmitting(true);
        const token = getAuthToken();

        try {
            // التعديل الجوهري: إرسال JSON Object بدلاً من FormData
            // وإضافة الـ Authorization Header يدوياً لضمان الصلاحية
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const payload = {
                name: form.name.trim(),
                description: form.description.trim()
            };

            if (editId) {
                await api.patch(`/product-types/${editId}`, payload, config);
                toast.success("تم التحديث بنجاح");
            } else {
                await api.post(`/product-types`, payload, config);
                toast.success("تمت إضافة النوع بنجاح");
            }

            await fetchTypes();
            resetForm();
        } catch (err) {
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(error => {
                    toast.error(error.message);
                });
            } else {
                const errorMsg = err.response?.data?.message || "فشل حفظ النوع (تأكد من صلاحياتك)";
                toast.error(errorMsg);
            }
            console.error("Error details:", err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ name: "", description: "" });
        setEditId(null);
    };

    const deleteItem = async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        const token = getAuthToken();

        try {
            await api.delete(`/product-types/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.info("تم الحذف بنجاح");
            await fetchTypes();
        } catch (err) {
            toast.error("فشل الحذف - قد لا تملك صلاحية Admin");
        }
    };

    const editItem = (item) => {
        setEditId(item._id);
        setForm({
            name: item.name || "",
            description: item.description || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* Header */}
            <div className="flex flex-row items-center gap-3 md:gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="p-3 md:p-4 bg-purple-600 rounded-xl md:rounded-2xl shadow-lg shadow-purple-200">
                    <CopyPlus className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">إدارة أنواع الإصدارات</h2>
                    <p className="text-gray-500 text-[10px] md:text-xs font-medium">حسب الوثيقة: إضافة وتعديل أنواع المنتجات (Admin Only)</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-4 md:p-10 border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم النوع (name)</label>
                            <span className={`text-[10px] font-bold ${form.name.length > 50 ? "text-red-500" : "text-gray-400"}`}>
                                {form.name.length}/50
                            </span>
                        </div>
                        <input
                            className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 text-sm font-bold"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="مثال: كتاب، بحث، مقال..."
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignRight size={16} /> وصف تعريفي (description)</label>
                            <span className={`text-[10px] font-bold ${form.description.length > 500 ? "text-red-500" : "text-gray-400"}`}>
                                {form.description.length}/500
                            </span>
                        </div>
                        <textarea
                            className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px] md:min-h-[100px]"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="اختياري: اشرح ماهية هذا النوع..."
                            maxLength={500}
                        />
                    </div>

                    <div className="md:col-span-2 flex flex-col md:flex-row gap-3 mt-2 md:mt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3.5 md:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-purple-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {submitting ? "جاري الحفظ..." : (editId ? "تحديث النوع" : "إضافة النوع الجديد")}
                        </button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="py-3.5 md:px-8 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl md:rounded-2xl font-bold transition-all">
                                إلغاء
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Table - Desktop & Cards - Mobile */}
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full text-right table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="p-5 font-bold">الاسم</th>
                                <th className="p-5 font-bold">الوصف</th>
                                <th className="p-5 font-bold text-center">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="3" className="p-10 text-center font-black text-purple-600 animate-pulse">جاري التحميل...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="3" className="p-10 text-center font-medium text-gray-500">لا توجد أنواع مضافة حالياً</td></tr>
                            ) : items.map((item) => (
                                <tr key={item._id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors">
                                    <td className="p-5 font-bold text-gray-800 dark:text-gray-200 text-sm">{item.name}</td>
                                    <td className="p-5 text-sm text-gray-500">
                                        {item.description || <span className="text-gray-300 italic">بدون وصف</span>}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => editItem(item)} className="p-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} /></button>
                                            <button onClick={() => deleteItem(item._id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden">
                    <div className="p-4 space-y-4">
                        {loading ? (
                             <div className="p-10 text-center font-black text-purple-600 animate-pulse">جاري التحميل...</div>
                        ) : items.length === 0 ? (
                            <div className="p-10 text-center font-medium text-gray-500">لا توجد أنواع مضافة حالياً</div>
                        ) : items.map((item) => (
                            <div key={item._id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.description || <span className="italic opacity-50">بدون وصف</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-600">
                                    <button onClick={() => editItem(item)} className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-active active:bg-yellow-100">
                                        <Edit size={14} /> تعديل
                                    </button>
                                    <button onClick={() => deleteItem(item._id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-active active:bg-red-100">
                                        <Trash2 size={14} /> حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}