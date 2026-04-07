"use client";
import React from "react";
import Link from "next/link";
import { Flame, Star, ChevronLeft } from "lucide-react";

const QuickAccessLinks = () => {
    const categories = [
        {
            id: "trending",
            title: "إصداراتنا الأكثر طلباً",
            subtitle: "اكتشف الكتب الأكثر مبيعاً ورواجاً حالياً",
            icon: <Flame size={32} className="text-orange-500 drop-shadow-md" fill="currentColor" />,
            bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
            borderColor: "border-orange-100",
            iconBg: "bg-orange-100",
            textColor: "text-orange-950",
            link: "/search?sort=trending",
            accentColor: "bg-orange-500"
        },
        {
            id: "popular",
            title: "الأكثر تفضيلاً لدى القراء",
            subtitle: "نخبة الكتب التي نالت إعجاب وتفضيل الجميع",
            icon: <Star size={32} className="text-amber-500 drop-shadow-md" fill="currentColor" />,
            bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
            borderColor: "border-amber-100",
            iconBg: "bg-amber-100",
            textColor: "text-amber-950",
            link: "/search?sort=popular",
            accentColor: "bg-amber-500"
        }
    ];

    return (
        <section className="py-12 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {categories.map((cat) => (
                        <Link 
                            key={cat.id} 
                            href={cat.link}
                            className={`group relative overflow-hidden p-8 md:p-10 rounded-[3rem] border ${cat.borderColor} ${cat.bgColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                        >
                            {/* زخرفة خلفية */}
                            <div className={`absolute -right-10 -top-10 w-40 h-40 ${cat.accentColor} opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity animate-pulse`}></div>
                            
                            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 z-10 text-center md:text-right">
                                <div className={`p-5 ${cat.iconBg} rounded-[2rem] shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                    {cat.icon}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className={`text-2xl md:text-3xl font-black ${cat.textColor} mb-3 leading-tight`}>
                                        {cat.title}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed">
                                        {cat.subtitle}
                                    </p>
                                    
                                    <div className="mt-8 flex items-center justify-center md:justify-start gap-2 group-hover:gap-4 transition-all">
                                        <span className={`h-1 w-12 ${cat.accentColor} rounded-full`}></span>
                                        <span className={`text-xs font-black uppercase tracking-widest ${cat.textColor}`}>تصفح الآن</span>
                                        <ChevronLeft size={16} className={`${cat.textColor}`} />
                                    </div>
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
