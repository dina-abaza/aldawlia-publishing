import React from 'react';

const AlhekmaInstitutePage = () => {
    return (
        <div className="bg-white text-right font-sans leading-relaxed text-gray-800" dir="rtl">

            {/* 1. Header & Official Identity - الهوية الرسمية مع اللوجو */}
            <section className="bg-gradient-to-l from-sky-900 to-sky-800 py-8 px-8 text-white border-b-[6px] border-amber-600">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">

                    {/* مكان اللوجو المستخرج من الفايل */}
                    <div className="flex-shrink-0">
                        <img
                            src="/logo-institute.png"
                            alt="لوجو معهد الحكمة"
                            className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white p-2 rounded-2xl shadow-lg border-2 border-amber-600"
                        />
                    </div>

                    <div className="text-right flex-grow">
                        <h1 className="text-3xl md:text-4xl font-black mb-1">معهد الحكمة الدولي للدراسات الاستراتيجية</h1>
                        <p className="text-lg md:text-xl text-amber-600 font-bold tracking-widest mb-3">International Wisdom Institute (IWI)</p>

                        <div className="bg-white/10 inline-block px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                            <p className="text-xl font-bold italic">"حكمة الرؤية.. قوة التحليل"</p>
                        </div>

                        <div className="mt-4 text-[12px] opacity-80 leading-tight">
                            <p className="font-bold">الهوية المؤسسية الجديدة:</p>
                            <p>الاسم الرسمي: International Wisdom Institute (IWI)</p>
                            <p>التبعية القانونية: جناح الدراسات والأبحاث لشركة International House for Distribution LLC</p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-8 py-8">

                {/* 2. The Core Idea - الفكرة الأساسية */}
                <section className="mb-10">
                    <h3 className="text-2xl font-bold text-sky-900 mb-4 border-r-8 border-amber-600 pr-4">أولًا: الفكرة الأساسية للمعهد (The Core Idea)</h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-lg leading-relaxed mb-6">
                            يقوم المعهد على دراسة التحولات العالمية في السياسة والاستراتيجية والجغرافيا السياسية، مع التركيز على فهم توازنات القوة الدولية وصياغة رؤى فكرية تساعد على قراءة المستقبل.
                        </p>
                        <p className="font-bold text-sky-700 mb-4 text-center">يركز المعهد على الجمع بين:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-4 rounded-xl shadow-sm font-bold text-center border-b-4 border-sky-600">الحكمة الفكرية</div>
                            <div className="bg-white p-4 rounded-xl shadow-sm font-bold text-center border-b-4 border-sky-600">التحليل الاستراتيجي</div>
                            <div className="bg-white p-4 rounded-xl shadow-sm font-bold text-center border-b-4 border-sky-600">قراءة التحولات الجيوسياسية</div>
                        </div>
                        <p className="mt-6 text-center italic text-gray-500">من أجل تقديم رؤى عميقة تساعد الباحثين وصناع القرار والمجتمعات على فهم العالم المتغير.</p>
                    </div>
                </section>

                {/* 3. Vision, Mission & About - التعريف والرؤية والرسالة */}
                <section className="mb-10 grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="p-5 bg-sky-50 rounded-xl border-r-4 border-sky-900">
                            <h4 className="font-bold text-sky-900 mb-2">1️⃣ التعريف بالمعهد (About the Institute)</h4>
                            <p className="text-sm">معهد الحكمة الدولية (IWI) هو مركز فكري مستقل يعنى بالدراسات الاستراتيجية والجيوسياسية، ويهدف إلى فهم التحولات الكبرى في النظام الدولي وتحليل ديناميات القوة والتوازنات العالمية. يسعى المعهد لتقديم رؤى فكرية عميقة تساعد على تفسير التحولات السياسية والاستراتيجية.</p>
                        </div>
                        <div className="p-5 border border-sky-100 rounded-xl">
                            <h4 className="font-bold text-sky-900 mb-2">2️⃣ الرؤية (Vision)</h4>
                            <p className="text-sm">منصة فكرية دولية رائدة في الدراسات الاستراتيجية، تسهم في بناء فهم أعمق للتحولات العالمية وصياغة رؤى مستقبلية متوازنة.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-5 bg-sky-900 text-white rounded-xl">
                            <h4 className="font-bold text-amber-600 mb-2">3️⃣ الرسالة (Mission)</h4>
                            <p className="text-sm">تقديم دراسات وتحليلات استراتيجية عالية المستوى حول القضايا الدولية والجيوسياسية، وتعزيز ثقافة التفكير الاستراتيجي والحكمة السياسية.</p>
                        </div>
                        <div className="p-5 bg-amber-600/10 rounded-xl border border-amber-600">
                            <h4 className="font-bold text-sky-900 mb-2">6️⃣ القيم الأساسية (Core Values)</h4>
                            <p className="text-xs font-bold text-sky-800 tracking-wide">الاستقلال الفكري | الموضوعية العلمية | التفكير الاستراتيجي | الحكمة في التحليل | الانفتاح على الحوار العالمي</p>
                        </div>
                    </div>
                </section>

                {/* 4. Strategic Objectives - الأهداف */}
                <section className="mb-10">
                    <h4 className="text-xl font-bold text-sky-900 mb-4">4️⃣ الأهداف الاستراتيجية (Strategic Objectives)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {[
                            "تطوير الدراسات الاستراتيجية والجيوسياسية.",
                            "تحليل التحولات في النظام الدولي وموازين القوة.",
                            "تقديم رؤى لفهم الصراعات والتحالفات الدولية.",
                            "دعم الحوار الفكري حول مستقبل العلاقات الدولية.",
                            "إنتاج بحوث ودراسات تخدم صناع القرار والباحثين.",
                            "بناء شبكة دولية من الباحثين والمفكرين والخبراء."
                        ].map((text, i) => (
                            <div key={i} className="bg-white border p-3 rounded-lg flex items-center gap-3">
                                <span className="bg-sky-100 text-sky-900 w-6 h-6 flex items-center justify-center rounded-full text-xs font-black">{i + 1}</span>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Research Departments - الأقسام البحثية كاملة */}
                <section className="mb-10 py-8 bg-sky-50 rounded-3xl px-6">
                    <h3 className="text-2xl font-black text-sky-900 mb-8 text-center underline decoration-amber-600 underline-offset-8">الأقسام البحثية للمعهد</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Dept 1 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-sky-900">
                            <h5 className="font-bold text-sky-900 mb-2">1️⃣ قسم الدراسات الجيوسياسية</h5>
                            <p className="text-[11px] text-gray-500 mb-3 italic">دراسة تأثير الجغرافيا في تشكيل السياسات الدولية وتوازنات القوة.</p>
                            <ul className="text-xs space-y-1 font-medium">
                                <li>• تحليل التوازنات الجيوسياسية العالمية</li>
                                <li>• دراسة مناطق النفوذ والصراع</li>
                                <li>• تحليل التحالفات ومتابعة تحولات النظام</li>
                            </ul>
                        </div>

                        {/* Dept 2 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-sky-900">
                            <h5 className="font-bold text-sky-900 mb-2">2️⃣ قسم الدراسات الاستراتيجية</h5>
                            <p className="text-[11px] text-gray-500 mb-3 italic">تحليل الاستراتيجيات الدولية والعسكرية والسياسية للدول الكبرى.</p>
                            <ul className="text-xs space-y-1 font-medium">
                                <li>• تحليل الاستراتيجيات الدولية</li>
                                <li>• دراسة العقائد العسكرية وإدارة الصراعات</li>
                                <li>• تقييم سياسات الأمن القومي</li>
                            </ul>
                        </div>

                        {/* Dept 3 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-sky-900">
                            <h5 className="font-bold text-sky-900 mb-2">3️⃣ قسم دراسات النظام الدولي</h5>
                            <p className="text-[11px] text-gray-500 mb-3 italic">دراسة تطور النظام الدولي وتحولات القوة بين الأقطاب.</p>
                            <ul className="text-xs space-y-1 font-medium">
                                <li>• دراسة النظام الدولي المعاصر</li>
                                <li>• تحليل صعود وسقوط القوى الكبرى</li>
                                <li>• دراسة موازين القوة ومستقبل النظام</li>
                            </ul>
                        </div>

                        {/* Sub Depts */}
                        <div className="lg:col-span-3 grid md:grid-cols-4 gap-4 mt-2">
                            {[
                                { name: "الأمن الدولي", text: "الأمن الإقليمي، الإرهاب، الأمن السيبراني والطاقوي." },
                                { name: "الاقتصاد الجيوسياسي", text: "الاقتصاد السياسي، الصراعات الاقتصادية، العقوبات والموارد." },
                                { name: "الدراسات المستقبلية", text: "بناء السيناريوهات، استشراف التحولات، ودراسة مستقبل القوة." },
                                { name: "الفكر والحكمة السياسية", text: "فلسفة القوة، الفكر الاستراتيجي، والحكمة السياسية." }
                            ].map((dept, i) => (
                                <div key={i} className="bg-sky-900 text-white p-4 rounded-xl border-r-4 border-amber-600">
                                    <h6 className="font-bold text-xs mb-1 text-amber-600 underline">{dept.name}</h6>
                                    <p className="text-[10px] opacity-80 leading-tight">{dept.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Strategic Specialized Units - الوحدات المتخصصة */}
                <section className="mb-10">
                    <h4 className="text-xl font-bold text-sky-900 mb-6 border-r-4 border-amber-600 pr-3">الوحدات الاستراتيجية المتخصصة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h5 className="font-bold text-sky-800 mb-1 text-sm underline">1️⃣ وحدة تحليل الأزمات الدولية</h5>
                            <p className="text-[11px] leading-relaxed italic">متابعة الأزمات وتقديم تقديرات الموقف ودراسة السيناريوهات.</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h5 className="font-bold text-sky-800 mb-1 text-sm underline">2️⃣ وحدة الدراسات الإقليمية</h5>
                            <p className="text-[11px] leading-relaxed italic">التوازنات في الشرق الأوسط، آسيا، أوروبا، إفريقيا، والأميركيتان.</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h5 className="font-bold text-sky-800 mb-1 text-sm underline">3️⃣ وحدة التقارير الاستراتيجية</h5>
                            <p className="text-[11px] leading-relaxed italic">التقرير الجيوسياسي السنوي، تقرير المخاطر العالمية، وموازين القوة.</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <h5 className="font-bold text-sky-800 mb-1 text-sm underline">4️⃣ وحدة الخرائط الجيوسياسية</h5>
                            <p className="text-[11px] leading-relaxed italic">إنتاج خرائط مناطق النفوذ، التحالفات العسكرية، والطاقة والموارد.</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl lg:col-span-2">
                            <h5 className="font-bold text-sky-800 mb-1 text-sm underline">5️⃣ وحدة البيانات والتحليل</h5>
                            <p className="text-[11px] leading-relaxed italic">بناء قواعد بيانات استراتيجية، تحليل الاتجاهات العالمية، تحليل المخاطر ودعم الدراسات بالأرقام.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Future Institutional Structure - الهيكل المؤسسي الحقيقي */}
                <section className="mb-10 bg-gray-900 text-white p-8 rounded-[2rem]">
                    <h4 className="text-xl font-bold text-amber-600 mb-6 text-center">المرحلة القادمة: الهيبة والهيكل المؤسسي</h4>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "مجلس الأمناء", "المجلس العلمي", "المدير التنفيذي", "المجلس الاستشاري الدولي",
                            "هيئة الباحثين", "مجلة المعهد العلمية", "سلسلة الإصدارات", "مركز التدريب",
                            "مركز الحوار الدولي", "وحدة النشر"
                        ].map((name, i) => (
                            <span key={i} className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold border border-white/10">
                                {name}
                            </span>
                        ))}
                    </div>
                    <p className="mt-8 text-center text-sm font-black italic text-amber-600">"حكمة الرؤية.. قوة التحليل"</p>
                </section>

                {/* 8. Activities & Domains - الأنشطة ومجالات البحث */}
                <section className="grid md:grid-cols-2 gap-8 border-t pt-8">
                    <div>
                        <h4 className="text-lg font-bold text-sky-900 mb-4 underline">5️⃣ مجالات البحث (Research Domains)</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold opacity-80">
                            <p>• الجغرافيا السياسية</p>
                            <p>• الاستراتيجية الدولية</p>
                            <p>• تحولات النظام العالمي</p>
                            <p>• الأمن الدولي</p>
                            <p>• الاقتصاد الجيوسياسي</p>
                            <p>• دراسات القوة والنفوذ</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-sky-900 mb-4 underline">7️⃣ أنشطة المعهد (Activities)</h4>
                        <ul className="space-y-1 text-xs font-medium">
                            <li>• إصدار الدراسات والتقارير الاستراتيجية الدورية.</li>
                            <li>• تنظيم المؤتمرات والندوات الفكرية الدولية.</li>
                            <li>• نشر المقالات التحليلية وبناء منصات للحوار.</li>
                            <li>• تدريب الباحثين الشباب في التفكير الاستراتيجي.</li>
                        </ul>
                    </div>
                </section>

            </main>

            {/* Footer Branding */}
            <footer className="bg-sky-900 text-white py-10 px-8 text-center border-t-8 border-amber-600">
                <h5 className="text-xl font-black mb-1">INTERNATIONAL WISDOM INSTITUTE (IWI)</h5>
                <p className="text-xs opacity-60 italic mb-4 tracking-widest">Strategic & Geopolitical Studies</p>
                <div className="text-[10px] opacity-40 uppercase">
                    جناح الدراسات والأبحاث لشركة International House for Distribution LLC © 2026
                </div>
            </footer>
        </div>
    );
};

export default AlhekmaInstitutePage;