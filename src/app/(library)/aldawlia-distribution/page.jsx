import React from "react";
import { 
  BarChart3, Lightbulb, Target, CheckCircle2, 
  ArrowLeft, Gem, Presentation, TrendingUp
} from "lucide-react";
import Link from "next/link";
// استيراد الكومبوننتس الجديدة اللي عملتيها
import { MotionScroll, FadeInItem } from "@/app/(library)/components/motionScroll";

export const dynamic = 'force-static';

const AldawliaDistributionPage = () => {
  // بيانات التواصل
  const whatsappLink = `https://wa.me/12017059422`;

  return (
    <div className="bg-white min-h-screen font-sans text-right text-gray-800 pb-24" dir="rtl">
      
      {/* 1. Hero Section */}
      <div className="relative bg-sky-950 py-20 border-b border-sky-900 shadow-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <FadeInItem>
            <Link 
              href="/"
              className="flex items-center gap-2 text-amber-500 mb-12 font-bold hover:text-white transition-colors group w-fit"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>العودة للرئيسية</span>
            </Link>
          </FadeInItem>
          
          <div className="space-y-4 pt-2">
            <FadeInItem delay={0.2} className="text-amber-600 font-black text-xl flex items-center gap-2 justify-start mb-2">
               <Gem size={20} /> فقرات خاصة بالدار الدولية للنشر والتوزيع
            </FadeInItem>
            
            <FadeInItem delay={0.3}>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                 دراسات الجدوى الاستراتيجية
              </h1>
            </FadeInItem>
            
            <FadeInItem delay={0.4}>
              <h2 className="text-2xl text-white pt-4 leading-relaxed max-w-3xl mr-0">
                 المؤسسة الدولية: نساعدك على تحويل فكرتك إلى مشروع واقعي ناجح بخطوات مدروسة.
              </h2>
            </FadeInItem>
          </div>

          <div className="absolute top-0 left-0 w-64 h-64 bg-sky-900 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-20">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <FadeInItem className="space-y-6">
            <Presentation className="text-sky-800" size={40} />
            <p className="text-2xl font-semibold leading-relaxed text-gray-800">
              نعتمد على دراسات دقيقة وتحليل شامل للسوق، لضمان اتخاذ قرارات مدروسة مبنية على حقائق وأرقام.
            </p>
          </FadeInItem>
          
          <FadeInItem delay={0.2} className="bg-sky-50 p-8 rounded-3xl border border-sky-100 shadow-inner flex flex-col justify-center gap-4 text-sky-950">
              <TrendingUp className="text-amber-600" size={40} />
              <p className="text-2xl font-black italic text-sky-900 leading-tight">
                حوّل فكرتك إلى مشروع ناجح، نقدم لك دراسة شاملة تساعدك على اتخاذ القرار الصحيح في الوقت المناسب.
              </p>
          </FadeInItem>
        </div>

        {/* Vision Section */}
        <FadeInItem className="bg-sky-900 p-10 md:p-14 rounded-[3rem] shadow-xl relative overflow-hidden text-white">
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-4 border-b border-white/10 pb-6">
              <span className="text-5xl">📊</span>
              <h3 className="text-3xl font-black text-amber-500 text-center md:text-right">المؤسسة الدولية لدراسات الجدوى</h3>
            </div>
            
            <p className="text-xl leading-relaxed font-medium text-sky-100 pr-6 border-r-4 border-amber-500">
              في عالم سريع التغيّر مثل <span className="text-amber-400 font-bold hover:underline">New York City</span> و<span className="text-amber-400 font-bold hover:underline">New Jersey</span>، لم يعد النجاح في المشاريع قائمًا على الحماس فقط… بل على التخطيط الدقيق، التحليل الذكي، واتخاذ القرار الصحيح.
            </p>
          </div>
        </FadeInItem>

        {/* Importance & Offering Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Why it's important */}
          <FadeInItem className="bg-white p-8 rounded-3xl border border-gray-100 space-y-8 shadow-lg hover:border-sky-100 transition-colors">
            <h4 className="text-2xl font-bold text-sky-950 underline flex items-center gap-3 decoration-amber-500 decoration-2 underline-offset-4">
              <Lightbulb size={28} className="text-amber-500" /> لماذا دراسات الجدوى مهمة؟
            </h4>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">كثير من المشاريع تبدأ بفكرة رائعة… لكنها تفشل بسبب غياب الرؤية الواضحة. دراسة الجدوى هي خريطة طريق متكاملة تساعدك على فهم:</p>
            
            <MotionScroll className="grid grid-cols-1 gap-4 text-xl font-bold pr-2 text-sky-900">
              {[
                "هل مشروعك قابل للنجاح؟", 
                "كم تحتاج من رأس المال؟", 
                "ما حجم الأرباح المتوقعة؟", 
                "من هم المنافسون؟", 
                "وما هي المخاطر المحتملة?"
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 bg-sky-50 p-4 rounded-xl border border-sky-100 hover:bg-white transition-all"
                >
                  <CheckCircle2 className="text-amber-600 shrink-0" size={24} /> 
                  <span>{item}</span>
                </div>
              ))}
            </MotionScroll>
          </FadeInItem>

          {/* What we offer */}
          <FadeInItem className="space-y-8">
            <h4 className="text-2xl font-bold text-sky-950 underline flex items-center gap-3 decoration-amber-500 decoration-2 underline-offset-4">
              <Target size={28} className="text-amber-500" /> ماذا نقدم لك؟
            </h4>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">نحن لا نقدم مجرد تقرير… بل نقدم رؤية استراتيجية متكاملة تشمل:</p>
            <MotionScroll className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { t: "دراسة السوق", d: "تحليل شامل للسوق المستهدف، الطلب، والعملاء." },
                { t: "الدراسة المالية", d: "التكاليف، الإيرادات، الأرباح، وتحليل نقطة التعادل." },
                { t: "الدراسة التشغيلية", d: "خطة واضحة للموارد البشرية، المعدات، وآلية العمل." },
                { t: "تحليل المخاطر", d: "تحديد التحديات المحتملة ووضع حلول عملية لتفاديها." }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:border-sky-200 transition-all"
                >
                  <p className="font-black text-sky-900 text-lg mb-1.5 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-amber-600" /> {item.t}
                  </p>
                  <p className="text-gray-600 text-sm opacity-90 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </MotionScroll>
          </FadeInItem>
        </div>

        {/* Message to Entrepreneur */}
        <FadeInItem className="mt-24 text-center p-10 md:p-16 bg-sky-50 rounded-[3rem] text-sky-950 shadow-inner border border-sky-100 relative overflow-hidden group">
          <div className="relative z-10 space-y-5">
            <p className="text-4xl font-black mb-3 flex items-center gap-3 justify-center">✨ رسالتنا لك</p>
            <p className="text-3xl font-extrabold italic leading-tight max-w-4xl mx-auto text-sky-900">
              لا تبدأ مشروعك بالحدس فقط… ابدأه بعلم، وخطة، ورؤية واضحة تضمن لك النجاح في قلب نيويورك ونيوجرسي.
            </p>
          </div>
        </FadeInItem>

        {/* Final CTA Card */}
        <FadeInItem className="bg-sky-950 p-12 rounded-[3rem] border border-sky-900 text-center space-y-8 shadow-2xl mt-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-900 rounded-full blur-[70px] opacity-50"></div>

            <p className="text-4xl font-black text-amber-400 relative z-10 leading-tight">جاهز لتحويل فكرتك لمشروع ناجح؟</p>
            <p className="text-xl text-sky-100 font-medium relative z-10 opacity-90 max-w-2xl mx-auto">تواصل معنا الآن لمناقشة فكرتك وبدء دراسة الجدوى الخاصة بك مع خبرائنا في السوق الأمريكي.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-5 relative z-10">
                <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-amber-500 text-sky-950 px-12 py-5 rounded-full shadow-lg hover:bg-white transition-all text-2xl font-black tracking-tighter"
                >
                    <BarChart3 size={28} /> تواصل لبدء الدراسة
                </a>
                <Link 
                    href="/about" 
                    className="text-amber-400 font-bold text-lg hover:text-white underline underline-offset-4 decoration-amber-300"
                >
                    تعرف على المزيد عنا
                </Link>
            </div>
        </FadeInItem>

      </div>
    </div>
  );
};

export default AldawliaDistributionPage;