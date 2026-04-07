import React from 'react';

export default function AlhekmaInstitutePage() {
    return (
        <div className="bg-white text-right font-sans leading-relaxed text-gray-800" dir="rtl">

            {/* 1. Header & Official Identity - الهوية الرسمية مع اللوجو */}
            <section
                className="w-full py-10 px-8 text-white border-b-[6px]"
                style={{
                    backgroundColor: '#0c4a6e',
                    backgroundImage: 'linear-gradient(to left, #0c4a6e, #075985)',
                    borderColor: '#d97706'
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

                    {/* مكان اللوجو المستخرج من الفايل */}
                    <div className="flex-shrink-0">
                        <img
                            src="/logo-instatute.png"
                            alt="لوجو معهد الحكمة"
                            className="w-24 h-24 md:w-36 md:h-36 object-contain bg-white p-2 rounded-2xl shadow-lg border-2 border-amber-600"
                        />
                    </div>

                    <div className="text-right flex-grow">
                        <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">معهد الحكمة الدولي للدراسات الاستراتيجية</h1>
                        <p className="text-xl md:text-2xl font-bold tracking-widest mb-4 uppercase text-amber-600">International Wisdom Institute (IWI)</p>

                        <div className="bg-sky-800 bg-opacity-70 inline-block px-5 py-2 rounded-lg border border-sky-600">
                            <p className="text-xl md:text-2xl font-bold italic text-white">"حكمة الرؤية.. قوة التحليل"</p>
                        </div>

                        <div className="mt-6 text-base opacity-95 leading-relaxed text-white">
                            <p className="font-bold text-amber-600 mb-1">الهوية المؤسسية الجديدة:</p>
                            <p>الاسم الرسمي: International Wisdom Institute (IWI)</p>
                            <p>التبعية القانونية: جناح الدراسات والأبحاث لشركة International House for Distribution LLC</p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* 2. The Core Idea - الفكرة الأساسية */}
                <section className="mb-12">
                    <h3 className="text-3xl font-bold text-sky-900 mb-6 border-r-8 border-amber-600 pr-4">أولًا: الفكرة الأساسية للمعهد (The Core Idea)</h3>
                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <p className="text-lg md:text-xl leading-relaxed mb-8">
                            يقوم المعهد على دراسة التحولات العالمية في السياسة والاستراتيجية والجغرافيا السياسية، مع التركيز على فهم توازنات القوة الدولية وصياغة رؤى فكرية تساعد على قراءة المستقبل.
                        </p>
                        <p className="font-bold text-sky-800 mb-6 text-center text-lg md:text-xl">يركز المعهد على الجمع بين:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-md font-bold text-center border-b-4 border-sky-600 text-sky-900 text-lg">الحكمة الفكرية</div>
                            <div className="bg-white p-6 rounded-2xl shadow-md font-bold text-center border-b-4 border-sky-600 text-sky-900 text-lg">التحليل الاستراتيجي</div>
                            <div className="bg-white p-6 rounded-2xl shadow-md font-bold text-center border-b-4 border-sky-600 text-sky-900 text-lg">قراءة التحولات الجيوسياسية</div>
                        </div>
                        <p className="mt-8 text-center italic text-gray-500 text-lg">من أجل تقديم رؤى عميقة تساعد الباحثين وصناع القرار والمجتمعات على فهم العالم المتغير.</p>
                    </div>
                </section>

                {/* 3. Vision, Mission, Values & About - التعريف والرؤية والرسالة والقيم */}
                <section className="mb-12 grid lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="p-6 bg-sky-50 rounded-2xl border-r-4 border-sky-900 shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4">1️⃣ التعريف بالمعهد (About the Institute)</h4>
                            <p className="text-lg leading-relaxed">معهد الحكمة الدولية (IWI) هو مركز فكري مستقل يعنى بالدراسات الاستراتيجية والجيوسياسية، ويهدف إلى فهم التحولات الكبرى في النظام الدولي وتحليل ديناميات القوة والتوازنات العالمية. يسعى المعهد لتقديم رؤى فكرية عميقة تساعد على تفسير التحولات السياسية والاستراتيجية.</p>
                        </div>
                        <div className="p-6 bg-white border border-sky-200 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4">2️⃣ الرؤية (Vision)</h4>
                            <p className="text-lg leading-relaxed">منصة فكرية دولية رائدة في الدراسات الاستراتيجية، تسهم في بناء فهم أعمق للتحولات العالمية وصياغة رؤى مستقبلية متوازنة.</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="p-6 bg-sky-900 text-white rounded-2xl shadow-lg">
                            <h4 className="font-bold text-amber-600 text-2xl mb-4">3️⃣ الرسالة (Mission)</h4>
                            <p className="text-lg leading-relaxed text-white">تقديم دراسات وتحليلات استراتيجية عالية المستوى حول القضايا الدولية والجيوسياسية، وتعزيز ثقافة التفكير الاستراتيجي والحكمة السياسية.</p>
                        </div>
                        <div className="p-6 bg-sky-50 rounded-2xl border-2 border-amber-600 shadow-sm">
                            <h4 className="font-bold text-sky-900 text-2xl mb-4">4️⃣ القيم الأساسية (Core Values)</h4>
                            <p className="text-lg font-bold text-sky-800 leading-relaxed">الاستقلال الفكري | الموضوعية العلمية | التفكير الاستراتيجي | الحكمة في التحليل | الانفتاح على الحوار العالمي</p>
                        </div>
                    </div>
                </section>

                {/* 4. Strategic Objectives - الأهداف */}
                <section className="mb-12">
                    <h4 className="text-3xl font-bold text-sky-900 mb-8 border-r-4 border-amber-600 pr-4">5️⃣ الأهداف الاستراتيجية (Strategic Objectives)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                        {[
                            "تطوير الدراسات الاستراتيجية والجيوسياسية.",
                            "تحليل التحولات في النظام الدولي وموازين القوة.",
                            "تقديم رؤى لفهم الصراعات والتحالفات الدولية.",
                            "دعم الحوار الفكري حول مستقبل العلاقات الدولية.",
                            "إنتاج بحوث ودراسات تخدم صناع القرار والباحثين.",
                            "بناء شبكة دولية من الباحثين والمفكرين والخبراء."
                        ].map((text, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <span className="bg-sky-100 text-sky-900 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black flex-shrink-0">{i + 1}</span>
                                <p className="font-medium leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Activities & Domains - الأنشطة ومجالات البحث */}
                <section className="grid lg:grid-cols-2 gap-12 mb-12 p-8 bg-sky-50 rounded-[2rem] border border-sky-100 shadow-sm">
                    <div>
                        <h4 className="text-2xl font-bold text-sky-900 mb-8 underline decoration-amber-600 underline-offset-8">6️⃣ مجالات البحث (Research Domains)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base font-bold">
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> الجغرافيا السياسية
                            </div>
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> الاستراتيجية الدولية
                            </div>
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> تحولات النظام العالمي
                            </div>
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> الأمن الدولي
                            </div>
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> الاقتصاد الجيوسياسي
                            </div>
                            <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100">
                                <span className="text-amber-600 text-xl">●</span> دراسات القوة والنفوذ
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-sky-900 mb-8 underline decoration-amber-600 underline-offset-8">7️⃣ أنشطة المعهد (Activities)</h4>
                        <ul className="space-y-6 text-lg font-medium">
                            <li className="flex items-start gap-4 p-2 bg-transparent">
                                <span className="text-sky-700 bg-sky-100 p-1 rounded-full text-sm mt-1">✔</span>
                                <span className="leading-relaxed">إصدار الدراسات والتقارير الاستراتيجية الدورية المتخصصة.</span>
                            </li>
                            <li className="flex items-start gap-4 p-2 bg-transparent">
                                <span className="text-sky-700 bg-sky-100 p-1 rounded-full text-sm mt-1">✔</span>
                                <span className="leading-relaxed">تنظيم المؤتمرات والندوات الفكرية الدولية وورش العمل.</span>
                            </li>
                            <li className="flex items-start gap-4 p-2 bg-transparent">
                                <span className="text-sky-700 bg-sky-100 p-1 rounded-full text-sm mt-1">✔</span>
                                <span className="leading-relaxed">نشر المقالات التحليلية الرصينة وبناء منصات للحوار الفكري.</span>
                            </li>
                            <li className="flex items-start gap-4 p-2 bg-transparent">
                                <span className="text-sky-700 bg-sky-100 p-1 rounded-full text-sm mt-1">✔</span>
                                <span className="leading-relaxed">تدريب وتأهيل الباحثين الشباب في مجالات التفكير الاستراتيجي.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 6. Research Departments - الأقسام البحثية كاملة */}
                <section className="mb-12 py-12 px-6 md:px-10 bg-white border border-gray-200 rounded-[3rem] shadow-sm">
                    <h3 className="text-3xl font-black text-sky-900 mb-12 text-center underline decoration-amber-600 underline-offset-8">الأقسام البحثية للمعهد</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">

                        {/* Dept 1 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl shadow-sm border-t-8 border-sky-900">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">1️⃣ قسم الدراسات الجيوسياسية</h5>
                            <p className="text-base text-gray-500 mb-6 italic leading-relaxed">دراسة تأثير الجغرافيا في تشكيل السياسات الدولية وتوازنات القوة.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">تحليل التوازنات الجيوسياسية العالمية</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">دراسة مناطق النفوذ والصراع</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">تحليل التحالفات ومتابعة تحولات النظام</span></li>
                            </ul>
                        </div>

                        {/* Dept 2 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl shadow-sm border-t-8 border-sky-900">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">2️⃣ قسم الدراسات الاستراتيجية</h5>
                            <p className="text-base text-gray-500 mb-6 italic leading-relaxed">تحليل الاستراتيجيات الدولية والعسكرية والسياسية للدول الكبرى.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">تحليل الاستراتيجيات الدولية</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">دراسة العقائد العسكرية وإدارة الصراعات</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">تقييم سياسات الأمن القومي</span></li>
                            </ul>
                        </div>

                        {/* Dept 3 */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl shadow-sm border-t-8 border-sky-900">
                            <h5 className="font-bold text-sky-900 text-xl mb-4">3️⃣ قسم دراسات النظام الدولي</h5>
                            <p className="text-base text-gray-500 mb-6 italic leading-relaxed">دراسة تطور النظام الدولي وتحولات القوة بين الأقطاب.</p>
                            <ul className="text-base space-y-4 font-semibold">
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">دراسة النظام الدولي المعاصر</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">تحليل صعود وسقوط القوى الكبرى</span></li>
                                <li className="flex items-start gap-3"><span className="text-sky-700">•</span> <span className="leading-relaxed">دراسة موازين القوة ومستقبل النظام</span></li>
                            </ul>
                        </div>

                    </div>

                    {/* Sub Depts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "الأمن الدولي", text: "الأمن الإقليمي، الإرهاب، الأمن السيبراني والطاقوي." },
                            { name: "الاقتصاد الجيوسياسي", text: "الاقتصاد السياسي، الصراعات الاقتصادية، العقوبات والموارد." },
                            { name: "الدراسات المستقبلية", text: "بناء السيناريوهات، استشراف التحولات، ودراسة مستقبل القوة." },
                            { name: "الفكر والحكمة", text: "فلسفة القوة، الفكر الاستراتيجي المعاصر، والحكمة السياسية." }
                        ].map((dept, i) => (
                            <div key={i} className="bg-sky-900 text-white p-6 rounded-2xl border-r-8 border-amber-600 shadow-lg flex flex-col justify-center">
                                <h6 className="font-bold text-lg mb-3 text-amber-600 underline decoration-white border-b border-transparent leading-relaxed">{dept.name}</h6>
                                <p className="text-sm md:text-base text-white leading-relaxed">{dept.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Strategic Specialized Units - الوحدات المتخصصة */}
                <section className="mb-16">
                    <h4 className="text-3xl font-bold text-sky-900 mb-10 border-r-4 border-amber-600 pr-4">الوحدات الاستراتيجية المتخصصة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 border border-gray-200 bg-white shadow-sm rounded-2xl hover:border-sky-300 hover:shadow-md transition-all">
                            <h5 className="font-bold text-sky-900 mb-3 text-lg">1️⃣ وحدة تحليل الأزمات الدولية</h5>
                            <p className="text-base leading-relaxed font-medium">متابعة الأزمات وتقديم تقديرات الموقف ودراسة السيناريوهات المحتملة.</p>
                        </div>
                        <div className="p-6 border border-gray-200 bg-white shadow-sm rounded-2xl hover:border-sky-300 hover:shadow-md transition-all">
                            <h5 className="font-bold text-sky-900 mb-3 text-lg">2️⃣ وحدة الدراسات الإقليمية</h5>
                            <p className="text-base leading-relaxed font-medium">التوازنات في الشرق الأوسط، آسيا، أوروبا، إفريقيا، والأميركيتان.</p>
                        </div>
                        <div className="p-6 border border-gray-200 bg-white shadow-sm rounded-2xl hover:border-sky-300 hover:shadow-md transition-all">
                            <h5 className="font-bold text-sky-900 mb-3 text-lg">3️⃣ وحدة التقارير الاستراتيجية</h5>
                            <p className="text-base leading-relaxed font-medium">التقرير الجيوسياسي السنوي، تقرير المخاطر العالمية، وموازين القوة.</p>
                        </div>
                        <div className="p-6 border border-gray-200 bg-white shadow-sm rounded-2xl hover:border-sky-300 hover:shadow-md transition-all">
                            <h5 className="font-bold text-sky-900 mb-3 text-lg">4️⃣ وحدة الخرائط الجيوسياسية</h5>
                            <p className="text-base leading-relaxed font-medium">إنتاج خرائط مناطق النفوذ، التحالفات العسكرية، والطاقة والموارد العالمية.</p>
                        </div>
                        <div className="p-6 border border-gray-200 bg-white shadow-sm rounded-2xl hover:border-sky-300 hover:shadow-md transition-all lg:col-span-2">
                            <h5 className="font-bold text-sky-900 mb-3 text-lg">5️⃣ وحدة البيانات والتحليل</h5>
                            <p className="text-base leading-relaxed font-medium">بناء قواعد بيانات استراتيجية شاملة، تحليل الاتجاهات العالمية، تحليل المخاطر ودعم الدراسات.</p>
                        </div>
                    </div>
                </section>

                {/* 8. Future Institutional Structure - الهيكل المؤسسي الحقيقي */}
                <section className="mb-4 bg-gray-900 text-white py-12 px-6 md:px-10 rounded-[3rem] shadow-2xl">
                    <h4 className="text-3xl font-bold text-amber-600 mb-10 text-center">المرحلة القادمة: الهيبة والهيكل المؤسسي</h4>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {[
                            "مجلس الأمناء", "المجلس العلمي", "المدير التنفيذي", "المجلس الاستشاري الدولي",
                            "هيئة الباحثين", "مجلة المعهد العلمية", "سلسلة الإصدارات", "مركز التدريب",
                            "مركز الحوار الدولي", "وحدة النشر"
                        ].map((name, i) => (
                            <span key={i} className="bg-sky-900 px-6 py-4 rounded-xl text-base md:text-lg font-bold border border-sky-600 shadow-md hover:bg-amber-600 transition-colors cursor-default text-center text-white">
                                {name}
                            </span>
                        ))}
                    </div>
                    <p className="mt-12 text-center text-xl md:text-2xl font-black italic text-amber-600 tracking-widest">"حكمة الرؤية.. قوة التحليل"</p>
                </section>

            </main>

            {/* Footer Branding */}
            <footer className="bg-sky-950 text-white py-16 px-8 text-center border-t-8 border-amber-600">
                <div className="max-w-4xl mx-auto">
                    <h5 className="text-2xl md:text-3xl font-black mb-3 tracking-widest uppercase text-white">INTERNATIONAL WISDOM INSTITUTE (IWI)</h5>
                    <p className="text-base md:text-lg opacity-80 italic mb-8 tracking-[0.2em] text-amber-600">Strategic & Geopolitical Studies</p>
                    <div className="w-24 h-1 bg-amber-600 mx-auto mb-8 rounded-full"></div>
                    <div className="text-sm opacity-75 uppercase leading-relaxed font-light text-white">
                        جناح الدراسات والأبحاث لشركة International House for Distribution LLC © 2026
                        <br />
                        جميع الحقوق محفوظة لمعهد الحكمة الدولي
                    </div>
                </div>
            </footer>
        </div>
    );
}