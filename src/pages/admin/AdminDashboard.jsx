import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

import { adminAPI } from "../../utils/api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [salesmen, setSalesmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const primary = "#0070b9";

    useEffect(() => {
        async function loadData() {
            try {
                const [statsRes, salesmenRes] = await Promise.all([
                    adminAPI.stats(),
                    adminAPI.salesmen(),
                ]);

                // backend returns: { success, data: {...} }
                setStats(statsRes.data.data);

                setSalesmen(salesmenRes.data.salesmen || []);
            } catch (err) {
                console.error("Admin Dashboard Error:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading || !stats) return <div className="p-6 text-center">Loading...</div>;

    // ------------------- Chart -------------------
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Deal Amount Growth",
                data: [5, 10, 8, 15, 20, stats.totalDealAmount],
                borderColor: primary,
                backgroundColor: "rgba(0,112,185,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#eee" } },
        },
    };

    return (
        <div className="p-6 fade-in-up">

            {/* ---------- KPI CARDS ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                <div className="p-5 rounded-xl shadow bg-white border-l-4" style={{ borderColor: primary }}>
                    <p className="text-gray-600 text-sm">Total Clients</p>
                    <p className="text-2xl font-semibold mt-1">{stats.totalClients}</p>
                </div>

                <div className="p-5 rounded-xl shadow bg-white border-l-4" style={{ borderColor: primary }}>
                    <p className="text-gray-600 text-sm">Total Deal Amount</p>
                    <p className="text-2xl font-semibold mt-1">₹{stats.totalDealAmount}</p>
                </div>

                <div className="p-5 rounded-xl shadow bg-white border-l-4" style={{ borderColor: primary }}>
                    <p className="text-gray-600 text-sm">Total Payment Received</p>
                    <p className="text-2xl font-semibold mt-1">₹{stats.totalReceived}</p>
                </div>

                <div className="p-5 rounded-xl shadow bg-white border-l-4" style={{ borderColor: primary }}>
                    <p className="text-gray-600 text-sm">Total Due Amount</p>
                    <p className="text-2xl font-semibold mt-1">₹{stats.totalDue}</p>
                </div>

            </div>

            {/* ---------- CHART CARD ---------- */}
            <div className="bg-white shadow rounded-xl p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Deal Growth Overview
                </h2>
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* ---------- SALESMEN LIST ---------- */}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Sales Team Overview
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3">Name</th>
                                <th className="p-3">Designation</th>
                                <th className="p-3">Total Clients</th>
                                <th className="p-3">Total Deal Amount</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {salesmen.map((s) => (
                                <tr key={s._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{s.name}</td>
                                    <td className="p-3 text-gray-600">{s.designation}</td>
                                    <td className="p-3">{s.totalClients || 0}</td>
                                    <td className="p-3">₹{s.totalDealAmount || 0}</td>
                                    <td className="p-3">
                                        <a
                                            href={`/admin/salesman/${s._id}`}
                                            className="text-white px-4 py-1 rounded"
                                            style={{ background: primary }}
                                        >
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
}
