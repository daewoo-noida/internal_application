import React, { useState, useEffect, useRef } from "react";
import NotificationBell from "../../components/NotificationBell";

export default function AdminHeader({ toggleSidebar }) {
    const [admin, setAdmin] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (stored) setAdmin(JSON.parse(stored));
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const close = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header
            className="w-full shadow-sm bg-white border-b border-gray-200"
            style={{ height: "60px" }}
        >
            <div className="h-full flex items-center justify-between px-4">
                {/* Left: Sidebar Toggle Button + Logo */}
                <div className="flex items-center gap-4">
                    {/* Sidebar Toggle Button - Visible on mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="menu-button p-2 rounded-lg hover:bg-gray-100 transition md:hidden"
                    >
                        <span className="text-2xl font-bold text-[#0070b9]">☰</span>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-9 w-auto"
                        />
                    </div>
                </div>

                {/* Right: Admin Profile */}
                <div className="relative flex items-center gap-3" ref={dropdownRef}>
                    <NotificationBell />
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#0070b9] text-white flex items-center justify-center font-semibold">
                            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <span className="font-medium text-gray-800 hidden md:block">
                            {admin?.name || "Admin"}
                        </span>

                        <span className="text-gray-500 text-sm hidden md:block">
                            ▼
                        </span>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg py-2 w-44 z-50">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <strong>{admin?.name}</strong>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>

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
        </header>
    );
}