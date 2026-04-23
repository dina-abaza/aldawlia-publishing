"use client";
import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const IslamicResume = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="py-10 bg-white overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Side: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[16/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-50 bg-gray-100">
              <Image
                src="/imghome2.jpeg"
                alt={t('home.islamic_resume.title')}
                fill
                className="object-cover object-top" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Side: Content */}
          <div className={`w-full md:w-1/2 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="space-y-6">
              <span className="text-amber-600 font-bold tracking-widest text-sm uppercase block">
                {t('home.islamic_resume.tag')}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-sky-900 leading-tight">
                {t('home.islamic_resume.title')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {t('home.islamic_resume.desc')}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => router.push("/islamic-business-directory")}
                  className="inline-flex items-center gap-3 py-4 px-10 bg-sky-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg group"
                >
                  {t('home.islamic_resume.cta')}
                  {isAr ? (
                    <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                  ) : (
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IslamicResume;
