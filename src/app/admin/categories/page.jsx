"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tags, Edit, Trash2, AlignRight } from "lucide-react";

export default function AdminCategoriesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", cover: null });
    const [preview, setPreview] = useState(null);

    // جلب التوكن (استخدام المسمى الصحيح الموحد في المشروع jwtToken)
    const getAuthToken = () => localStorage.getItem("jwtToken");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            console.log("DEBUG: Categories Data from API ->", res.data.data);
            setItems(res.data.data || []);
        } catch (err) {
            toast.error("فشل جلب المجالات");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        // إذا كان الرابط كاملاً يبدأ بـ http، نرجعه كما هو
        if (path.startsWith('http')) return path;
        // إذا كان رابطاً نسبياً، نضيف الـ Base URL الخاص بالسيرفر
        // ملاحظة: قد يحتاج المسار لإضافة / في البداية إذا لم تكن موجودة
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `https://e-library-api-production.up.railway.app${cleanPath}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("📸 الملف المختار:", file);

        if (file) {
            setForm({ ...form, cover: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.warn("اسم المجال مطلوب");

        setSubmitting(true);
        const token = getAuthToken();

        try {
            // وفقاً لطلب المستخدم والباك إند: الإرسال يكون FormData
            const formData = new FormData();
            formData.append('name', form.name.trim());
            formData.append('description', form.description.trim());

            if (form.cover) {
                formData.append('cover', form.cover);
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editId) {
                await api.patch(`/categories/${editId}`, formData, config);
                toast.success("تم التحديث بنجاح");
            } else {
                await api.post(`/categories`, formData, config);
                toast.success("تمت إضافة المجال بنجاح");
            }

            await fetchCategories();
            resetForm();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "فشل حفظ المجال";
            toast.error(errorMsg);
            console.error("Server Error:", err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ name: "", description: "", cover: null });
        setPreview(null);
        setEditId(null);
    };

    const deleteItem = async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟ سيتم حذف جميع الكتب المرتبطة بهذا المجال نهائياً.")) return;
        const token = getAuthToken();
        try {
            await api.delete(`/categories/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.info("تم الحذف بنجاح");
            await fetchCategories();
        } catch (err) {
            toast.error("فشل الحذف - تأكد من صلاحياتك");
        }
    };

    const editItem = (item) => {
        setEditId(item._id);
        setForm({
            name: item.name || "",
            description: item.description || "",
            cover: null
        });
        // التحقق من المسميات الأرجح بناءً على رد الباك إند
        setPreview(getImageUrl(item.coverUrl || item.coverImageKey));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="p-4 bg-green-600 rounded-2xl shadow-lg shadow-green-200">
                    <Tags className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">إدارة المجالات الرئيسية</h2>
                    <p className="text-gray-500 text-xs font-medium">إضافة وتعديل الأقسام مع رفع صور غلاف (FormData)</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-[2.5rem] shadow-xl p-5 md:p-10 border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم المجال</label>
                        <input
                            className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="مثال: علوم الحديث..."
                            required
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignRight size={16} /> وصف تعريفي</label>
                        <textarea
                            className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="نبذة عن هذا المجال..."
                        />
                    </div>

                    {/* حقل رفع الصورة */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">صورة غلاف المجال (اختياري)</label>
                        <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 dark:bg-gray-700/30 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-600">
                            <div className="relative w-32 h-32 bg-white dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shadow-inner">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Tags className="text-gray-200 w-12 h-12" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label htmlFor="cover-upload" className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors">
                                    {preview ? "تغيير الصورة" : "اختر صورة الغلاف"}
                                </label>
                                <p className="text-[10px] text-gray-400">يتم رفع الصور مباشرة إلى Cloudflare R2 (حسب المواصفات)</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button type="submit" disabled={submitting} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50">
                            {submitting ? "جاري الحفظ..." : (editId ? "حفظ التعديلات" : "إضافة المجال")}
                        </button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="px-8 bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl font-bold transition-all">
                                إلغاء
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <table className="w-full text-right table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-5 font-bold">صورة</th>
                            <th className="p-5 font-bold">اسم المجال</th>
                            <th className="p-5 font-bold">الوصف</th>
                            <th className="p-5 font-bold text-center">التحكم</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="3" className="p-10 text-center font-black text-green-600 animate-pulse">جاري التحميل...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan="3" className="p-10 text-center font-medium text-gray-500">لا توجد مجالات مضافة</td></tr>
                        ) : items.map((item) => (
                            <tr key={item._id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors">
                                <td className="p-5">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                                        {/* استخدام المسميات الأكثر دقة بناءً على الكونسول */}
                                        {(item.coverUrl || item.coverImageKey) ? (
                                            <img src={getImageUrl(item.coverUrl || item.coverImageKey)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Tags className="text-gray-100 w-6 h-6" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-5 font-bold text-gray-800 dark:text-gray-200 text-sm">{item.name}</td>
                                <td className="p-5 text-sm text-gray-500">
                                    {item.description || "لا يوجد وصف"}
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
        </div>
    );
}