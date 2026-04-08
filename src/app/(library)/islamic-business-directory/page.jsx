"use client";
import React from "react";
import { 
  Phone, BarChart3, Truck, Mail, ArrowLeft, Globe, 
  CheckCircle2, Lightbulb, Target, ShieldCheck, Users, 
  Calendar, MapPin, Building2, Award, Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const contactNumber = "201-705-9422";
const whatsappLink = `https://wa.me/12017059422`;

const IslamicDirectoryPage = () => {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen font-sans text-right" dir="rtl">
      {/* 1. Hero Section */}
      <div className="relative bg-gradient-to-r from-sky-900 to-sky-800 py-16 overflow-hidden group">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-amber-500 mb-8 font-bold hover:text-white transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> العودة
          </button>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">الدليل التجاري الإسلامي</h1>
            <h2 className="text-2xl md:text-4xl font-bold text-amber-500 mb-6">دليلك لأعمال موثوقة من مجتمعك</h2>
            <p className="text-sky-100 text-xl md:text-2xl font-medium mb-10 leading-relaxed">اكتشف أفضل الخدمات والمهن من العرب والمسلمين في منطقتك.</p>

            <a href={whatsappLink} target="_blank" className="inline-flex items-center gap-5 bg-white text-sky-900 p-1 rounded-2xl pr-6 shadow-2xl hover:bg-amber-500 hover:text-white transition-all group">
              <span className="text-xl font-black tracking-wider group-hover:scale-105 transition-transform">{contactNumber}</span>
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Phone size={28} />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 2. About Section - السكشن اللي عالجنا فيه مشكلة الفراغ */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* الجانب الأيمن: المحتوى العربي التفصيلي (7 أعمدة) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-sky-900 border-r-8 border-amber-600 pr-6 uppercase leading-none">
                عن الدليل التجاري الإسلامي
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-800 text-lg md:text-xl leading-relaxed font-bold">
              <div className="flex gap-4 items-start bg-sky-50/50 p-6 rounded-3xl border border-sky-100 shadow-sm">
                <Building2 className="text-sky-900 shrink-0 mt-1" size={32} />
                <p>يصدر الدليل برعاية كلاً من المركز الإسلامي في بيردج بروكلين نيويورك والدار الدولية للنشر والتوزيع بنيوجرسي.</p>
              </div>
              
              <div className="flex gap-4 items-start p-2">
                <MapPin className="text-amber-600 shrink-0 mt-1" size={28} />
                <p>الدليل التجاري الإسلامي يغطي شرق الولايات المتحدة بالكامل.</p>
              </div>

              <div className="flex gap-4 items-start p-2">
                <CheckCircle2 className="text-green-600 shrink-0 mt-1" size={28} />
                <p>يوزع الدليل مجاناً علي المحلات العربية والإسلامية وعلي المراكز والمؤسسات الإسلامية.</p>
              </div>

              <div className="flex gap-4 items-start p-2">
                <Calendar className="text-sky-900 shrink-0 mt-1" size={28} />
                <p>يصدر الدليل بشكل سنوي منتظم.</p>
              </div>

              <div className="flex gap-4 items-start p-2">
                <Award className="text-amber-600 shrink-0 mt-1" size={28} />
                <p>أول عدد صدر من الدليل كان عام 1990 ومازال يصدر إلي الآن 2026.</p>
              </div>
            </div>

            <div className="bg-sky-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-2xl font-black">لو لديك أي سؤال لا تتردد أن تتصل بنا:</p>
              <a href={whatsappLink} target="_blank" className="bg-amber-500 text-sky-900 px-8 py-4 rounded-2xl font-black text-2xl shadow-lg hover:bg-white transition-colors">
                {contactNumber}
              </a>
            </div>
          </div>

          {/* الجانب الأيسر: ملء الفراغ بالمحتوى الإنجليزي والصورة (5 أعمدة) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-amber-500/20 rounded-[3rem] blur-xl group-hover:bg-amber-500/30 transition-all"></div>
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="/imghome2.jpeg" 
                  alt="Muslim Business Directory Cover" 
                  fill 
                  className="object-cover" 
                  priority 
                />
              </div>
            </div>

            {/* سكشن المحتوى الإنجليزي لملء المساحة بشكل احترافي */}
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200 text-left font-medium" dir="ltr">
              <h3 className="text-2xl font-black text-sky-900 mb-6 border-l-4 border-amber-600 pl-4 uppercase leading-none">About US</h3>
              <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
                <li>• Under the auspices of the <span className="text-sky-900 font-bold">Islamic society of Bay ridge</span> Brooklyn, NY.</li>
                <li>• Covers the <span className="text-sky-900 font-bold">East Coast</span> of the United States.</li>
                <li>• Distributed <span className="text-green-600 font-bold text-lg italic">FREE of charge</span> to shops and institutions.</li>
                <li>• Serving the community since <span className="text-amber-600 font-black">1990</span>.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Business Owner Section */}
     
<div className="bg-sky-50/50 py-16">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-black text-sky-900 mb-12 flex items-center gap-4">
      <span className="bg-amber-500 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg leading-none">🧾</span>
      صاحب عمل (Business Owner)
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {[
        { id: "1", text: "يدخل قسم الدليل" },
        { id: "2", text: "ينشئ حساب" },
        { id: "3", text: "يضيف نشاطه" },
        { id: "4", text: "يظهر في الدليل" },
        { id: "5", text: "يحصل على عملاء" }
      ].map((step) => (
        <div key={step.id} className="bg-white p-8 rounded-3xl shadow-sm border border-sky-100 text-center">
          {/* شيلنا الـ group-hover:text-white من هنا */}
          <span className="text-amber-500 block mb-3 text-3xl font-black">
            {step.id}
          </span>
          <p className="font-black text-sky-900 text-xl ">
            {step.text}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
      {/* 4. Distribution Services */}


   

      {/* 6. Footer Section - Contact Only (WhatsApp Style) */}
      <div className="py-24 text-center bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-5xl font-black text-sky-900 leading-tight">جاهز للبدء؟ تواصل معنا اليوم</h2>
          
          <div className="flex flex-col items-center gap-8 pt-6">
            <a href={whatsappLink} target="_blank" className="group flex items-center gap-6 bg-green-600 text-white px-12 py-6 rounded-[3rem] shadow-2xl hover:bg-sky-900 transition-all hover:scale-105">
              <Phone size={44} className="group-hover:rotate-12 transition-transform" />
              <span className="text-5xl font-black tracking-tighter">{contactNumber}</span>
            </a>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex items-center gap-3 text-sky-900 font-black text-xl">
                <Mail size={32} />
                <span>mbdirectoryusa@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sky-900 font-black text-xl">
                <Globe size={32} />
                <span>mbdirectory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicDirectoryPage;