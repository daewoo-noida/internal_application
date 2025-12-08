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
    const [filter, setFilter] = useState("monthly");

    const primary = "#0070b9";

    useEffect(() => {
        loadData();
        const refreshStats = () => loadData();
        window.addEventListener("payment-updated", refreshStats);

        return () => window.removeEventListener("payment-updated", refreshStats);
    }, []);

    const [graph, setGraph] = useState(null);

    // Update the loadData function to ensure graph includes approved payments:
    const loadData = async () => {
        try {
            const [statsRes, salesmenRes, graphRes] = await Promise.all([
                adminAPI.stats(),
                adminAPI.salesmen(),
                adminAPI.graph(),
            ]);

            setStats(statsRes.data.data);
            setSalesmen(salesmenRes.data.salesmen || []);
            setGraph(graphRes.data);

            console.log("Payment Stats:", {
                totalDeal: statsRes.data.data.totalDealAmount,
                totalReceived: statsRes.data.data.totalReceived,
                totalDue: statsRes.data.data.totalDue,
                efficiency: statsRes.data.data.totalDealAmount > 0
                    ? ((statsRes.data.data.totalReceived / statsRes.data.data.totalDealAmount) * 100).toFixed(2) + '%'
                    : '0%'
            });

        } catch (err) {
            console.error("Admin Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!graph) return <div>Loading graph...</div>;

    if (loading || !stats) return <div className="p-6 text-center">Loading...</div>;

    /* ========================================
        DYNAMIC CHART DATA BUILDER
    ========================================= */
    const pastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = pastMonths.map((m, i) => {
        const fraction = (i + 1) / 12;
        return Math.round(stats.totalDealAmount * fraction);
    });

    const yearlyData = [
        stats.totalDealAmount * 0.15,
        stats.totalDealAmount * 0.25,
        stats.totalDealAmount * 0.45,
        stats.totalDealAmount * 0.7,
        stats.totalDealAmount
    ];

    const chartData = {
        labels: filter === "monthly" ? graph.monthly.labels : graph.yearly.labels,
        datasets: [
            {
                label: "Deal Amount",
                data: filter === "monthly" ? graph.monthly.deal : graph.yearly.deal,
                borderColor: "#0070b9",
                backgroundColor: "rgba(0,112,185,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 4,
            },
            {
                label: "Payment Received",
                data: filter === "monthly" ? graph.monthly.received : graph.yearly.received,
                borderColor: "green",
                backgroundColor: "rgba(0,150,0,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 4,
            }
        ]
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


            <div className="bg-white shadow rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Payment Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Total Deal Amount</p>
                        <p className="text-2xl font-bold" style={{ color: primary }}>
                            ₹{Number(stats.totalDealAmount).toLocaleString()}
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Total Received</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{Number(stats.totalReceived).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            {stats.totalDealAmount > 0
                                ? `${((stats.totalReceived / stats.totalDealAmount) * 100).toFixed(1)}% Collected`
                                : '0% Collected'
                            }
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Total Due Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                            ₹{Number(stats.totalDue).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            {stats.totalDealAmount > 0
                                ? `${((stats.totalDue / stats.totalDealAmount) * 100).toFixed(1)}% Pending`
                                : '0% Pending'
                            }
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Collection Efficiency</p>
                        <p className="text-2xl font-bold" style={{ color: stats.totalReceived >= stats.totalDealAmount * 0.7 ? 'green' : 'orange' }}>
                            {stats.totalDealAmount > 0
                                ? `${((stats.totalReceived / stats.totalDealAmount) * 100).toFixed(1)}%`
                                : '0%'
                            }
                        </p>
                        <p className="text-sm text-gray-500">
                            {stats.totalClients} Active Clients
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------- KPI CARDS ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KPI title="Total Clients" value={stats.totalClients} color={primary} />
                <KPI title="Total Deal Amount" value={`₹${Number(stats.totalDealAmount).toLocaleString()}`} color={primary} />
                <KPI title="Total Payment Received" value={`₹${Number(stats.totalReceived).toLocaleString()}`} color={primary} />
                <KPI title="Total Due Amount" value={`₹${Number(stats.balanceAmount).toLocaleString()}`} color={primary} />
            </div>

            {/* ---------- CHART CARD ---------- */}
            <div className="bg-white shadow rounded-xl p-6 mb-10">

                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: primary }}>
                        Deal Growth Overview
                    </h2>

                    {/* ⭐ Filter: Monthly / Yearly */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <Line data={chartData} options={chartOptions} />
            </div>

            {/* ---------- SALESMEN LIST ---------- */}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Users Overview
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
                            {salesmen.map((s) => {
                                const hasReceived = Number(s.totalReceived || 0) > 0;

                                return (
                                    <tr
                                        key={s._id}
                                        className={`border-b ${hasReceived ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}`}
                                    >
                                        <td className="p-3 font-medium">{s.name}</td>
                                        <td className="p-3 text-gray-600">{s.designation}</td>
                                        <td className="p-3">{s.totalClients || 0}</td>
                                        <td className="p-3">₹{Number(s.totalDealAmount).toLocaleString()}</td>
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
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
}

// ---------------- KPI COMPONENT ----------------
function KPI({ title, value, color }) {
    return (
        <div className="p-3 rounded-xl bg-white border-l-4" style={{ borderColor: color }}>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    );
}
