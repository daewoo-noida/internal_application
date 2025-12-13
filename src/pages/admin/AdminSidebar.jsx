import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/salesmen", label: "Users" },
    { path: "/admin/daewoo-clients", label: "Daewoo Clients" },
    { path: "/admin/pdf-manager", label: "File Manager" },
    { path: "/admin/reimbursements", label: "Reimbursements" },
    { path: "/admin/meetings", label: "Meeting & Invites" },
    { path: "/admin/franchise-manager", label: "Franchise Manager" },
    { path: "/admin/articles", label: "Articles" },
];

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-r h-screen fixed top-0 left-0 p-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#0070b9] mb-6">Admin Panel</h2>

            <nav className="flex flex-col space-y-2 no-underline">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-medium transition no-underline ${isActive
                                ? "bg-[#0070b9] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}