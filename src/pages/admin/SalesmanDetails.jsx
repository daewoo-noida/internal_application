// src/pages/admin/SalesmanDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { adminAPI } from "../../utils/api";

export default function SalesmanDetails() {
    const { id } = useParams();

    const [salesman, setSalesman] = useState(null);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({
        totalClients: 0,
        totalDealAmount: 0,
        totalReceived: 0,
        totalDue: 0
    });
    const [loading, setLoading] = useState(true);

    const primary = "#0070b9";

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // --- 1️⃣ Fetch full list of salesmen ---
            const userRes = await adminAPI.salesmen();
            const allSalesmen = userRes.data.salesmen || [];

            const selected = allSalesmen.find((s) => s._id === id);
            setSalesman(selected || {});

            // --- 2️⃣ Fetch clients of this salesman ---
            const res = await adminAPI.salesmanClients(id);
            const data = res.data.clients || [];
            setClients(data);

            // --- 3️⃣ Calculate stats ---
            const totalClients = data.length;
            const totalDealAmount = data.reduce((s, c) => s + Number(c.dealAmount || 0), 0);
            const totalReceived = data.reduce((s, c) => s + Number(c.tokenReceivedAmount || 0), 0);
            const totalDue = totalDealAmount - totalReceived;

            setStats({
                totalClients,
                totalDealAmount,
                totalReceived,
                totalDue,
            });

        } catch (err) {
            console.error("Salesman Details Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-lg">Loading...</div>;

    return (
        <div className="p-6 space-y-10">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold" style={{ color: primary }}>
                    {salesman?.name || "Salesman"}'s Summary
                </h1>

                <Link
                    to="/admin/salesmen"
                    className="px-4 py-2 rounded text-white"
                    style={{ background: primary }}
                >
                    Back
                </Link>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Clients", value: stats.totalClients },
                    { label: "Total Deal Amount", value: `₹${stats.totalDealAmount.toLocaleString()}` },
                    { label: "Total Received", value: `₹${stats.totalReceived.toLocaleString()}` },
                    { label: "Total Due", value: `₹${stats.totalDue.toLocaleString()}` },
                ].map((card, i) => (
                    <div
                        key={i}
                        className="p-5 bg-white shadow rounded-lg border-l-4"
                        style={{ borderColor: primary }}
                    >
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-2xl font-semibold mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* CLIENT TABLE */}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Client Details
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-3 text-left">Client Name</th>
                                <th className="p-3 text-left">Territory</th>
                                <th className="p-3 text-left">Deal Amount</th>
                                <th className="p-3 text-left">Received</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        No Clients Found
                                    </td>
                                </tr>
                            ) : (
                                clients.map((c) => (
                                    <tr key={c._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{c.name}</td>
                                        <td className="p-3">{c.territory || "-"}</td>
                                        <td className="p-3">₹{c.dealAmount?.toLocaleString()}</td>
                                        <td className="p-3">₹{c.tokenReceivedAmount?.toLocaleString()}</td>
                                        <td className="p-3">
                                            {Number(c.receivedPercent) === 100
                                                ? "Completed"
                                                : Number(c.receivedPercent) === 0
                                                    ? "Pending"
                                                    : "Partial"}
                                        </td>
                                        <td className="p-3">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
