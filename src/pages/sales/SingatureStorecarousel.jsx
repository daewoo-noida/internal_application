import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SignatureStoreCarousel() {
    const [storeFilter, setStoreFilter] = useState("Booked");
    const [searchTerm, setSearchTerm] = useState("");
    const carouselRef = useRef(null);

    const stores = [
        { title: "Ahemdabad", status: "Booked", image: "/images/signature/41.png" },
        { title: "Jaipur", status: "Booked", image: "/images/signature/55.png" },
        { title: "Delhi", status: "Booked", image: "/images/signature/66.png" },
    ];

    // ⭐ AUTO SELECT BOOKED ON LOAD
    useEffect(() => {
        const hasBooked = stores.some((s) => s.status === "Booked");
        if (hasBooked) setStoreFilter("Booked");
    }, []);

    const filteredStores = stores.filter(
        (s) =>
            s.status === storeFilter &&
            s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // AUTO SCROLL
    useEffect(() => {
        const interval = setInterval(() => {
            if (!carouselRef.current) return;
            carouselRef.current.scrollBy({
                left: carouselRef.current.offsetWidth / 3,
                behavior: "smooth",
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [filteredStores.length]);

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const width = carouselRef.current.offsetWidth / 2;
        carouselRef.current.scrollBy({
            left: direction === "next" ? width : -width,
            behavior: "smooth",
        });
    };

    const navigate = useNavigate();

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Signature Store Opportunities
                    </h2>
                    <p className="text-gray-600 text-lg mt-3 max-w-2xl mx-auto">
                        Explore India's premium signature stores and join our exclusive retail network.
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">

                    {/* ⭐ ONLY BOOKED BUTTON */}
                    <div className="bg-white p-1 rounded-full shadow flex">
                        <button
                            onClick={() => setStoreFilter("Booked")}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${storeFilter === "Booked"
                                ? "bg-red-500 text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Booked ({stores.filter((s) => s.status === "Booked").length})
                        </button>
                    </div>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search signature store..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#0070b9] shadow-sm"
                    />
                </div>

                {/* CAROUSEL */}
                <div className="relative">

                    {/* LEFT ARROW */}
                    <button
                        onClick={() => scrollCarousel("prev")}
                        className="absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 z-20"
                    >
                        <FaArrowLeft />
                    </button>

                    {/* CARD LIST */}
                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-hidden scroll-smooth scrollbar-hide snap-x pb-3"
                    >
                        {filteredStores.map((item, index) => (
                            <div
                                key={index}
                                className="min-w-[260px] snap-start bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                            >
                                <div className="h-40">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                        Booked
                                    </span>

                                    <h3 className="text-[18px] font-small text-gray-900 mt-3 mb-4 leading-snug">
                                        {item.title}
                                    </h3>

                                    <button
                                        onClick={() => navigate("/sales/addclients")}
                                        className="w-full bg-[#0070b9] hover:bg-[#005f99] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
                                    >
                                        Enquire Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT ARROW */}
                    <button
                        onClick={() => scrollCarousel("next")}
                        className="absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 z-20"
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
