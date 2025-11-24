import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function FranchiseCarousel() {
    const [franchiseFilter, setFranchiseFilter] = useState("Available");
    const [searchTerm, setSearchTerm] = useState("");
    const [franchiseSlide, setFranchiseSlide] = useState(0);
    const carouselRef = useRef(null);

    const franchises = [

        { title: "Delhi NCR", status: "Booked", image: "http://plus.unsplash.com/premium_photo-1697730373510-51b7fcf2ff52?q=80&w=1170&auto=format&fit=crop" },
        { title: "Telangana", status: "Booked", image: "https://images.unsplash.com/photo-1594813629504-69e08ac152f4?q=80&w=1170&auto=format&fit=crop" },
        { title: "Odisha", status: "Booked", image: "https://images.unsplash.com/photo-1633603510855-1e638350f89e?q=80&w=1229&auto=format&fit=crop" },
        { title: "Rajsthan", status: "Booked", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1170&auto=format&fit=crop" },
        { title: "Western Madhya Pradesh", status: "Booked", image: "https://plus.unsplash.com/premium_photo-1697730407363-4fff46d992bb?q=80&w=975&auto=format&fit=crop" },
        { title: "Eastern Madhya Pradesh", status: "Booked", image: "https://images.unsplash.com/photo-1679556369532-bacc9cbdb8da?q=80&w=1170&auto=format&fit=crop" },
        { title: "Mumbai Metropolitan & Western Maharastra", status: "Booked", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=735&auto=format&fit=crop" },
        { title: "Central & South Gujarat", status: "Booked", image: "https://images.unsplash.com/photo-1642841819300-20ed449c02a1?q=80&w=735&auto=format&fit=crop" },
        { title: "North Gujrat & Sourastra", status: "Booked", image: "https://images.unsplash.com/photo-1642841819300-20ed449c02a1?q=80&w=735&auto=format&fit=crop" },
        { title: "Western & Central Utter Pradesh", status: "Booked", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop" },
        { title: "Andhra Pradesh", status: "Booked", image: "https://images.unsplash.com/photo-1707833711203-7b37bdeb73b6?q=80&w=1331&auto=format&fit=crop" },
        { title: "South & Urban Karnataka", status: "Booked", image: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?q=80&w=1171&auto=format&fit=crop" },
        // { title: "Maharastra", status: "Booked", image: "https://images.unsplash.com/photo-1720174851625-3fffda5a6288?q=80&w=674&auto=format&fit=crop" },
        { title: "Chennai & Northern Tamilnadu", status: "Booked", image: "https://images.unsplash.com/photo-1614519738232-27ba94d26403?q=80&w=687&auto=format&fit=crop" },
        { title: "North & Central Karnataka", status: "Booked", image: "https://images.unsplash.com/photo-1600100397849-3a782cfd8492?q=80&w=1074&auto=format&fit=crop" },
        { title: "Haryana", status: "Booked", image: "https://images.unsplash.com/photo-1695667424131-a9680e0307ee?q=80&w=1170&auto=format&fit=crop" },
        { title: "Southern & Western Tamil Nadu", status: "Booked", image: "https://images.unsplash.com/photo-1597389935051-2f9dc0f05456?q=80&w=687&auto=format&fit=crop" },
        { title: "West Bengal", status: "Booked", image: "https://images.unsplash.com/photo-1626198226928-617fc6c6203e?q=80&w=1170&auto=format&fit=crop" },
        { title: "Marathawada & Southern Maharastra", status: "Booked", image: "https://images.unsplash.com/photo-1674452388723-e47ff1e6df92?q=80&w=1332&auto=format&fit=crop" },
        { title: "Vidarbha & North Maharastra", status: "Booked", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop" },
        { title: "Eastern Utter pradesh & Bundelkhand", status: "Available", image: "https://images.unsplash.com/photo-1642152654183-a2baa9a08f34?q=80&w=1170&auto=format&fit=crop" }
        , { title: "Jharkhand", status: "Available", image: "https://plus.unsplash.com/premium_photo-1697730494992-7d5a0c46ea52?q=80&w=1171&auto=format&fit=crop" },
        { title: "Chattisgarh", status: "Available", image: "http://plus.unsplash.com/premium_photo-1691031429475-a18a2c89d83c?q=80&w=1974&auto=format&fit=crop" },
        { title: "Goa", status: "Available", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1170&auto=format&fit=crop" },
        { title: "Himachal Pradesh", status: "Available", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=1170&auto=format&fit=crop" },
        { title: "Jammu & Kashmir", status: "Available", image: "https://plus.unsplash.com/premium_photo-1697730426664-f04d9916f700?q=80&w=1170&auto=format&fit=crop" },
        { title: "North East", status: "Available", image: "https://plus.unsplash.com/premium_photo-1694475392038-7c2a5706786e?q=80&w=1166&auto=format&fit=crop" },
        { title: "Uttrakhand", status: "Available", image: "https://images.unsplash.com/photo-1596599623428-87dbae5e7816?q=80&w=1170&auto=format&fit=crop" },
        { title: "Punjab", status: "Available", image: "https://plus.unsplash.com/premium_photo-1697730324062-c012bc98eb13?q=80&w=1170&auto=format&fit=crop" },
        { title: "Bihar", status: "Available", image: "https://images.unsplash.com/photo-1722332780160-6b166b9367d9?q=80&w=735&auto=format&fit=crop" },
        { title: "Kerala", status: "Available", image: "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?q=80&w=1170&auto=format&fit=crop" },
    ];

    const filteredFranchises = franchises.filter(
        (f) =>
            f.status === franchiseFilter &&
            f.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setFranchiseSlide((prev) =>
                prev === filteredFranchises.length - 1 ? 0 : prev + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [filteredFranchises.length]);

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
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Master Franchise Opportunities
                </h2>
                <p className="text-gray-600 mb-8 max-w-3xl text-lg">
                    Explore our master franchise opportunities across India. Join our
                    network of successful franchise partners.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    <div className="flex bg-white rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setFranchiseFilter("Available")}
                            className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${franchiseFilter === "Available"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Available 12
                        </button>
                        <button
                            onClick={() => setFranchiseFilter("Booked")}
                            className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${franchiseFilter === "Booked"
                                ? "bg-red-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Booked 18
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by Region Name..."
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
                        {filteredFranchises.map((item, index) => (
                            <div key={index} className="w-1/5 flex-shrink-0">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 duration-300">
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
