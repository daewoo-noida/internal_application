import React, { useEffect, useState } from "react";
import {
    Facebook,
    Instagram,
    Youtube,
    Linkedin,
    Twitter,
    MapPin,
    Mail
} from "lucide-react";

export const Footer = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // 🚫 HIDE FOOTER IF USER IS LOGGED OUT
    if (!user) return null;

    return (
        <footer className="relative bg-[#0A0F1F] text-white pt-20 pb-12 overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <img
                            src="/images/footerLogo.png"
                            alt="EBG Daewoo"
                            className="h-12 mb-6 opacity-95 hover:opacity-100 transition"
                        />

                        <p className="text-gray-400 leading-relaxed mb-6">
                            Building a powerful future for India with innovation, excellence and reliability.
                            Growing together with trust and technology.
                        </p>

                        <div className="flex gap-3 mt-4">
                            {[
                                { icon: <Facebook size={20} />, href: "#" },
                                { icon: <Instagram size={20} />, href: "#" },
                                { icon: <Youtube size={20} />, href: "#" },
                                { icon: <Linkedin size={20} />, href: "#" },
                                { icon: <Twitter size={20} />, href: "#" }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition backdrop-blur"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6 tracking-wide">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Contact", href: "/contact-us" },
                                { label: "Downloads", href: "/downloads" },
                                { label: "Book Now", href: "/book-now" }
                            ].map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 hover:text-white transition flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6 tracking-wide">
                            Support
                        </h3>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Warranty & Services
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Become a Partner
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6 tracking-wide">
                            Get In Touch
                        </h3>

                        <div className="space-y-4 text-gray-400">

                            <div className="flex items-start gap-3">
                                <MapPin className="text-[#0070b9] mt-1" size={22} />
                                <p>
                                    A-Wing, 2nd Floor, Pramukh Plaza,
                                    Cardinal Gracious Road, Andheri East, Mumbai — 400059.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="text-[#0070b9]" size={20} />
                                <a
                                    href="mailto:help@daewooappliances.in"
                                    className="hover:text-white transition"
                                >
                                    help@daewooappliances.in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Powered by{" "}
                    <span className="text-white font-medium">EBG Group</span>.
                    All rights reserved.
                </div>
            </div>
        </footer>
    );
};
