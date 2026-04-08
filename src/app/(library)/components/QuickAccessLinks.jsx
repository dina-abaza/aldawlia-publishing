"use client";
import React from "react";
import Link from "next/link";
import { Flame, Star, Tag, ChevronLeft } from "lucide-react";

const QuickAccessLinks = () => {
    const categories = [
        {
            id: "trending",
            title: "الأكثر طلباً",
            subtitle: "اكتشف الكتب الأكثر مبيعاً ورواجاً حالياً في دار الحكمة",
            icon: <Flame size={28} className="text-amber-600" fill="currentColor" />,
            bgColor: "bg-gradient-to-br from-slate-50 to-amber-50/20",
            borderColor: "border-slate-100",
            iconBg: "bg-amber-100/50",
            textColor: "text-sky-950",
            // الروابط الأصلية اللي كانت عندك في المشروع
            link: "/trending-books",
            accentColor: "bg-amber-600"
        },
        {
            id: "popular",
            title: "الأكثر تفضيلاً",
            subtitle: "نخبة الكتب التي نالت إعجاب وتفضيل القراء لدينا",
            icon: <Star size={28} className="text-amber-600" fill="currentColor" />,
            bgColor: "bg-gradient-to-br from-slate-50 to-amber-50/20",
            borderColor: "border-slate-100",
            iconBg: "bg-amber-100/50",
            textColor: "text-sky-950",
            // الروابط الأصلية اللي كانت عندك في المشروع
            link: "/popular-books",
            accentColor: "bg-amber-600"
        },
        {
            id: "offers",
            title: "عروض مميزة",
            subtitle: "خصومات حصرية وإصدارات خاصة بأسعار تنافسية",
            icon: <Tag size={28} className="text-amber-600" fill="currentColor" />,
            bgColor: "bg-gradient-to-br from-slate-50 to-amber-50/20",
            borderColor: "border-slate-100",
            iconBg: "bg-amber-100/50",
            textColor: "text-sky-950",
            // الروابط الأصلية اللي كانت عندك في المشروع
            link: "/offers",
            accentColor: "bg-amber-600"
        }
    ];

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-sky-900">اكتشف مكتبتنا</h2>
                    <div className="w-16 h-1 bg-amber-600 mx-auto mt-3 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className={`group relative overflow-hidden p-5 md:p-6 rounded-[2rem] border ${cat.borderColor} ${cat.bgColor} shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5`}
                        >
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className={`mb-4 p-4 ${cat.iconBg} rounded-2xl group-hover:scale-105 group-hover:bg-amber-600 transition-all duration-500`}>
                                    {React.cloneElement(cat.icon, {
                                        className: `transition-colors duration-500 ${cat.icon.props.className} group-hover:text-white`
                                    })}
                                </div>

                                <h3 className={`text-xl font-black ${cat.textColor} mb-2 group-hover:text-amber-600 transition-colors`}>
                                    {cat.title}
                                </h3>

                                <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed mb-6 line-clamp-2">
                                    {cat.subtitle}
                                </p>

                                <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-900 text-white group-hover:bg-amber-600 transition-all duration-300 shadow-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">اعرف المزيد</span>
                                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(QuickAccessLinks);