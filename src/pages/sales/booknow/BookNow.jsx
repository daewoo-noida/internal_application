import React from "react";
import { useNavigate } from "react-router-dom";

export default function BookNow() {
    const navigate = useNavigate();

    const formats = [
        {
            title: "Signature Outlet",
            desc: "Premium experience hub with hospitality zones, large product displays, and service onboarding.",
            list: [
                "Full store design & customization",
                "Local merchandising & brand kits",
                "CRM integration & loyalty journeys",
            ],
        },
        {
            title: "Prime Outlet",
            desc: "High-footfall experience format for malls & major high-street areas.",
            list: [
                "Video analytics & interaction data",
                "Prime SKU access",
                "Localized marketing support",
            ],
        },
        {
            title: "Select Outlet",
            desc: "Curated mid-town format with optimized SKU selection.",
            list: [
                "Modular fixtures (300–600 sq ft)",
                "Retailer-integrated model",
                "Team hiring & training",
            ],
        },
    ];

    const steps = [
        { title: "Submit your preferred format", desc: "Share location & details using the form below." },
        { title: "Consultation & feasibility", desc: "Experts evaluate store potential & market alignment." },
        { title: "Agreement & onboarding", desc: "Finalize commercials & get store setup guidelines." },
        { title: "Launch & Growth", desc: "Activate marketing, merchandising & quarterly reviews." },
    ];



    return (
        <main className="w-full overflow-hidden bg-white">

            {/* -------------------------------------------------- */}
            {/*  HERO SECTION - UNTOUCHED */}
            {/* -------------------------------------------------- */}
            <section
                className="text-[#0070b9] relative overflow-hidden rounded-2xl flex items-center justify-center"
                style={{
                    margin: "12vh 3vh",
                    backgroundImage: "url('/images/booknow.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "70vh",
                }}
            >
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1 text-sm tracking-[3px] uppercase bg-white/20 rounded-full">
                        Franchise & Outlet
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-5 leading-tight">
                        Book Franchise & Brand Outlet with Daewoo
                    </h1>
                    <p className="text-lg text-[#0070b9] mt-4">
                        Discover franchise models engineered for modern retail success.
                        Choose your preferred pathway — our onboarding team will contact you within 48 hours.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center mt-8">
                        <a href="/sales/addclients" className="px-6 py-3 bg-[#0070B9] text-white rounded-lg shadow-lg transition hover:bg-[#005a94]">
                            Book Now
                        </a>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------- */}
            {/* FRANCHISE BOOKING */}
            {/* -------------------------------------------------- */}
            <section id="franchise-booking" className="pb-8 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <span className="px-4 py-2 bg-blue-100 text-[#0070b9] rounded-full text-sm">
                            Franchise Booking
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Choose Your Franchise Pathway
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Select a franchise tier and our team will guide you from verification to launch.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Master Franchise",
                                desc: "Exclusive rights to operate, manage & expand Daewoo across a full region.",
                                list: [
                                    "State/Region exclusive rights",
                                    "Open & operate stores",
                                    "Appoint sub-franchises",
                                    "Earn from fees, royalty & sales",
                                    "Lead local marketing & operations",
                                ],
                            },
                            {
                                title: "District Partner Program",
                                desc: "Data-powered retail partnership for district-level retail expansion.",
                                list: [
                                    "Exclusive district rights",
                                    "Performance-based revenue model",
                                    "Open stores & sub-franchises",
                                    "Long-term franchise security",
                                ],
                            },
                        ].map((card, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                                <p className="text-gray-600 mb-6">{card.desc}</p>
                                <ul className="space-y-3 mb-8">
                                    {card.list.map((item, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#0070b9] text-white rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-center text-center md:text-left">
                            <div className="mb-6 md:mb-0">
                                <h3 className="text-2xl text-start font-semibold mb-3">Ready to apply?</h3>
                                <p className="text-white/80">
                                    Submit your details & preferred format — our franchise desk will reach out.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/sales/addclients")}
                                className="px-8 py-3 bg-white text-[#0070b9] rounded-lg font-medium hover:bg-gray-100 transition"
                            >
                                Submit Interest
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------- */}
            {/* OUTLET FORMATS */}
            {/* -------------------------------------------------- */}
            <section id="formats" className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Outlet Format Options
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the most suitable format for your location, investment & expansion goals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {formats.map((box, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-lg text-[#0070b9] font-semibold mb-4">
                                    {box.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {box.desc}
                                </p>
                                <ul className="space-y-3 text-gray-700">
                                    {box.list.map((l, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                                            <span>{l}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------- */}
            {/* SUPPORT & STEPS */}
            {/* -------------------------------------------------- */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="px-4 py-2 bg-blue-100 text-[#0070b9] rounded-full text-sm font-medium mb-4 inline-block">
                            Process
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            From Interest to Launch
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Our streamlined process ensures a smooth partnership journey
                        </p>
                    </div>

                    {/* Modern Timeline Steps */}
                    <div className="relative">
                        {/* Desktop Timeline Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-[#0070b9] to-blue-200 transform -translate-y-1/2"></div>

                        {/* Steps Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="relative group">
                                    {/* Step Card */}
                                    <div className="bg-white rounded-2xl p-8 border-2 border-blue-50 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all duration-300 h-full">
                                        {/* Step Number */}
                                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-[#0070b9] text-white rounded-full mb-6 mx-auto text-2xl font-bold shadow-lg">
                                            {index + 1}
                                        </div>

                                        {/* Step Content */}
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {step.desc}
                                            </p>
                                        </div>

                                        {/* Decorative Element */}
                                        <div className="mt-6 flex justify-center">
                                            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Desktop Arrow */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-[#0070b9] transform -translate-y-1/2">
                                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------- */}
            {/* FINAL CTA */}
            {/* -------------------------------------------------- */}

        </main>
    );
}