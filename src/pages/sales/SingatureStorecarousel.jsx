import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SignatureStoreCarousel() {
    const [storeFilter, setStoreFilter] = useState("Available");
    const [searchTerm, setSearchTerm] = useState("");
    const [storeSlide, setStoreSlide] = useState(0);
    const carouselRef = useRef(null);

    const stores = [
        { title: "Mumbai Signature Store", status: "Available", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" },
        { title: "Delhi Signature Store", status: "Available", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop" },
        { title: "Bangalore Signature Store", status: "Booked", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
        { title: "Chennai Signature Store", status: "Available", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" },
        { title: "Kolkata Signature Store", status: "Available", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop" },
        // Add more stores here if needed
    ];

    const filteredStores = stores.filter(
        (s) =>
            s.status === storeFilter &&
            s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setStoreSlide((prev) =>
                prev === filteredStores.length - 1 ? 0 : prev + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [filteredStores.length]);

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const width = carouselRef.current.offsetWidth / 5;
        carouselRef.current.scrollBy({
            left: direction === "next" ? width : -width,
            behavior: "smooth",
        });
    };

    const navigate = useNavigate();


    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Signature Store Opportunities
                </h2>
                <p className="text-gray-600 mb-8 max-w-3xl text-lg">
                    Discover our signature store opportunities. Create a unique retail experience with our premium locations.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    {/* <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setStoreFilter("Available")}
                            className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${storeFilter === "Available"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Available
                        </button>
                        <button
                            onClick={() => setStoreFilter("Booked")}
                            className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${storeFilter === "Booked"
                                ? "bg-red-500 text-white"
                                : "text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Booked
                        </button>
                    </div> */}

                    <input
                        type="text"
                        placeholder="Search by Store Location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow shadow-sm hover:shadow-md"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => scrollCarousel("prev")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
                    >
                        ◀
                    </button>
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto scrollbar-hide space-x-4 transition-transform"
                    >
                        {filteredStores.map((item, index) => (
                            <div key={index} className="w-1/5 flex-shrink-0">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow transform hover:scale-105 duration-300">
                                    <div className="h-48">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Available"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
                                            {item.title}
                                        </h3>
                                        <button onClick={() => navigate('/sales/addclients')} className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors">
                                            Enquire Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => scrollCarousel("next")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
                    >
                        ▶
                    </button>
                </div>
            </div>
        </section>
    );
}
