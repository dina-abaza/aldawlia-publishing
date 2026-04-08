"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HikmaResume = () => {
  const router = useRouter();

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* استخدمنا md:flex-row عشان الصورة يمين والكلام شمال في الشاشات الكبيرة */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* الجانب الأيمن: الصورة */}
          <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
            <div className="relative h-[300px] md:h-[450px] w-full max-w-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-50">
              <Image
                src="/imghome.jpg"
                alt="دار الحكمة الدولي"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* الجانب الأيسر: المحتوى */}
          <div className="w-full md:w-1/2 text-right order-2 md:order-1">
            <div className="space-y-6">
              <span className="text-amber-600 font-bold tracking-widest text-sm uppercase block mb-2">
                مرحباً بكم في
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-sky-900 leading-tight">
                معهد الحكمة الدولي
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                نحن في دار الحكمة نسعى لتوفير بيئة تعليمية وثقافية رائدة، حيث نمزج بين الأصالة والتطور لتقديم أفضل الإصدارات العلمية والأدبية التي تساهم في بناء جيل مثقف وواعٍ.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => router.push("/hikma-institute")}
                  className="inline-flex items-center gap-3 py-4 px-10 bg-sky-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-100 group"
                >
                  اعرف المزيد
                  <ArrowRight size={20} className="group-hover:-translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HikmaResume;