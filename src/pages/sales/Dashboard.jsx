import React, { useEffect, useState } from "react";
import { clientAPI } from "../../utils/api"; // <-- Use your client API

export default function SalesDashboard() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalDealAmount: 0,
    totalPaymentReceived: 0,
    totalDueAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH CLIENTS OF LOGGED-IN SALES USER
  // ======================================
  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await clientAPI.getAll();
      const data = res.data.clients || [];

      setClients(data);

      // ---- CALCULATE STATS ----
      const totalSubmissions = data.length;
      const totalDealAmount = data.reduce(
        (sum, c) => sum + Number(c.dealAmount || 0),
        0
      );
      const totalPaymentReceived = data.reduce(
        (sum, c) => sum + Number(c.tokenReceivedAmount || 0),
        0
      );
      const totalDueAmount =
        totalDealAmount - totalPaymentReceived;

      setStats({
        totalSubmissions,
        totalDealAmount,
        totalPaymentReceived,
        totalDueAmount,
      });

      setLoading(false);
    } catch (err) {
      console.log("Dashboard Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const getPaymentStatus = (client) => {
    const percent = Number(client.receivedPercent);

    if (percent === 100) return "Completed";
    if (percent === 0) return "Pending";
    return "Partial";
  };

  return (
    <div className="min-h-screen bg-white p-6" style={{ marginTop: "10vh" }}>
      {/* ======================= */}
      {/*      KPI CARDS         */}
      {/* ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Form Submission</p>
          <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Deal Amount</p>
          <p className="text-3xl font-bold">₹{stats.totalDealAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Payment Received</p>
          <p className="text-3xl font-bold">₹{stats.totalPaymentReceived.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Total Due Amount</p>
          <p className="text-3xl font-bold">₹{stats.totalDueAmount.toLocaleString()}</p>
        </div>

      </div>

      {/* ======================= */}
      {/*   CLIENT TABLE         */}
      {/* ======================= */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">CLIENT NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium">OWNER NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium">DEAL AMOUNT</th>
                <th className="px-6 py-3 text-left text-xs font-medium">AMOUNT RECEIVED</th>
                <th className="px-6 py-3 text-left text-xs font-medium">PAYMENT STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium">RECEIVED %</th>
                <th className="px-6 py-3 text-left text-xs font-medium">EDIT</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {clients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">
                      {c.createdBy?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">₹{c.dealAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{c.tokenReceivedAmount?.toLocaleString()}</td>

                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        {getPaymentStatus(c)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">{c.receivedPercent}%</td>

                    <td className="px-6 py-4">
                      <button className="bg-[#0070b9] text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
