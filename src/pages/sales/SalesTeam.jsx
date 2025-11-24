import React, { useEffect, useState, useRef } from "react";
import { adminAPI } from "../../utils/api";
import { Link } from "react-router-dom";

export default function SalesTeam() {
    const [salesmen, setSalesmen] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const primary = "#0070b9";

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

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6" style={{ color: primary }}>
                Sales Team
            </h1>

            <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Designation</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {salesmen.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">
                                    No Sales Team Found
                                </td>
                            </tr>
                        ) : (
                            salesmen.map((s) => (
                                <tr
                                    key={s._id}
                                    className={`border-b transition ${s.isVerified ? "bg-blue-50" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <td className="p-3 font-medium">{s.name}</td>
                                    <td className="p-3">{s.email}</td>
                                    <td className="p-3 capitalize">{s.designation || "-"}</td>
                                    <td className="p-3">{s.phone || "-"}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded text-sm ${s.isVerified
                                                ? "bg-blue-200 text-blue-800"
                                                : "bg-yellow-200 text-yellow-800"
                                                }`}
                                        >
                                            {s.isVerified ? "Verified" : "Pending"}
                                        </span>
                                    </td>

                                    {/* ACTION DROPDOWN */}
                                    <td className="p-3 text-right relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(openMenu === s._id ? null : s._id)
                                            }
                                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                        >
                                            ⋮
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenu === s._id && (
                                            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg z-20">
                                                <button
                                                    onClick={() => toggleVerify(s._id)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
