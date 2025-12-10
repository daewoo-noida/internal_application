import React, { useEffect, useState } from "react";
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

// Register ChartJS components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [salesmen, setSalesmen] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, salesmenRes, pendingRes] = await Promise.all([
        adminAPI.stats(),
        adminAPI.salesmen(),
        adminAPI.pending(),
      ]);

      // Stats
      setStats(statsRes.data.data);

      // Salesmen list
      setSalesmen(salesmenRes.data.salesmen);

      // Pending documents
      setPendingDocs(pendingRes.data.pending);
    } catch (err) {
      console.error("Dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats)
    return <div className="p-6 text-gray-500 text-lg">Loading dashboard...</div>;

  // LINE CHART — using real stats.totalDealAmount as last point
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Deal Amount Growth",
        data: [5, 10, 8, 15, 20, stats.totalDealAmount],
        borderColor: "#0070b9",
        backgroundColor: "rgba(0,112,185,0.25)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#0070b9",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="p-6 space-y-10">

      {/* ===================== KPI CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Clients", value: stats.totalClients },
          { title: "Total Deal Amount + GST", value: `₹${stats.totalDealAmount.toLocaleString()}` },
          { title: "Payment Received", value: `₹${stats.totalReceived.toLocaleString()}` },
          { title: "Pending Due", value: `₹${stats.totalDue.toLocaleString()}` },
        ].map((box, i) => (
          <div key={i} className="bg-white shadow-sm border p-6 rounded-xl">
            <p className="text-gray-500 text-sm">{box.title}</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">{box.value}</h2>
          </div>
        ))}
      </div>

      {/* ===================== DEAL AMOUNT CHART ===================== */}
      <div className="bg-white shadow-sm border p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Deal Amount Growth</h2>
        <div className="w-full overflow-hidden">
          <Line data={chartData} options={chartOptions} height={110} />
        </div>
      </div>

      {/* ===================== SALESMEN TABLE ===================== */}
      <div className="bg-white shadow-sm border p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Salesmen Overview</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Designation</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {salesmen.map((s) => (
                <tr key={s._id}>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4 capitalize">{s.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== PENDING DOCUMENTS ===================== */}
      <div className="bg-white shadow-sm border p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Pending Documents</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Aadhar</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">PAN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">GST</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {pendingDocs.map((c, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">{c.client}</td>
                  <td className="px-6 py-4">{c.missingAadhar ? "❌ Missing" : "✅ OK"}</td>
                  <td className="px-6 py-4">{c.missingPan ? "❌ Missing" : "✅ OK"}</td>
                  <td className="px-6 py-4">{c.missingGST ? "❌ Missing" : "✅ OK"}</td>
                  <td className="px-6 py-4">{c.missingGst ? "❌ Missing" : "✅ OK"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
