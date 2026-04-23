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
    const [form, setForm] = useState({ name: "", description: "", cover: null, language: "ar" });
    const [preview, setPreview] = useState(null);
    const [filterLanguage, setFilterLanguage] = useState(""); // إضافة حالة اللغة للفلترة

    // جلب التوكن (استخدام المسمى الصحيح الموحد في المشروع jwtToken)
    const getAuthToken = () => localStorage.getItem("jwtToken");

    const fetchCategories = async (language = "") => {
        setLoading(true);
        try {
            const res = await api.get(`/categories${language ? `?language=${language}` : ""}`);
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
        fetchCategories(filterLanguage);
    }, [filterLanguage]);

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
            formData.append('language', form.language); // إضافة اللغة هنا

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
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(error => {
                    toast.error(error.message);
                });
            } else {
                const errorMsg = err.response?.data?.message || "فشل حفظ المجال";
                toast.error(errorMsg);
            }
            console.error("Server Error:", err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ name: "", description: "", cover: null, language: "ar" });
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
            cover: null,
            language: item.language || "ar" // إضافة حقل اللغة هنا
        });
        // التحقق من المسميات الأرجح بناءً على رد الباك إند
        setPreview(getImageUrl(item.coverUrl || item.coverImageKey));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* Header */}
            <div className="flex flex-row items-center gap-3 md:gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="p-3 md:p-4 bg-green-600 rounded-xl md:rounded-2xl shadow-lg shadow-green-200">
                    <Tags className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">إدارة المجالات الرئيسية</h2>
                    <p className="text-gray-500 text-[10px] md:text-xs font-medium">إضافة وتعديل الأقسام مع رفع صور غلاف</p>
                </div>
                <div className="flex items-center gap-3 mr-auto">
                    <select className="p-2 border rounded-md text-sm font-bold" value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)}>
                        <option value="">كل اللغات</option>
                        <option value="ar">العربية</option>
                        <option value="en">الإنجليزية</option>
                        <option value="es">الإسبانية</option>
                    </select>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-4 md:p-10 border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم المجال</label>
                            <span className={`text-[10px] font-bold ${form.name.length > 50 ? "text-red-500" : "text-gray-400"}`}>
                                {form.name.length}/50
                            </span>
                        </div>
                        <input
                            className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="مثال: علوم الحديث..."
                            required
                            maxLength={50}
                        />
                    </div>

                    {/* حقل اختيار اللغة */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">لغة المجال</label>
                        <select className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none appearance-none font-bold text-sm" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} required>
                            <option value="ar">العربية</option>
                            <option value="en">الإنجليزية</option>
                            <option value="es">الإسبانية</option>
                        </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignRight size={16} /> وصف تعريفي</label>
                            <span className={`text-[10px] font-bold ${form.description.length > 500 ? "text-red-500" : "text-gray-400"}`}>
                                {form.description.length}/500
                            </span>
                        </div>
                        <textarea
                            className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-500 min-h-[80px] md:min-h-[100px]"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="نبذة عن هذا المجال..."
                            maxLength={500}
                        />
                    </div>

                    {/* حقل رفع الصورة */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">صورة غلاف المجال (اختياري)</label>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-600">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shadow-inner">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Tags className="text-gray-200 w-10 h-10 md:w-12 md:h-12" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-right">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label htmlFor="cover-upload" className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-bold rounded-xl cursor-pointer transition-colors">
                                    {preview ? "تغيير الصورة" : "اختر صورة الغلاف"}
                                </label>
                                <p className="text-[10px] text-gray-400">يدعم JPG, PNG بجودة عالية</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col md:flex-row gap-3 mt-2">
                        <button type="submit" disabled={submitting} className="flex-1 py-3.5 md:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50">
                            {submitting ? "جاري الحفظ..." : (editId ? "حفظ التعديلات" : "إضافة المجال")}
                        </button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="py-3.5 md:px-8 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl md:rounded-2xl font-bold transition-all">
                                إلغاء
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List - Desktop Table & Mobile Cards */}
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                {/* Desktop View */}
                <div className="hidden md:block">
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
                                <tr><td colSpan="4" className="p-10 text-center font-black text-green-600 animate-pulse">جاري التحميل...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="4" className="p-10 text-center font-medium text-gray-500">لا توجد مجالات مضافة</td></tr>
                            ) : items.map((item) => (
                                <tr key={item._id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors">
                                    <td className="p-5">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                                            {(item.coverUrl || item.coverImageKey) ? (
                                                <img src={getImageUrl(item.coverUrl || item.coverImageKey)} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Tags className="text-gray-100 w-6 h-6" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 font-bold text-gray-800 dark:text-gray-200 text-sm">{item.name}
                                        <span className="block text-[10px] font-medium text-gray-400 mt-1">
                                            {item.language === 'es' ? 'Español' : item.language === 'en' ? 'EN' : 'العربية'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500 max-w-xs truncate">
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

                {/* Mobile View - Cards */}
                <div className="md:hidden">
                    <div className="p-4 space-y-4">
                        {loading ? (
                             <div className="p-10 text-center font-black text-green-600 animate-pulse">جاري التحميل...</div>
                        ) : items.length === 0 ? (
                            <div className="p-10 text-center font-medium text-gray-500">لا توجد مجالات مضافة</div>
                        ) : items.map((item) => (
                            <div key={item._id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white bg-white shadow-sm flex-shrink-0">
                                        {(item.coverUrl || item.coverImageKey) ? (
                                            <img src={getImageUrl(item.coverUrl || item.coverImageKey)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100"><Tags className="text-gray-300 w-6 h-6" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{item.name}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{item.description || "لا يوجد وصف"}</p>
                                        <span className="block text-[10px] font-medium text-gray-400 mt-1">
                                            {item.language === 'ar' ? 'العربية' : item.language === 'en' ? 'الإنجليزية' : 'الإسبانية'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-600">
                                    <button onClick={() => editItem(item)} className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold"><Edit size={14} /> تعديل</button>
                                    <button onClick={() => deleteItem(item._id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold"><Trash2 size={14} /> حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}