import React from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Check, Shield, Globe, Map, BarChart, 
    BookOpen, Layers, Target, Compass, Zap 
} from "lucide-react";
// استيراد الـ Wrappers اللي فيها use client داخلياً
import { MotionScroll, FadeInItem } from "@/app/(library)/components/motionScroll";

export default function AlhekmaInstitutePage() {
    return (
        <div className="bg-white text-right font-sans leading-relaxed text-gray-800" dir="rtl">

            {/* 1. Header & Official Identity */}
            <header
                className="w-full py-10 px-8 text-white border-b-[6px]"
                style={{
                    backgroundColor: '#0c4a6e',
                    backgroundImage: 'linear-gradient(to left, #0c4a6e, #075985)',
                    borderColor: '#d97706'
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
                    <Link 
                        href="/" 
                        className="absolute top-0 right-0 flex items-center gap-2 text-amber-500 hover:text-white transition-colors group mb-4 md:mb-0"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>العودة للموقع</span>
                    </Link>

                    <FadeInItem className="flex-shrink-0 mt-8 md:mt-0">
                        <img
                            src="/logo-instatute.png"
                            alt="لوجو معهد الحكمة"
                            className="w-24 h-24 md:w-36 md:h-36 object-contain bg-white p-2 rounded-2xl shadow-lg border-2 border-amber-600"
                        />
                    </FadeInItem>

                    <FadeInItem delay={0.2} className="text-right flex-grow">
                        <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">معهد الحكمة الدولي للدراسات الاستراتيجية</h1>
                        <p className="text-xl md:text-2xl font-bold tracking-widest mb-4 uppercase text-amber-600">International Wisdom Institute (IWI)</p>
                        
                        <div className="bg-sky-800 bg-opacity-70 inline-block px-5 py-2 rounded-lg border border-sky-600 mb-6">
                            <p className="text-xl md:text-2xl font-bold italic text-white">"حكمة الرؤية.. قوة التحليل"</p>
                        </div>

                        <div className="text-base opacity-95 leading-relaxed text-white">
                            <p className="font-bold text-amber-500 mb-1">الهوية المؤسسية الجديدة:</p>
                            <p>الاسم الرسمي: International Wisdom Institute (IWI)</p>
                            <p>التبعية القانونية: جناح الدراسات والأبحاث لشركة International House for Distribution LLC</p>
                        </div>
                    </FadeInItem>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* 2. The Core Idea */}
                <FadeInItem className="mb-12">
                    <h3 className="text-3xl font-bold text-sky-900 mb-6 border-r-8 border-amber-600 pr-4">أولًا: الفكرة الأساسية للمعهد (The Core Idea)</h3>
                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <p className="text-lg md:text-xl leading-relaxed mb-8">
                            يقوم المعهد على دراسة التحولات العالمية في السياسة والاستراتيجية والجغرافيا السياسية، مع التركيز على فهم توازنات القوة الدولية وصياغة رؤى فكرية تساعد على قراءة المستقبل.
                        </p>
                        <p className="font-bold text-sky-800 mb-6 text-center text-lg md:text-xl font-sans">يركز المعهد على الجمع بين:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {["الحكمة الفكرية", "التحليل الاستراتيجي", "قراءة التحولات الجيوسياسية"].map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-white p-6 rounded-2xl shadow-md font-bold text-center border-b-4 border-sky-600 text-sky-900 text-lg hover:-translate-y-2 transition-transform duration-300"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-center italic text-gray-500 text-lg">من أجل تقديم رؤى عميقة تساعد الباحثين وصناع القرار والمجتمعات على فهم العالم المتغير.</p>
                    </div>
                </FadeInItem>

                {/* 3. Vision, Mission, Values & About */}
                <section className="mb-12 grid lg:grid-cols-2 gap-8">
                    <FadeInItem className="space-y-8">
                        <div className="p-6 bg-sky-50 rounded-2xl border-r-4 border-sky-900 shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4 flex items-center gap-3">
                                <Compass className="text-amber-600" /> التعريف بالمعهد
                            </h4>
                            <p className="text-lg leading-relaxed">معهد الحكمة الدولية (IWI) هو مركز فكري مستقل يعنى بالدراسات الاستراتيجية والجيوسياسية، ويهدف إلى فهم التحولات الكبرى في النظام الدولي وتحليل ديناميات القوة.</p>
                        </div>
                        <div className="p-6 bg-white border border-sky-200 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4 flex items-center gap-3">
                                <Target className="text-amber-600" /> الرؤية (Vision)
                            </h4>
                            <p className="text-lg leading-relaxed">منصة فكرية دولية رائدة تسهم في بناء فهم أعمق للتحولات العالمية وصياغة رؤى مستقبلية متوازنة.</p>
                        </div>
                    </FadeInItem>
                    
                    <FadeInItem delay={0.2} className="space-y-8">
                        <div className="p-6 bg-sky-900 text-white rounded-2xl shadow-lg border-l-8 border-amber-600">
                            <h4 className="font-bold text-amber-500 text-2xl mb-4">الرسالة (Mission)</h4>
                            <p className="text-lg leading-relaxed">تقديم دراسات وتحليلات استراتيجية عالية المستوى حول القضايا الدولية والجيوسياسية، وتعزيز ثقافة التفكير الاستراتيجي.</p>
                        </div>
                        <div className="p-6 bg-sky-50 rounded-2xl border-2 border-amber-600 shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4">القيم الأساسية</h4>
                            <p className="text-lg font-bold text-sky-800 leading-relaxed">
                                الاستقلال الفكري | الموضوعية العلمية | التفكير الاستراتيجي | الحكمة في التحليل
                            </p>
                        </div>
                    </FadeInItem>
                </section>

                {/* 4. Strategic Objectives */}
                <FadeInItem className="mb-12">
                    <h4 className="text-3xl font-bold text-sky-900 mb-8 border-r-4 border-amber-600 pr-4">الأهداف الاستراتيجية</h4>
                    <MotionScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                        {[
                            "تطوير الدراسات الاستراتيجية والجيوسياسية.",
                            "تحليل التحولات في النظام الدولي وموازين القوة.",
                            "تقديم رؤى لفهم الصراعات والتحالفات الدولية.",
                            "دعم الحوار الفكري حول مستقبل العلاقات الدولية.",
                            "إنتاج بحوث ودراسات تخدم صناع القرار.",
                            "بناء شبكة دولية من الباحثين والمفكرين."
                        ].map((text, i) => (
                            <div 
                                key={i} 
                                className="bg-white border border-gray-200 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <span className="bg-sky-100 text-sky-900 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black group-hover:bg-amber-600 group-hover:text-white transition-colors">{i + 1}</span>
                                <p className="font-medium leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </MotionScroll>
                </FadeInItem>

                {/* 5. Research Departments */}
                <FadeInItem className="mb-12 py-12 px-6 md:px-10 bg-white border border-gray-200 rounded-[3rem] shadow-sm">
                    <h3 className="text-3xl font-black text-sky-900 mb-12 text-center underline decoration-amber-600 underline-offset-8">الأقسام البحثية للمعهد</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Dept 1 */}
                        <div className="bg-gray-50 p-6 rounded-3xl border-t-8 border-sky-900 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">1️⃣ قسم الدراسات الجيوسياسية</h5>
                            <p className="text-sm text-gray-500 mb-6 italic leading-relaxed">دراسة تأثير الجغرافيا في تشكيل السياسات الدولية وتوازنات القوة.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> تحليل التوازنات الجيوسياسية</li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> دراسة مناطق النفوذ والصراع</li>
                            </ul>
                        </div>
                        {/* Dept 2 */}
                        <div className="bg-gray-50 p-6 rounded-3xl border-t-8 border-sky-900 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">2️⃣ قسم الدراسات الاستراتيجية</h5>
                            <p className="text-sm text-gray-500 mb-6 italic leading-relaxed">تحليل الاستراتيجيات الدولية والعسكرية والسياسية للدول الكبرى.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> تحليل الاستراتيجيات الدولية</li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> تقييم سياسات الأمن القومي</li>
                            </ul>
                        </div>
                        {/* Dept 3 */}
                        <div className="bg-gray-50 p-6 rounded-3xl border-t-8 border-sky-900 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">3️⃣ قسم دراسات النظام الدولي</h5>
                            <p className="text-sm text-gray-500 mb-6 italic leading-relaxed">دراسة تطور النظام الدولي وتحولات القوة بين الأقطاب.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> دراسة النظام الدولي المعاصر</li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> تحليل صعود وسقوط القوى الكبرى</li>
                            </ul>
                        </div>
                    </div>
                </FadeInItem>

                {/* 6. Institutional Structure */}
                <FadeInItem className="mb-4 bg-gray-900 text-white py-12 px-6 md:px-10 rounded-[3rem] shadow-2xl">
                    <h4 className="text-3xl font-bold text-amber-500 mb-10 text-center uppercase tracking-wider">الهيكل المؤسسي</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            "مجلس الأمناء", "المجلس العلمي", "المدير التنفيذي", "المجلس الاستشاري الدولي",
                            "هيئة الباحثين", "مجلة المعهد العلمية", "سلسلة الإصدارات", "مركز التدريب"
                        ].map((name, i) => (
                            <span 
                                key={i} 
                                className="bg-sky-900 px-6 py-4 rounded-xl text-base md:text-lg font-bold border border-sky-600 shadow-md hover:bg-amber-600 transition-colors duration-300"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                    <p className="mt-12 text-center text-xl md:text-2xl font-black italic text-amber-500 tracking-widest">"حكمة الرؤية.. قوة التحليل"</p>
                </FadeInItem>

            </main>

            {/* Footer Branding */}
            <footer className="bg-sky-950 text-white py-16 px-8 text-center border-t-8 border-amber-600">
                <FadeInItem className="max-w-4xl mx-auto">
                    <h5 className="text-2xl md:text-3xl font-black mb-3 tracking-widest uppercase">INTERNATIONAL WISDOM INSTITUTE (IWI)</h5>
                    <p className="text-base md:text-lg opacity-80 italic mb-8 tracking-[0.2em] text-amber-500">Strategic & Geopolitical Studies</p>
                    <div className="w-24 h-1 bg-amber-600 mx-auto mb-8 rounded-full"></div>
                    <div className="text-sm opacity-75 leading-relaxed">
                        جناح الدراسات والأبحاث لشركة International House for Distribution LLC © 2026
                        <br />
                        جميع الحقوق محفوظة لمعهد الحكمة الدولي
                    </div>
                </FadeInItem>
            </footer>
        </div>
    );
}