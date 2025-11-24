import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, ChevronDown, Menu } from "lucide-react";

export const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Load logged user
    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="px-5 py-3 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                </Link>

                {/* HAMBURGER (Mobile) */}
                {user && (
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <Menu size={22} />
                    </button>
                )}

                {/* NAVIGATION (Desktop) */}
                {user && (
                    <nav className="hidden md:flex gap-4">
                        {[
                            { href: "/sales/booknow", label: "Book Now" },
                            { href: "/sales/download", label: "Downloads" },
                            { href: "/sales/contact", label: "Support" },
                            { href: "/sales/dashboard", label: "Dashboard" },
                        ].map((nav) => (
                            <Link
                                key={nav.href}
                                to={nav.href}
                                className="px-4 py-1.5 no-underline rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition text-gray-700 font-medium"
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* AUTH / PROFILE */}
                <div className="relative" ref={dropdownRef}>
                    {!user ? (
                        /* SHOW LOGIN BUTTON WHEN NOT LOGGED IN */
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                        >
                            <LogIn size={18} /> Login
                        </Link>
                    ) : (
                        /* USER PROFILE BUTTON */
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white shadow hover:bg-gray-100 transition"
                        >
                            <User className="text-gray-600" size={20} />

                            <span className="font-medium text-gray-800">{user?.name}</span>

                            <ChevronDown size={16} className="text-gray-500" />
                        </button>
                    )}

                    {/* DROPDOWN MENU */}
                    {dropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-lg overflow-hidden border">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {user && mobileOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <nav className="flex flex-col py-2">
                        {[
                            { href: "/sales/dashboard", label: "Dashboard" },
                            { href: "/sales/addclients", label: "Book Now" },
                            { href: "/sales/download", label: "Downloads" },
                            { href: "/sales/contact", label: "Support" },
                        ].map((nav) => (
                            <Link
                                key={nav.href}
                                to={nav.href}
                                className="px-5 py-3 text-gray-700 hover:bg-gray-100 border-b"
                                onClick={() => setMobileOpen(false)}
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};
