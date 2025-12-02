import React, { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { Link } from "react-router-dom";

export default function SalesTeam() {
    const [salesmen, setSalesmen] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const res = await adminAPI.salesmen();
            setSalesmen(res.data.salesmen || []);
        } catch (err) {
            console.error("Sales Team Load Error", err);
        }
    };

    const toggleVerify = async (id) => {
        try {
            const res = await adminAPI.verify(id);
            alert(res.data.message);
            loadTeam();
            setOpenMenu(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        await adminAPI.deleteSalesman(id);
        loadTeam();
        setOpenMenu(null);
    };

    const getInitials = (name) => {
        if (!name) return "S";
        const parts = name.split(" ");
        return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-[#0070b9]">
                Sales Team
            </h1>

            {salesmen.length === 0 ? (
                <p className="text-gray-500 text-center p-10">No Sales Team Found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {salesmen.map((s) => (
                        <div
                            key={s._id}
                            className={`relative p-6 rounded-xl shadow-md border bg-white hover:shadow-lg transition`}
                        >
                            {/* ACTION BUTTON */}
                            <button
                                onClick={() =>
                                    setOpenMenu(openMenu === s._id ? null : s._id)
                                }
                                className="absolute top-3 right-3 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                ⋮
                            </button>

                            {/* DROPDOWN */}
                            {openMenu === s._id && (
                                <div className="absolute top-10 right-3 w-40 bg-white shadow-lg border rounded-md z-20">
                                    <button
                                        onClick={() => toggleVerify(s._id)}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        {s.isVerified ? "Unverify" : "Verify"}
                                    </button>

                                    <Link
                                        to={`/admin/salesman/${s._id}`}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                            {/* AVATAR */}
                            <div className="w-16 h-16 rounded-full bg-[#0070b9] text-white flex items-center justify-center text-xl font-semibold mb-4">
                                {getInitials(s.name)}
                            </div>

                            {/* INFO */}
                            <h2 className="text-xl font-semibold">{s.name}</h2>
                            <p className="text-gray-600 mt-1">{s.email}</p>
                            <p className="text-gray-500 capitalize">{s.designation || "-"}</p>
                            <p className="text-gray-500">{s.phone || "-"}</p>

                            {/* STATUS */}
                            <div className="mt-4">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${s.isVerified
                                        ? "bg-blue-100 text-[#0070b9]"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {s.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
