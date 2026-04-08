"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const IslamicResume = () => {
  const router = useRouter();

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* الجانب الأيمن: الصورة */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[16/11] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-50 bg-gray-100">
              <Image
                src="/imghome2.jpeg"
                alt="مؤسسة الدراسات الإسلامية"
                fill
                className="object-cover object-top" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* الجانب الأيسر: المحتوى */}
          <div className="w-full md:w-1/2 text-right">
            <div className="space-y-6">
              <span className="text-amber-600 font-bold tracking-widest text-sm uppercase block">
                تعرفوا على
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-sky-900 leading-tight">
               الدليل التجاري الاسلامي
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                صرح علمي شامخ يهتم بنشر البحوث والدراسات التأصيلية، ويهدف إلى إحياء التراث الإسلامي وتقديمه بصورة عصرية تخدم الباحثين.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => router.push("/islamic-business-directory")}
                  className="inline-flex items-center gap-3 py-4 px-10 bg-sky-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg group"
                >
                  المزيد عن المؤسسة
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

export default IslamicResume;