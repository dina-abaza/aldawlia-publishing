import React from 'react';
import { MotionScroll, FadeInItem } from "@/app/(library)/components/motionScroll";

export const dynamic = 'force-static';

export default function CompactOfficialAboutPage() {
    return (
        <div className="bg-white text-right font-sans leading-relaxed text-gray-800 overflow-hidden" dir="rtl">

            {/* 1. Header & Official Identity */}
            <section
                className="w-full py-12 px-8 text-white border-b-[6px]"
                style={{
                    backgroundColor: '#0c4a6e',
                    backgroundImage: 'linear-gradient(to left, #0c4a6e, #075985)',
                    borderColor: '#d97706'
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
                    <FadeInItem>
                        <h1 className="text-3xl md:text-5xl font-black mb-1 text-white">
                            الدار الدولية للتوزيع والنشر
                        </h1>
                    </FadeInItem>

                    <FadeInItem delay={0.2}>
                        <div className="bg-sky-800 bg-opacity-70 inline-block px-6 py-3 rounded-lg border border-sky-600 shadow-sm">
                            <p className="text-xl md:text-2xl font-bold italic text-white tracking-wide">
                                "أفاق نحو الخلود ... علم بلا قيود... أفكار بلا حدود"!
                            </p>
                        </div>
                    </FadeInItem>

                    <FadeInItem delay={0.4} className="max-w-4xl mt-6 text-base md:text-lg leading-relaxed text-gray-100 flex flex-col gap-2">
                        <p className="font-bold text-amber-600 text-xl mb-2">حيث تتحول الأفكار إلى كتب، والكتب إلى رحلات ملهمة للعقول والقلوب.</p>
                        <p>نؤلف، ننشر، نوزع – لنصل برسالتك إلى كل قارئ في كل مكان.</p>
                        <p>✨ من الإبداع الأدبي إلى الدراسات العلمية والاستراتيجية، نحن رُواد في صناعة المعرفة.</p>
                        <p>📖 معنا، كتابك ليس مجرد صفحات، بل نافذة تضيء العقول.</p>
                        <p>🤝 ندعم المؤلفين، نرتقي بالأفكار، ونقدم محتوى يثري المجتمع.</p>
                        <p className="font-bold mt-2">🚀 تابعنا الآن وكن جزءاً من عالم الإبداع والمعرفة بلا حدود.</p>
                    </FadeInItem>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* 2. Who We Are */}
                <FadeInItem className="mb-14">
                    <h3 className="text-3xl font-bold text-sky-900 mb-8 border-r-8 border-amber-600 pr-4">من نحن (Who We Are)</h3>
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-6">
                        <p className="text-lg md:text-xl leading-relaxed text-gray-800">
                            تأسست <span className="font-bold text-sky-800">الدار الدولية للنشر والتوزيع عام 1987</span> بولاية نيوجيرسي، وتعتبر من أوائل الدور العربية والإسلامية في الولايات المتحدة الأمريكية ولها حوالي ما يقرب من <span className="font-bold text-amber-600">200 كتاب</span> في جميع مجالات النشر سواء الإسلامية أو الأدبية أو السياسية أو مقارنة الأديان وكذلك كتب الأطفال باللغة العربية والإنجليزية والإسبانية.
                        </p>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-800">
                            ومن أشهر إصداراتها <span className="font-bold text-sky-900 underline decoration-amber-600 decoration-2 underline-offset-4">الدليل التجاري الإسلامي</span> الذي يصدر في شرق الولايات المتحدة منذ عام 1990 وحتى 2025.
                        </p>

                        <div className="mt-4 pt-6 flex flex-wrap gap-6 text-base font-bold border-t-2 border-gray-200">
                            <p className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-gray-700">📍 USA - NY – JN</p>
                            <p className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-gray-700">☎ 201-705-9422</p>
                            <p className="bg-sky-100 p-3 rounded-xl border border-sky-200 shadow-sm text-sky-800">✉ contact@aldawlia-publishing.com</p>
                            <p className="bg-sky-100 p-3 rounded-xl border border-sky-200 shadow-sm text-sky-800">✉ intpbhouse@gmail.com</p>
                        </div>
                    </div>
                </FadeInItem>

                {/* 3. Institutional Structure */}
                <section className="mb-14">
                    <FadeInItem className="text-center mb-10">
                        <h3 className="text-4xl font-black text-sky-900 mb-3">المؤسسة الأم: الدار الدولية للتوزيع</h3>
                        <p className="text-lg md:text-xl text-amber-600 font-bold tracking-widest">International House for Publishing & Strategic Studies</p>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mt-6 rounded-full"></div>
                    </FadeInItem>

                    <MotionScroll className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-white border text-center border-gray-200 p-8 rounded-3xl shadow-sm border-t-8 border-t-sky-800">
                            <div className="bg-sky-100 text-sky-900 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black mx-auto mb-6">1</div>
                            <h5 className="font-bold text-sky-900 text-2xl mb-4">الدار الدولية للنشر والتوزيع</h5>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">نشر الكتب والدراسات (سياسة، حضارة، فلسفة، جغرافيا سياسية، مستقبلية، أدب).</p>
                        </div>

                        <div className="bg-white border text-center border-gray-200 p-8 rounded-3xl shadow-sm border-t-8 border-t-sky-800">
                            <div className="bg-sky-100 text-sky-900 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black mx-auto mb-6">2</div>
                            <h5 className="font-bold text-sky-900 text-2xl mb-4">مؤسسة دراسات الجدوى</h5>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">دراسات اقتصادية، تحليل سوق، تقييم مشاريع، استشارات استثمارية.</p>
                        </div>

                        <div className="bg-sky-900 border text-center border-sky-800 p-8 rounded-3xl shadow-lg border-b-8 border-b-amber-600">
                            <div className="bg-white text-sky-900 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black mx-auto mb-6 shadow-md border-2 border-amber-600">3</div>
                            <h5 className="font-bold text-white text-2xl mb-2">معهد الحكمة للدراسات (IWI)</h5>
                            <p className="font-bold text-amber-600 italic mb-4 text-lg">"قلب المؤسسة الفكري"</p>
                            <p className="text-base text-gray-200 leading-relaxed">الجغرافيا السياسية، النظام الدولي، الأمن الاستراتيجي، ومستقبل النظام العالمي.</p>
                        </div>
                    </MotionScroll>
                </section>

                {/* 4. Research Units */}
                <FadeInItem className="mb-14 p-8 bg-sky-50 rounded-[2rem] border border-sky-100 shadow-sm">
                    <h4 className="text-2xl font-bold text-sky-900 mb-8 border-r-4 border-amber-600 pr-4">وحدات استراتيجية إضافية</h4>
                    <MotionScroll className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lg font-bold">
                        {["وحدة الدراسات الجيوسياسية", "وحدة الدراسات المستقبلية", "وحدة تحليل الصراعات", "وحدة الأمن الاستراتيجي"].map((unit, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl flex items-center justify-center text-center shadow-sm border border-gray-100 text-sky-900 h-full">
                                {unit}
                            </div>
                        ))}
                    </MotionScroll>
                </FadeInItem>

                {/* 5. Philosophy & Vision */}
                <div className="mb-14 grid lg:grid-cols-2 gap-8">
                    <FadeInItem className="p-8 bg-white border border-gray-200 rounded-3xl shadow-sm border-r-8 border-r-amber-600">
                        <h4 className="font-bold text-sky-900 text-2xl mb-4">الرسالة والرؤية</h4>
                        <p className="text-xl leading-relaxed text-gray-700">إنتاج معرفة استراتيجية رصينة لتصبح الدار منصة فكرية دولية رائدة تربط القلوب بالعقول.</p>
                    </FadeInItem>
                    <FadeInItem className="p-8 bg-sky-900 text-white rounded-3xl shadow-lg border-2 border-sky-800">
                        <h4 className="font-bold text-amber-600 text-2xl mb-4">القيم الفكرية</h4>
                        <p className="text-xl leading-relaxed mb-2">حكمة استراتيجية | استقلال فكري | عمق تحليلي</p>
                        <p className="text-base text-gray-300 italic">نجمع بين الأصالة والحداثة في إيصال صوت الحكمة.</p>
                    </FadeInItem>
                </div>

                {/* 6. Strategic School */}
                <FadeInItem className="mb-14">
                    <div className="bg-gray-50 border border-gray-200 p-8 md:p-10 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-grow">
                            <h4 className="text-3xl font-black text-sky-900 mb-4">مدرسة الواقعية الاستراتيجية المتوازنة</h4>
                            <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium leading-relaxed">
                                منهجنا الفكري يجمع بين الجغرافيا السياسية وتحليل موازين القوى لبناء رؤية شاملة للمستقبل.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["موازين القوى", "الجغرافيا السياسية", "التحولات الكبرى", "السيناريوهات المستقبلية"].map((item, idx) => (
                                    <div key={idx} className="bg-white text-sky-800 font-bold px-4 py-3 rounded-lg border border-sky-100 shadow-sm text-center">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:flex flex-shrink-0 bg-sky-900 border-4 border-amber-600 text-white rounded-full w-32 h-32 items-center justify-center shadow-lg font-black text-3xl">
                            IWI
                        </div>
                    </div>
                </FadeInItem>

                {/* 7. Goals */}
                <section className="mb-10">
                    <FadeInItem>
                        <h4 className="text-3xl font-bold text-sky-900 mb-8 border-r-4 border-amber-600 pr-4">الأهداف الاستراتيجية المشتركة</h4>
                    </FadeInItem>
                    <MotionScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                        {[
                            "الارتقاء بصناعة النشر عالمياً.",
                            "نشر أعمال دينية وعلمية تعزز الهوية.",
                            "تمكين الكتّاب الشباب وصناعة مبدعين جدد.",
                            "توسيع دائرة التوزيع جغرافياً ورقمياً.",
                            "الجمع بين الأصالة والحداثة في المحتوى.",
                            "إثراء الفكر الاستراتيجي للباحث وصانع القرار."
                        ].map((text, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-5 rounded-xl flex items-center gap-4 shadow-sm h-full">
                                <span className="bg-sky-100 text-sky-900 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black flex-shrink-0">{i + 1}</span>
                                <p className="font-medium text-gray-800 leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </MotionScroll>
                </section>

            </main>

            {/* Footer */}
            <FadeInItem className="bg-gray-900 text-white rounded-t-[3rem] py-16 px-8 text-center mt-12">
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
                    <p className="text-2xl md:text-3xl font-black italic text-amber-600 tracking-wider leading-relaxed">
                        "الحكمة في فهم القوة... والبصيرة في استشراف المستقبل"
                    </p>
                    <div className="w-24 h-1 bg-gray-700 mx-auto my-4 rounded-full"></div>
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-gray-300 font-medium text-lg">
                        <span className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700">📍 USA - NY – JN</span>
                        <span className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700">📞 201-705-9422</span>
                    </div>
                    <div className="mt-6 text-sm text-gray-500 uppercase tracking-widest font-light">
                        © الدار الدولية للنشر والتوزيع - جميع الحقوق محفوظة
                    </div>
                </div>
            </FadeInItem>
        </div>
    );
}