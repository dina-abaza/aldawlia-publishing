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
        formData.append("price", parseFloat(form.price));
        if (form.discountPrice && form.discountPrice.toString().trim() !== "") {
            formData.append("discountPrice", parseFloat(form.discountPrice));
        }
        formData.append("isOnSale", form.isOnSale ? "true" : "false");
        formData.append("category", form.category);
        formData.append("productType", form.productType);
        formData.append("description", form.description || "");
        if (bookFile) formData.append("file", bookFile);
        if (coverFile) formData.append("cover", coverFile);

        try {
            if (editProductId) {
                const res = await api.patch(`/files/${editProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const updatedProduct = res.data.data;
                setProducts(prev => prev.map(p =>
                    (p.id || p._id) === editProductId ? updatedProduct : p
                ));
                toast.success("تم التحديث بنجاح");
            } else {
                await api.post(`/files/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("تمت إضافة الكتاب بنجاح");
                await fetchProducts(1);
            }
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || "فشل رفع الكتاب");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ title: "", price: "", discountPrice: "", isOnSale: false, category: "", productType: "", description: "" });
        setBookFile(null);
        setCoverFile(null);
        setEditProductId(null);
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = "");
    };

    const deleteProduct = async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await api.delete(`/files/${id}`);
            setProducts(prev => prev.filter(item => (item._id !== id && item.id !== id)));
            toast.success("تم الحذف بنجاح");
        } catch (err) {
            toast.error(err.response?.data?.message || "فشل الحذف");
        }
    };

    const editProduct = (product) => {
        const productId = product.id || product._id;
        setEditProductId(productId);
        setForm({
            title: product.title || "",
            price: product.price ? product.price.toString() : "",
            discountPrice: product.discountPrice ? product.discountPrice.toString() : "",
            isOnSale: product.isOnSale || false,
            category: product.category?._id || product.category || "",
            productType: product.productType?._id || product.productType || "",
            description: product.description || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-3 md:p-4 bg-blue-600 rounded-xl md:rounded-2xl shadow-lg shadow-blue-200">
                        {editProductId ? <Edit className="text-white w-5 h-5 md:w-6 md:h-6" /> : <PackageSearch className="text-white w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                    <div>
                        <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                            {editProductId ? "تعديل الكتاب" : "إضافة كتاب جديد"}
                        </h2>
                        <p className="text-gray-500 text-[10px] md:text-xs font-medium">إدارة المكتبة الإلكترونية</p>
                    </div>
                </div>
                {editProductId && (
                    <button onClick={resetForm} className="text-xs md:text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all">
                        إلغاء التعديل
                    </button>
                )}
            </div>

            {/* نموذج الإدخال */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl md:rounded-[2.5rem] shadow-xl p-5 md:p-10 border border-gray-100 dark:border-gray-700">
                <form onSubmit={submitProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    <div className="space-y-1.5 lg:col-span-3">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">عنوان الكتاب</label>
                        <input className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="أدخل اسم الكتاب..." required />
                    </div>

                    <div className="space-y-1.5 relative">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">المجال الرئيسي</label>
                        <select className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none appearance-none font-bold text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                            <option value="">اختر المجال...</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                        <Layers className="absolute left-4 top-[38px] md:top-11 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="space-y-1.5 relative">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">نوع الإصدار</label>
                        <select className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl outline-none appearance-none font-bold text-sm" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} required>
                            <option value="">اختر النوع...</option>
                            {productTypes.map((t) => (<option key={t._id} value={t._id}>{t.name}</option>))}
                        </select>
                        <Layers className="absolute left-4 top-[38px] md:top-11 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">السعر (ج.م)</label>
                        <input className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl font-bold text-sm" type="number" step="any" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150.00" required />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mr-1">السعر بعد الخصم</label>
                        <input className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl font-bold text-sm" type="number" step="any" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="100.00" />
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 md:py-0 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <input type="checkbox" id="isOnSale" checked={form.isOnSale} onChange={(e) => setForm({ ...form, isOnSale: e.target.checked })} className="w-5 h-5 md:w-6 md:h-6 rounded-lg accent-blue-600 cursor-pointer" />
                        <label htmlFor="isOnSale" className="font-black text-blue-700 dark:text-blue-400 cursor-pointer text-xs md:text-sm">تفعيل الخصم</label>
                    </div>

                    <div className="col-span-full space-y-1.5">
                        <label className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mr-1"><AlignRight size={14} /> النبذة المكتوبة</label>
                        <textarea className="w-full p-3.5 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl md:rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اكتب تفاصيل وملخص الكتاب..." />
                    </div>

                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 border-2 border-dashed border-gray-200 p-4 rounded-2xl md:rounded-3xl group hover:border-blue-400 transition-colors bg-gray-50/50 text-center">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex flex-col items-center gap-2 cursor-pointer">
                                <FileText size={24} className="text-gray-400 group-hover:text-blue-500" />
                                <span>ملف الكتاب (PDF)</span>
                                {editProductId && !bookFile && <span className="text-green-600 text-[10px] font-bold">(الملف موجود)</span>}
                                <input type="file" onChange={(e) => setBookFile(e.target.files[0])} accept=".pdf,.epub" className="hidden" />
                                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">{bookFile ? bookFile.name : "اختر ملفاً"}</span>
                            </label>
                        </div>

                        <div className="space-y-1.5 border-2 border-dashed border-gray-200 p-4 rounded-2xl md:rounded-3xl group hover:border-blue-400 transition-colors bg-gray-50/50 text-center">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex flex-col items-center gap-2 cursor-pointer">
                                <ImageIcon size={24} className="text-gray-400 group-hover:text-blue-500" />
                                <span>صورة الغلاف</span>
                                {editProductId && !coverFile && <span className="text-green-600 text-[10px] font-bold">(الغلاف موجود)</span>}
                                <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} accept="image/*" className="hidden" />
                                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">{coverFile ? coverFile.name : "اختر صورة"}</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="col-span-full py-3.5 md:py-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all shadow-lg active:scale-[0.98] mt-2 flex justify-center items-center gap-2">
                        {submitting ? "جاري المعالجة..." : (editProductId ? "تحديث الكتاب" : "رفع الكتاب للمكتبة")}
                    </button>
                </form>
            </div>

            {/* عرض الكتب */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-5 md:p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-base md:text-xl font-black flex items-center gap-2 text-gray-800 dark:text-white">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><PackageSearch size={18} /></div>
                        أحدث الإصدارات
                    </h3>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400">العدد: {products.length}</span>
                </div>

                {/* نسخة الجدول للشاشات الكبيرة */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-5 font-bold">الغلاف</th>
                                <th className="p-5 font-bold">العنوان</th>
                                <th className="p-5 font-bold">التصنيف</th>
                                <th className="p-5 font-bold">السعر</th>
                                <th className="p-5 text-center font-bold">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center font-black text-blue-600 animate-pulse">جاري التحميل...</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id || p._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-5">
                                        <div className="w-12 h-16 border border-gray-200 rounded overflow-hidden">
                                            <img src={p.coverUrl || p.cover} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }} />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-gray-800 text-sm block max-w-[250px] truncate">{p.title}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded w-max text-gray-600">{p.category?.name || "عام"}</span>
                                            <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-0.5 rounded w-max">{p.productType?.name || "رقمي"}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 font-black text-blue-600">
                                        {p.isOnSale && p.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 line-through text-[10px] font-normal">{p.price}</span>
                                                <span>{p.discountPrice} <span className="text-[8px]">ج.م</span></span>
                                            </div>
                                        ) : (
                                            <span>{p.price} <span className="text-[8px]">ج.م</span></span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => editProduct(p)} className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg border border-gray-100"><Edit size={16} /></button>
                                            <button onClick={() => deleteProduct(p.id || p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* نسخة البطاقات للموبايل */}
                <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-700">
                    {loading ? (
                        <div className="p-10 text-center font-black text-blue-600 animate-pulse">جاري التحميل...</div>
                    ) : products.map((p) => (
                        <div key={p.id || p._id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                            <div className="w-20 h-28 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <img src={p.coverUrl || p.cover} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }} />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{p.title}</h4>
                                    <div className="flex flex-wrap gap-1">
                                        <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded">{p.category?.name || "عام"}</span>
                                        <span className="bg-purple-50 text-purple-600 text-[9px] font-bold px-2 py-0.5 rounded">{p.productType?.name || "رقمي"}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="font-black text-blue-600 text-sm">
                                        {p.isOnSale && p.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 line-through text-[10px] font-normal">{p.price}</span>
                                                <span>{p.discountPrice} ج.م</span>
                                            </div>
                                        ) : (
                                            <span>{p.price} ج.م</span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => editProduct(p)} className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl active:scale-90 transition-transform"><Edit size={16} /></button>
                                        <button onClick={() => deleteProduct(p.id || p._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl active:scale-90 transition-transform"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* الترقيم */}
                <div className="p-5 bg-gray-50/50 border-t flex justify-center items-center gap-3">
                    <button onClick={() => fetchProducts(page - 1)} disabled={page === 1 || loading} className="p-2 bg-white border rounded-xl disabled:opacity-30 hover:bg-gray-100 transition-colors"><ChevronRight size={18} /></button>
                    <div className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100">{page}</div>
                    <button onClick={() => fetchProducts(page + 1)} disabled={page >= totalPages || loading} className="p-2 bg-white border rounded-xl disabled:opacity-30 hover:bg-gray-100 transition-colors"><ChevronLeft size={18} /></button>
                </div>
            </div>
        </div>
    );
}