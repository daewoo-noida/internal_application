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
        // {
        //     title: "Shop N Shop",
        //     desc: "Plug-and-play format for retail chains.",
        //     list: [
        //         "Fast deployment",
        //         "Compact multi-category layout",
        //         "Seasonal refresh program",
        //     ],
        // },
    ];



    // const backGroundImage = {
    //     backgroundImage: `url(/images/booknow.jpg)`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //     display: 'flex',
    //     alignItems: 'center',

    // };

    const steps = [
        { title: "Submit your preferred format", desc: "Share location & details using the form below." },
        { title: "Consultation & feasibility", desc: "Experts evaluate store potential & market alignment." },
        { title: "Agreement & onboarding", desc: "Finalize commercials & get store setup guidelines." },
        { title: "Launch & Growth", desc: "Activate marketing, merchandising & quarterly reviews." },
    ];



    return (
        <main className="w-full overflow-hidden">

            {/* -------------------------------------------------- */}
            {/*  HERO SECTION */}
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



                {/* <div className="absolute w-[400px] h-[400px] rounded-full bg-[#0070b9]/20 blur-[120px] top-20 left-20" />
                <div className="absolute w-[400px] h-[400px] rounded-full  blur-[150px] bottom-20 right-20" /> */}

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
                        <a href="/sales/addclients" className="px-6 py-3 bg-[#0070B9] text-white rounded-lg shadow-lg transition">
                            Book Now
                        </a>
                    </div>
                </div>
            </section>



            {/* -------------------------------------------------- */}
            {/* INTRO SECTION */}
            {/* -------------------------------------------------- */}
            <section className="py-[100px] bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">

                    {/* Left */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Build with a Legacy Brand
                        </h2>

                        <p className="text-gray-600">
                            Daewoo blends global trust with next-gen retail engineering to create scalable franchise opportunities across India.
                        </p>

                        <div className="grid gap-4">
                            {["Future-ready formats", "Dedicated launch support", "Pan-India supply network"].map((title, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white rounded-xl shadow">
                                    <div className="text-2xl font-bold text-[#0070b9]">0{i + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{title}</h3>
                                        <p className="text-gray-500 mt-1">
                                            {[
                                                "From flagship franchise stores to compact shop-in-shop concepts.",
                                                "Includes training, branding kits, and launch teams.",
                                                "Optimized warehousing ensures smooth supply & uptime.",
                                            ][i]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">What You Get</h3>
                        <p className="text-gray-600">
                            Every tier includes brand guardianship, channel marketing, and retail operations systems.
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Smart product portfolio selection</li>
                            <li>On-ground merchandising & layouts</li>
                            <li>Digital & offline promotional support</li>
                            <li>After-sales and service guidance</li>
                        </ul>
                    </div>
                </div>
            </section>


            {/* -------------------------------------------------- */}
            {/* FRANCHISE BOOKING */}
            {/* -------------------------------------------------- */}
            <section id="franchise-booking" className="py-[100px]">
                <div className="max-w-7xl mx-auto px-6 space-y-12">

                    {/* Title */}
                    <div className="text-center space-y-3">
                        <span className="px-4 py-1 bg-blue-100 text-[#0070b9] rounded-full text-sm">Franchise Booking</span>
                        <h2 className="text-3xl font-bold">Choose Your Franchise Pathway</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Select a franchise tier and our team will guide you from verification to launch.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid sm:grid-cols-2 gap-6">
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
                            <div key={i} className="p-6 bg-white rounded-2xl shadow space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                                <p className="text-gray-600">{card.desc}</p>
                                <ul className="pl-5 space-y-2 list-disc text-gray-700">
                                    {card.list.map((item, idx) => <li key={idx}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="p-6 bg-[#0070b9] text-white rounded-2xl flex flex-col md:flex-row justify-between items-center md:items-center text-center md:text-left">

                        <div className="w-full md:w-auto mb-4 md:mb-0">
                            <h3 className="text-2xl font-semibold">Ready to apply?</h3>
                            <p className="text-white/80 text-sm">
                                Submit your details & preferred format — our franchise desk will reach out.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/sales/addclients")}
                            className="px-6 py-3 bg-white text-[#0070b9] rounded-lg font-medium hover:bg-gray-100 w-full md:w-auto"
                        >
                            Submit Interest
                        </button>

                    </div>

                </div>
            </section>


            {/* -------------------------------------------------- */}
            {/* OUTLET FORMATS */}
            {/* -------------------------------------------------- */}
            <section id="formats" className="bg-[#0070b9] text-white py-20 px-6 ">
                <h2 className="text-3xl font-bold text-center mb-4">Outlet Format Options</h2>
                <p className="text-center text-gray-200 max-w-2xl mx-auto mb-12">
                    Discover the most suitable format for your location, investment & expansion goals.
                </p>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6r">
                    {formats.map((box, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white border-4 border-[#0466a6] space-y-4 hover:shadow-lg transition"
                        >
                            <h3 className="text-lg text-[#0070b9] font-semibold">
                                {box.title}
                            </h3>

                            <p className="text-[#0070b9] text-sm">
                                {box.desc}
                            </p>

                            <ul className="space-y-2 text-[#0070b9] text-sm list-disc pl-5">
                                {box.list.map((l, idx) => (
                                    <li key={idx}>{l}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </section>

            {/* -------------------------------------------------- */}
            {/* SUPPORT & STEPS */}
            {/* -------------------------------------------------- */}
            <section className="bg-gray-100 py-20 px-6 xl:px-24 grid md:grid-cols-2 gap-10">
                {/* Steps */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">From Interest to Launch</h2>
                    <div className="space-y-4">
                        {steps.map((s, i) => (
                            <div key={i} className="bg-white p-4 border rounded-xl shadow-sm">
                                <h3 className="font-semibold text-lg">{i + 1}. {s.title}</h3>
                                <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-white p-6 rounded-xl shadow space-y-6">
                    <h2 className="text-xl font-bold">Need Assistance?</h2>
                    <p className="text-gray-600 text-sm">
                        Our support team will guide you through eligibility, documentation & onboarding.
                    </p>

                    <div className="text-sm space-y-1 text-gray-700">
                        <p>📞 +91 96258 67630</p>
                        <p>📧 franchise@daewoo.com</p>
                        <p>📧 care@daewoo.com</p>
                    </div>

                    {/* Contact Form */}
                    <form className="space-y-3">
                        <input className="w-full p-3 border rounded-md" placeholder="Your Name" />
                        <input className="w-full p-3 border rounded-md" placeholder="Phone Number" />
                        <input className="w-full p-3 border rounded-md" placeholder="Email Address" />

                        <button className="w-full py-3 bg-[#0070b9] text-white rounded-md hover:bg-[#0070b9]">
                            Request a Callback
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
