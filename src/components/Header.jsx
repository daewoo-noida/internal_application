import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, Menu } from "lucide-react";
import { authAPI } from "../utils/api";

export const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Load logged user
    useEffect(() => {
        const stored = localStorage.getItem("userData");
        // const userName = 
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const loadUser = async () => {
        const userData = await authAPI.profile();
        // console.log('user data', userData.data.user.name);
        setUserProfile(userData.data.user.name);
    }

    // useEffect(() => {
    //     loadUser();
    // }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // console.log("Header User:", user);

    if (!user) return null;

    const mainNav = [
        { href: "/sales/dashboard", label: "Dashboard" },
        { href: "/sales/booknow", label: "Book Now" },
        { href: "/sales/download", label: "Downloads" },
        { href: "/sales/reimbursement", label: "Reimbursement" },
        { href: "/sales/contact", label: "Support" },
    ];

    const mobileNav = mainNav;

    return (
        <>
            <header className="fixed top-0 left-3 right-3 bg-white/80 backdrop-blur-md shadow-sm z-50 rounded-b-2xl">
                <div className="flex items-center justify-between px-4 py-3 relative">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" className="h-6 md:h-10 w-auto" alt="Logo" />
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex gap-3">
                        {mainNav.map((nav) => (
                            <Link
                                key={nav.href}
                                to={nav.href}
                                className={`px-4 py-2 text-sm rounded-full border shadow-sm transition no-underline
                  ${location.pathname === nav.href
                                        ? "bg-gray-100 border-gray-300 text-gray-900"
                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </nav>

                    {/* PROFILE BUTTON (Desktop + Mobile share dropdown) */}
                    <div className="flex items-center gap-2">

                        {/* MOBILE PROFILE BUTTON */}
                        <button
                            onClick={() => {
                                setDropdownOpen((prev) => !prev);
                                setMobileOpen(false);
                            }}
                            className="flex md:hidden items-center gap-1 px-3 py-1.5 rounded-full bg-white shadow hover:bg-gray-100 transition"
                        >
                            <User size={18} className="text-gray-600" />
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>

                        {/* DESKTOP PROFILE BUTTON */}
                        <button
                            onClick={() => {
                                setDropdownOpen((prev) => !prev);
                                setMobileOpen(false);
                            }}
                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
                        >
                            <User size={20} className="text-gray-600" />
                            <span className="font-medium text-gray-800">{user.name}</span>
                            <ChevronDown size={16} className="text-gray-500" />
                        </button>

                        {/* MOBILE MENU ICON */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={() => {
                                setMobileOpen((prev) => !prev);
                                setDropdownOpen(false);
                            }}
                            aria-label="Toggle Menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* SHARED DROPDOWN MENU (works for both desktop & mobile) */}
                    {dropdownOpen && (
                        <div className="absolute right-4 top-[3.4rem] md:top-[3.6rem] w-44 bg-white border shadow-xl rounded-lg overflow-hidden z-50">
                            <Link
                                to="/sales/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* MOBILE NAV */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden 
            ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <nav className="flex flex-col bg-white border-t rounded-b-2xl">
                        {mobileNav.map((nav) => (
                            <Link
                                key={nav.href}
                                to={nav.href}
                                className="px-6 py-3 border-b text-gray-700 hover:bg-gray-100"
                                onClick={() => setMobileOpen(false)}
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    );
};
