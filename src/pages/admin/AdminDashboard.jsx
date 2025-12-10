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
    const [filteredSalesmen, setFilteredSalesmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("monthly");
    const [sortBy, setSortBy] = useState("name-asc"); // New state for sorting
    const [searchTerm, setSearchTerm] = useState(""); // New state for search

    const primary = "#0070b9";

    useEffect(() => {
        loadData();
        const refreshStats = () => loadData();
        window.addEventListener("payment-updated", refreshStats);

        return () => window.removeEventListener("payment-updated", refreshStats);
    }, []);

    useEffect(() => {
        // Apply filters and sorting when salesmen data changes
        if (salesmen.length > 0) {
            applyFiltersAndSorting();
        }
    }, [salesmen, sortBy, searchTerm]);

    const [graph, setGraph] = useState(null);

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

        } catch (err) {
            console.error("Admin Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSorting = () => {
        let filtered = [...salesmen];

        // Apply search filter
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.designation?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return (a.name || "").localeCompare(b.name || "");
                case "name-desc":
                    return (b.name || "").localeCompare(a.name || "");
                case "clients-high":
                    return (b.totalClients || 0) - (a.totalClients || 0);
                case "clients-low":
                    return (a.totalClients || 0) - (b.totalClients || 0);
                case "deal-high":
                    return (b.totalDealAmount || 0) - (a.totalDealAmount || 0);
                case "deal-low":
                    return (a.totalDealAmount || 0) - (b.totalDealAmount || 0);
                case "received-high":
                    return (b.totalReceived || 0) - (a.totalReceived || 0);
                case "received-low":
                    return (a.totalReceived || 0) - (b.totalReceived || 0);
                default:
                    return 0;
            }
        });

        setFilteredSalesmen(filtered);
    };

    // Calculate graph data from real stats
    const calculateGraphData = () => {
        if (!graph) return { labels: [], deal: [], received: [] };

        // For monthly data
        if (filter === "monthly") {
            return {
                labels: graph.monthly.labels,
                deal: graph.monthly.deal,
                received: graph.monthly.received
            };
        }

        // For yearly data
        return {
            labels: graph.yearly.labels,
            deal: graph.yearly.deal,
            received: graph.yearly.received
        };
    };

    if (!graph) return <div>Loading graph...</div>;

    if (loading || !stats) return <div className="p-6 text-center">Loading...</div>;

    const chartDataConfig = calculateGraphData();

    const chartData = {
        labels: chartDataConfig.labels,
        datasets: [
            {
                label: "Deal Amount",
                data: chartDataConfig.deal,
                borderColor: "#0070b9",
                backgroundColor: "rgba(0,112,185,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 4,
            },
            {
                label: "Payment Received",
                data: chartDataConfig.received,
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
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                grid: { color: "#eee" },
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '₹' + value.toLocaleString();
                    }
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        tooltips: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += '₹' + context.parsed.y.toLocaleString();
                    return label;
                }
            }
        }
    };

    return (
        <div className="p-6 fade-in-up">

            <div className="bg-white shadow rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Payment Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Total Deal Amount + GST</p>
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
                <KPI title="Total Deal Amount + GST" value={`₹${Number(stats.totalDealAmount).toLocaleString()}`} color={primary} />
                <KPI title="Total Payment Received" value={`₹${Number(stats.totalReceived).toLocaleString()}`} color={primary} />
                <KPI title="Total Due Amount" value={`₹${Number(stats.balanceAmount).toLocaleString()}`} color={primary} />
            </div>

            {/* ---------- CHART CARD ---------- */}
            <div className="bg-white shadow rounded-xl p-6 mb-10">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: primary }}>
                        Deal Growth Overview
                    </h2>

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
                {/* <div className="mt-4 text-sm text-gray-600 text-center">
                    <p>Chart shows deal amounts and actual received payments (including approved second payments)</p>
                </div> */}
            </div>

            {/* ---------- SALESMEN LIST WITH FILTERS ---------- */}
            <div className="bg-white shadow rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: primary }}>
                        Users Overview
                    </h2>

                    <div className="flex gap-2 items-center">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search by name or designation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 rounded-lg text-sm w-64"
                        />

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border p-2 rounded-lg text-sm"
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="clients-high">Clients (High to Low)</option>
                            <option value="clients-low">Clients (Low to High)</option>
                            <option value="deal-high">Deal Amount (High to Low)</option>
                            <option value="deal-low">Deal Amount (Low to High)</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredSalesmen.length} of {salesmen.length} users
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3">Name</th>
                                <th className="p-3">Designation</th>
                                <th className="p-3">Total Clients</th>
                                <th className="p-3">Total Deal Amount</th>
                                {/* <th className="p-3">Total Received</th> */}
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSalesmen.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredSalesmen.map((s) => {
                                    const hasReceived = Number(s.totalReceived || 0) > 0;
                                    const receivedPercentage = s.totalDealAmount > 0
                                        ? ((s.totalReceived || 0) / s.totalDealAmount * 100).toFixed(1)
                                        : 0;

                                    return (
                                        <tr
                                            key={s._id}
                                            className={`border-b ${hasReceived ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}`}
                                        >
                                            <td className="p-3 font-medium">{s.name || "N/A"}</td>
                                            <td className="p-3 text-gray-600 capitalize">{s.designation || "N/A"}</td>
                                            <td className="p-3">{s.totalClients || 0}</td>
                                            <td className="p-3">₹{Number(s.totalDealAmount || 0).toLocaleString()}</td>
                                            {/* <td className="p-3">
                                                <div>
                                                    <div className="font-medium text-green-600">
                                                        ₹{Number(s.totalReceived || 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {receivedPercentage}% collected
                                                    </div>
                                                </div>
                                            </td> */}
                                            <td className="p-3">
                                                <a
                                                    href={`/admin/salesman/${s._id}`}
                                                    className="text-white px-4 py-1 rounded inline-block"
                                                    style={{ background: primary }}
                                                >
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
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