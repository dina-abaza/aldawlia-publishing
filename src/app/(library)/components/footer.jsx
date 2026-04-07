"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, MessageCircle, Instagram, Phone, Mail, Home, Info } from 'lucide-react';
import api from "@/app/api";

/**
 * دليل المطور للباك إند:
 * لكي يعمل هذا الفوتر بشكل صحيح، يجب أن يرسل مسار (GET /settings) كائن بالهيكل التالي:
 * {
 *   "facebookLink": "https://facebook.com/your-page", (يُفضل وجود https://)
 *   "instagramLink": "https://instagram.com/your-profile", (يُفضل وجود https://)
 *   "whatsappLink": "201012345678", (أرقام فقط بدون + أو مسافات)
 *   "phone": "+201012345678", (للعرض النصي)
 *   "footerText": "نص الفوتر هنا..."
 * }
 */

const Footer = () => {
  const [settings, setSettings] = useState({
    footerText: "",
    phone: "",
    facebookLink: "",
    instagramLink: "",
    whatsappLink: "",
  });

  const contactEmail = "contact@aldawlia-publishing.com";

  // وظيفة لضمان أن الرابط خارجي ومطلق
  const formatExternalUrl = (url) => {
    if (!url || url === "#" || url === "") return "#";
    // إذا كان الرابط لا يبدأ بـ http، نقوم بإضافتها تلقائياً
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // وظيفة لتنسيق رابط الواتساب
  const formatWhatsappUrl = (number) => {
    if (!number || number === "") return "#";
    // تنظيف الرقم من أي رموز غير رقمية لضمان عمل الرابط
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        // طباعة البيانات في الكونسول لمساعدة مبرمج الباك إند في الرؤية
        console.log("DEBUG: Settings API Response ->", res.data);
        setSettings(res.data || {});
      } catch (e) {
        console.error("DEBUG: Failed to fetch settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-sky-950 border-t-8 border-amber-600 pt-12 pb-8 mt-12 shadow-2xl relative text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-right">

          {/* روابط سريعة */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-amber-600 inline-block pb-2">روابط سريعة</h3>
            <ul className="flex flex-col gap-4 items-center md:items-start font-medium whitespace-nowrap">
              <li>
                <Link href="/" className="flex items-center gap-3 hover:text-amber-600 hover:-translate-x-2 hover:font-bold hover:scale-105 transition-all duration-300">
                  <Home size={18} />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-3 hover:text-amber-600 hover:-translate-x-2 hover:font-bold hover:scale-105 transition-all duration-300">
                  <Info size={18} />
                  <span>عن الموقع</span>
                </Link>
              </li>

              {[
                { name: "معهد الحكمة الدولي", href: "/hikma-institute" },
                { name: "مؤسسة الدراسات الاستراتيجية", href: "/aldawlia-distribution" },
                { name: "الدليل التجاري الاسلامي", href: "/islamic-business-directory" }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="group flex items-center gap-3 hover:text-amber-600 hover:-translate-x-2 hover:font-bold hover:scale-105 transition-all duration-300">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل وثقة */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-amber-600 inline-block pb-2">تابعنا وتواصل معنا</h3>
            <div className="flex flex-col gap-6 items-center md:items-start">

              <div className="flex gap-4">
                <a
                  href={formatExternalUrl(settings.facebookLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
                  title="فيسبوك"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={formatExternalUrl(settings.instagramLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
                  title="إنستجرام"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={formatWhatsappUrl(settings.whatsappLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-full text-gray-700 hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
                  title="تواصل واتساب"
                >
                  <MessageCircle size={20} />
                </a>
              </div>

              {/* ايميل + فون */}
              <div className="flex flex-col gap-4 items-center md:items-start text-sm font-medium">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 hover:text-amber-600 transition-colors"
                >
                  <Mail size={16} className="text-amber-600" />
                  <span>{contactEmail}</span>
                </a>

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3 hover:text-amber-600 transition-colors"
                    dir="ltr"
                  >
                    <Phone size={16} className="text-amber-600" />
                    <span>{settings.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* عن الدار */}
          <div className="md:pl-4">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-2xl font-black tracking-wider">
                الدار <span className="text-amber-600">الدولية للنشر</span>
              </h2>
            </Link>

            <p className="text-sm leading-loose font-medium mb-6">
              منصة متخصصة في نشر وتوزيع الكتب الإلكترونية والأبحاث الاستراتيجية، نهتم بإيصال المعرفة لكل قارئ عربي بسهولة وأمان من خلال تجربة رقمية فريدة وموثوقة.
            </p>
          </div>
        </div>

        <div className="border-t border-amber-600 my-8"></div>

        <div className="text-center text-sm font-light uppercase tracking-widest flex flex-col md:flex-row justify-center items-center gap-2">
          <span>{settings.footerText || `© ${new Date().getFullYear()} الدولية للنشر.`}</span>
          <span className="hidden md:inline">|</span>
          <span>جميع الحقوق محفوظة</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;