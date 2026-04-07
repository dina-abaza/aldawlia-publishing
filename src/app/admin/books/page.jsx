"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PackageSearch, Edit, Trash2, PlusCircle, ImageIcon, ChevronRight, ChevronLeft, Layers, AlignRight, FileText } from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [bookFile, setBookFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [form, setForm] = useState({
        title: "",
        price: "",
        discountPrice: "",
        isOnSale: false,
        category: "",
        productType: "",
        description: "",
    });

    const fetchCategoriesAndTypes = async () => {
        try {
            const [catRes, typesRes] = await Promise.all([
                api.get('/categories'),
                api.get('/product-types')
            ]);
            setCategories(catRes.data.data || []);
            setProductTypes(typesRes.data.data || []);
        } catch (err) {
            toast.error("فشل جلب تصنيفات الكتب");
        }
    };

    const fetchProducts = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/files?page=${pageNumber}&limit=10`);
            console.log("Raw products data from API:", res.data);
            setProducts(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setPage(pageNumber);
        } catch (err) {
            toast.error("فشل جلب الكتب");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesAndTypes();
        fetchProducts(1);
    }, []);

    const submitProduct = async (e) => {
        e.preventDefault();

        console.log("DEBUG: Form State:", form);
        console.log("DEBUG: Files:", { bookFile, coverFile });

        // 1. Validation
        if (!form.title.trim()) return toast.warn("عنوان الكتاب مطلوب");
        if (!form.price) return toast.warn("السعر مطلوب");
        if (!form.category) return toast.warn("تحديد المجال مطلوب");
        if (!form.productType) return toast.warn("تحديد النوع مطلوب");
        if (!editProductId && !bookFile) {
            return toast.warn("يجب رفع ملف الكتاب (PDF/EPUB) عند الإضافة");
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append("title", form.title);
        // التحويل لسنتات (الـ backend يتوقع Cents لـ stripe)
        formData.append("price", Math.round(parseFloat(form.price) * 100));

        if (form.discountPrice && form.discountPrice.toString().trim() !== "") {
            formData.append("discountPrice", Math.round(parseFloat(form.discountPrice) * 100));
        }

        // إرسال القيم كما يتوقعها الباك اند (true/false كـ strings)
        formData.append("isOnSale", form.isOnSale ? "true" : "false");

        formData.append("category", form.category);
        formData.append("productType", form.productType);
        formData.append("description", form.description || "");

        console.log("DEBUG: Sending FormData to API. ID:", editProductId || "NEW");

        // 🔹 تصحيح: في حالة التعديل، لا نرسل الملفات إلا إذا تم اختيار ملفات جديدة
        if (bookFile) {
            formData.append("file", bookFile);
        }
        if (coverFile) {
            formData.append("cover", coverFile);
        }

        try {
            if (editProductId) {
                // PATCH لتحديث البيانات الجزئية للملف
                const res = await api.patch(`/files/${editProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("DEBUG: PATCH Response:", res.data);

                // 🔹 تحديث المنتج يدوياً في القائمة لضمان التحديث الفوري للواجهة
                const updatedProduct = res.data.data;
                setProducts(prev => prev.map(p => (p.id || p._id) === editProductId ? { ...p, ...updatedProduct } : p));

                toast.success("تم التحديث بنجاح");
            } else {
                // POST للإضافة
                const res = await api.post(`/files/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("DEBUG: POST Response:", res.data);
                toast.success("تمت إضافة الكتاب بنجاح");
                await fetchProducts(1); // 🔹 إعادة جلب الصفحة الأولى لظهور الكتاب الجديد
            }
            resetForm();
        } catch (err) {
            console.error("DEBUG: Submit Error Details:", err.response?.data);
            if (err.response?.data?.errors) {
                console.table(err.response.data.errors); // عرض الأخطاء بشكل جدول واضح
            }
            toast.error(err.response?.data?.message || "فشل رفع الكتاب، تأكد من البيانات والملفات");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ title: "", price: "", discountPrice: "", isOnSale: false, category: "", productType: "", description: "" });
        setBookFile(null);
        setCoverFile(null);
        setEditProductId(null);
        // تصفير ملفات الـ inputs يدوياً
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = "");
    };

    const deleteProduct = async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟ سيتم حذف الكتاب وملف الـ PDF نهائياً")) return;
        try {
            console.log("DEBUG: Attempting to delete product with ID:", id);
            await api.delete(`/files/${id}`);
            // 🔹 تحديث القائمة بحذف أي كتاب يطابق هذا المعرف سواء كان id أو _id
            setProducts(prev => prev.filter(item => (item._id !== id && item.id !== id)));
            toast.success("تم الحذف بنجاح");
        } catch (err) {
            console.error("Delete Error:", err);
            const errorMessage = err.response?.data?.message || "فشل الحذف - قد لا تملك صلاحيات كافية";
            toast.error(errorMessage);

            if (err.response?.status === 403) {
                console.warn("المسار /files/:id مرفوض (403). تأكد من رتبة الحساب admin.");
            }
        }
    };

    const editProduct = (product) => {
        // 🔹 تصحيح: التحقق من المعرف سواء كان _id أو id كما يرتجع من السيرفر
        const productId = product.id || product._id;
        console.log("DEBUG: Setting editProductId to:", productId);
        setEditProductId(productId);

        setForm({
            title: product.title || "",
            price: product.price ? (product.price / 100).toString() : "",
            discountPrice: product.discountPrice ? (product.discountPrice / 100).toString() : "",
            isOnSale: product.isOnSale || false,
            category: product.category?._id || product.category || "",
            productType: product.productType?._id || product.productType || "",
            description: product.description || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        return `https://e-library-api-production.up.railway.app${path}`;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        {editProductId ? <Edit className="text-white w-6 h-6" /> : <PackageSearch className="text-white w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            {editProductId ? "تعديل الكتاب الرقمي" : "إضافة كتاب جديد"}
                        </h2>
                        <p className="text-gray-500 text-xs font-medium">إدارة المكتبة الإلكترونية والإصدارات</p>
                    </div>
                </div>
                {editProductId && (
                    <button onClick={resetForm} className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
                        إلغاء التعديل
                    </button>
                )}
            </div>

            {/* نموذج الإدخال responsive */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-5 md:p-10 border border-gray-100 dark:border-gray-700">
                <form onSubmit={submitProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5 lg:col-span-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان الكتاب</label>
                        <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="أدخل اسم الكتاب..." required />
                    </div>

                    <div className="space-y-1.5 relative">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المجال الرئيسي (Category)</label>
                        <select className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none appearance-none font-bold text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                            <option value="">اختر المجال...</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                        <Layers className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    <div className="space-y-1.5 relative">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">نوع الإصدار (Product Type)</label>
                        <select className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none appearance-none font-bold text-sm" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} required>
                            <option value="">اختر النوع...</option>
                            {productTypes.map((t) => (<option key={t._id} value={t._id}>{t.name}</option>))}
                        </select>
                        <Layers className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">السعر (ج.م)</label>
                        <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold text-sm" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150" required />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">السعر بعد الخصم (ج.م)</label>
                        <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold text-sm" type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="اختياري..." />
                    </div>

                    <div className="flex items-center gap-4 px-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <input type="checkbox" id="isOnSale" checked={form.isOnSale} onChange={(e) => setForm({ ...form, isOnSale: e.target.checked })} className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer" />
                        <label htmlFor="isOnSale" className="font-black text-blue-700 dark:text-blue-400 cursor-pointer text-sm">تفعيل عرض الخصم</label>
                    </div>

                    <div className="col-span-full space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignRight size={16} /> المُلخص والنبذة المكتوبة</label>
                        <textarea className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اكتب تفاصيل وملخص الكتاب هنا لتشجيع القارئ..." />
                    </div>

                    {/* رفع الملفات */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 border-2 border-dashed border-gray-200 p-4 rounded-3xl group hover:border-blue-400 transition-colors bg-gray-50/50">
                            <label className="text-sm font-bold text-gray-700 flex flex-col items-center gap-2 text-center">
                                <FileText size={30} className="text-gray-400 group-hover:text-blue-500" />
                                <span>ملف الكتاب (PDF/EPUB)</span>
                                {editProductId && !bookFile && <span className="text-green-600 text-[10px] font-bold">(يوجد ملف حالياً - ارفعه فقط إذا أردت التغيير)</span>}
                                <span className="text-xs font-normal text-gray-400">يفضل ألا يقل حجمه عن 1MB لضمان الدقة</span>
                            </label>
                            <input type="file" onChange={(e) => setBookFile(e.target.files[0])} accept=".pdf,.epub" className="w-full text-sm font-medium mt-2 file:bg-blue-50 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-blue-600 hover:file:bg-blue-100" />
                        </div>

                        <div className="space-y-1.5 border-2 border-dashed border-gray-200 p-4 rounded-3xl group hover:border-blue-400 transition-colors bg-gray-50/50">
                            <label className="text-sm font-bold text-gray-700 flex flex-col items-center gap-2 text-center">
                                <ImageIcon size={30} className="text-gray-400 group-hover:text-blue-500" />
                                <span>صورة الغلاف (Cover)</span>
                                {editProductId && !coverFile && <span className="text-green-600 text-[10px] font-bold">(يوجد غلاف حالياً - ارفع فقط للتغيير)</span>}
                                <span className="text-xs font-normal text-gray-400">JPG, PNG (موصى به: جودة عالية للعرض)</span>
                            </label>
                            <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} accept="image/*" className="w-full text-sm font-medium mt-2 file:bg-blue-50 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-blue-600 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="col-span-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 dark:shadow-none active:scale-[0.98] mt-4 flex justify-center items-center gap-2 h-14">
                        {submitting ? "جاري الرفع والمعالجة..." : (editProductId ? "تحديث الكتاب" : "رفع الكتاب للمكتبة")}
                    </button>
                </form>
            </div>

            {/* جدول الكتب */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mt-10">
                <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30 dark:bg-gray-800/50">
                    <h3 className="text-xl font-black flex items-center gap-3 text-gray-800 dark:text-white">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><PackageSearch size={20} /></div>
                        أحدث الإصدارات
                    </h3>
                    <span className="text-xs font-bold text-gray-400">إجمالي الكتب بالصفحة: {products.length}</span>
                </div>

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[700px] text-right table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-bold">الغلاف</th>
                                <th className="p-5 font-bold">عنوان الكتاب</th>
                                <th className="p-5 font-bold">المجال / النوع</th>
                                <th className="p-5 font-bold">السعر</th>
                                <th className="p-5 text-center font-bold">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-20 text-center font-black text-blue-600 animate-pulse">جاري جلب البيانات...</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id || p._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="p-5">
                                        <div className="relative w-12 h-16 overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm rounded-md">
                                            <img
                                                src={getImageUrl(p.cover || p.coverUrl)}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt=""
                                                onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-gray-800 dark:text-gray-200 block max-w-[180px] truncate text-sm">
                                            {p.title}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs font-bold text-gray-500">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg block w-max mb-1">
                                            {p.category?.name || "بدون مجال"}
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg block w-max">
                                            {p.productType?.name || "عام"}
                                        </span>
                                    </td>
                                    <td className="p-5 font-black text-blue-600 whitespace-nowrap text-sm">
                                        {p.isOnSale && p.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 line-through text-xs font-normal">{(p.price / 100).toLocaleString()}</span>
                                                <span>{(p.discountPrice / 100).toLocaleString()} <span className="text-[10px]">ج.م</span></span>
                                            </div>
                                        ) : (
                                            <span>{(p.price / 100).toLocaleString()} <span className="text-[10px]">ج.م</span></span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-3 flex-wrap">
                                            <button onClick={() => editProduct(p)} className="p-2.5 bg-white dark:bg-gray-700 text-yellow-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1"><Edit size={16} /></button>
                                            <button onClick={() => deleteProduct(p.id || p._id)} className="p-2.5 bg-white dark:bg-gray-800 text-red-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* أزرار التنقل responsive */}
                <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-center items-center gap-4 sm:gap-8">
                    <button
                        onClick={() => fetchProducts(page - 1)}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl font-bold shadow-sm hover:shadow-md disabled:opacity-30 transition-all text-sm"
                    >
                        <ChevronRight size={18} />
                        السابق
                    </button>

                    <div className="font-black text-gray-800 bg-blue-100 w-10 h-10 flex items-center justify-center rounded-xl border border-blue-200 text-sm">
                        {page}
                    </div>

                    <button
                        onClick={() => fetchProducts(page + 1)}
                        disabled={page >= totalPages || loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl font-bold shadow-sm hover:shadow-md disabled:opacity-30 transition-all text-sm"
                    >
                        التالي
                        <ChevronLeft size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}