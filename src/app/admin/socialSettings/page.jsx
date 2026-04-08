"use client";
import React, { useState, useEffect } from "react";
import api from "@/app/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
    Save, Phone, Facebook, Instagram, 
    MessageCircle, Copyright, Loader2 
} from "lucide-react";

const SocialSettings = () => {
    const [formData, setFormData] = useState({
        footerText: "",
        phone: "",
        facebookLink: "",
        instagramLink: "",
        whatsappLink: ""
    });

    // 1. جلب البيانات الحالية عند فتح الصفحة
    const { data: currentSettings, isLoading } = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const res = await api.get("/settings");
            return res.data.data;
        },
        onSuccess: (data) => {
            if (data) setFormData(data);
        }
    });

    // تحديث الـ State بمجرد وصول البيانات
    useEffect(() => {
        if (currentSettings) {
            setFormData({
                footerText: currentSettings.footerText || "",
                phone: currentSettings.phone || "",
                facebookLink: currentSettings.facebookLink || "",
                instagramLink: currentSettings.instagramLink || "",
                whatsappLink: currentSettings.whatsappLink || ""
            });
        }
    }, [currentSettings]);

    // 2. Mutation لتحديث البيانات (PUT)
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            return await api.put("/settings", updatedData);
        },
        onSuccess: () => {
            toast.success("تم تحديث الإعدادات بنجاح");
        },
        onError: (err) => {
            const msg = err.response?.data?.message || "فشل التحديث، تأكد من صحة الروابط";
            toast.error(msg);
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-sky-900" size={40} />
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900">إعدادات الموقع العامة</h1>
                <p className="text-gray-500 text-sm mt-1">تعديل روابط التواصل الاجتماعي ومعلومات الفوتر</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* رقم الهاتف */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mr-1">
                            <Phone size={14} className="text-sky-600" /> رقم التواصل
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all"
                        />
                    </div>

                    {/* نص الحقوق */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mr-1">
                            <Copyright size={14} className="text-amber-600" /> نص الحقوق (Footer)
                        </label>
                        <input
                            type="text"
                            name="footerText"
                            value={formData.footerText}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all"
                        />
                    </div>

                    {/* فيسبوك */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mr-1">
                            <Facebook size={14} className="text-blue-600" /> رابط فيسبوك
                        </label>
                        <input
                            type="url"
                            name="facebookLink"
                            value={formData.facebookLink}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all text-left"
                            dir="ltr"
                        />
                    </div>

                    {/* انستجرام */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mr-1">
                            <Instagram size={14} className="text-pink-600" /> رابط انستجرام
                        </label>
                        <input
                            type="url"
                            name="instagramLink"
                            value={formData.instagramLink}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all text-left"
                            dir="ltr"
                        />
                    </div>

                    {/* واتساب */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mr-1">
                            <MessageCircle size={14} className="text-emerald-600" /> رابط واتساب
                        </label>
                        <input
                            type="url"
                            name="whatsappLink"
                            value={formData.whatsappLink}
                            onChange={handleChange}
                            placeholder="https://wa.me/..."
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all text-left"
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={updateMutation.isLoading}
                        className="w-full md:w-max px-10 py-3.5 bg-sky-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sky-800 transition-all disabled:bg-gray-300 active:scale-95"
                    >
                        {updateMutation.isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={20} /> حفظ التعديلات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SocialSettings;