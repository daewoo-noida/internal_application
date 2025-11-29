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

    // Hide footer for logged-out users
    if (!user) return null;

    return (
        <footer className="relative bg-[#0070b9] text-white pt-16 pb-10 overflow-hidden" style={{ margin: "0px 3vh", borderRadius: "20px 20px 0px 0px" }}>

            {/* BG Effects */}
            <div className="absolute top-0 left-0 w-56 h-56 bg-[#0070b9]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6">

                {/* GRID - NOW 3 COLUMNS INSTEAD OF 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {/* LOGO + ABOUT */}
                    <div>
                        <img
                            src="/images/footer_logo.png"
                            alt="EBG Daewoo"
                            className="h-9 mb-6 opacity-95 hover:opacity-100 transition"
                        />
                        <p className="text-[#fff] leading-relaxed mb-6 text-sm">
                            Your Gateway to Seamless Sales Operations.<br />
                            Faster Closures, Better Collaboration.<br />
                            Tools, Insights & Support for Every Deal.
                        </p>

                        <div className="flex gap-3 mt-4">
                            {[
                                { icon: <Facebook size={20} />, href: "https://www.facebook.com/daewoo.appliances/" },
                                { icon: <Instagram size={20} />, href: "https://www.instagram.com/daewoo.appliances/" },
                                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/daewooappliances/" },
                                { icon: <Youtube size={20} />, href: "https://youtube.com/@daewoo.appliances?si=rT3MRiwVmgSrK1HL" },

                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 text-[#fff] rounded-xl hover:bg-white/20 transition backdrop-blur ]"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>

                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 tracking-wide">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Contact", href: "/contact-us" },
                                { label: "Downloads", href: "/downloads" },
                                { label: "Book Now", href: "/book-now" }
                            ].map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        className="hover:text-white transition flex items-center gap-2 text-[#fff]"
                                    >
                                        <span className="w-1.5 h-1.5 bg-[#fff] rounded-full"></span>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 tracking-wide">
                            Get In Touch
                        </h3>

                        <div className="space-y-5 text-[#fff] text-sm">

                            <div className="flex items-start gap-3">
                                <MapPin className="text-[#fff] mt-1" size={20} />
                                <p>
                                    A-Wing, 2nd Floor, Pramukh Plaza,
                                    Cardinal Gracious Road, Andheri East, Mumbai — 400059.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="text-[#fff]" size={20} />
                                <a
                                    href="mailto:help@daewooappliances.in"
                                    className="hover:text-white transition text-[#fff]"
                                >
                                    help@daewooappliances.in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="border-t border-white/10 mt-12 pt-6 text-center text-[#fff] text-xs sm:text-sm">
                    © {new Date().getFullYear()} Powered by{" "}
                    <span className="text-white font-medium">EBG Group</span>. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
