import React, { useEffect, useState } from "react";
import { clientAPI } from "../../utils/api";
import PaymentUpdateModal from "../../components/PaymentUpdateModal";
import { useNavigate } from "react-router-dom";

export default function SalesDashboard() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalDealAmount: 0,
    totalPaymentReceived: 0,  // This should include approved second payments
    totalDueAmount: 0,
    totalApprovedSecondPayments: 0,
    collectionPercentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const openPaymentModal = (client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  const navigate = useNavigate();

  const openDetails = (client) => {
    navigate(`/sales/client/${client._id}`);
  };

  // Function to calculate total received for a client (including approved second payments)
  const calculateClientTotalReceived = (client) => {
    const baseToken = Number(client.tokenReceivedAmount) || 0;
    const approvedSecondPayments = client.secondPayments
      ?.filter(p => p.status === "approved")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

    return baseToken + approvedSecondPayments;
  };

  // Function to calculate approved second payments for a client
  const calculateApprovedSecondPayments = (client) => {
    return client.secondPayments
      ?.filter(p => p.status === "approved")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;
  };

  // ======================================
  // FETCH CLIENTS OF LOGGED-IN SALES USER
  // ======================================
  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await clientAPI.getAll();
      const data = res.data.clients || [];

      // Process clients to add calculated fields
      const processedClients = data.map(client => {
        const totalReceived = calculateClientTotalReceived(client);
        const approvedSecondPayments = calculateApprovedSecondPayments(client);
        const dealAmount = Number(client.dealAmount || 0);
        const receivedPercent = dealAmount > 0
          ? Number(((totalReceived / dealAmount) * 100).toFixed(2))
          : 0;

        return {
          ...client,
          _totalReceived: totalReceived,
          _approvedSecondPayments: approvedSecondPayments,
          _receivedPercent: receivedPercent,
          _balanceAmount: dealAmount - totalReceived,
          _approvedPaymentsCount: client.secondPayments?.filter(p => p.status === "approved").length || 0
        };
      });

      setClients(processedClients);

      // ---- CALCULATE STATS WITH APPROVED PAYMENTS ----
      const totalSubmissions = data.length;
      let totalDealAmount = 0;
      let totalTokenReceived = 0;
      let totalApprovedSecondPayments = 0;
      let totalPaymentReceived = 0;

      data.forEach((c) => {
        const deal = Number(c.dealAmount || 0);
        const baseToken = Number(c.tokenReceivedAmount || 0);
        const approvedSecond = calculateApprovedSecondPayments(c);

        totalDealAmount += deal;
        totalTokenReceived += baseToken;
        totalApprovedSecondPayments += approvedSecond;
      });

      totalPaymentReceived = totalTokenReceived + totalApprovedSecondPayments;
      const totalDueAmount = totalDealAmount - totalPaymentReceived;
      const collectionPercentage = totalDealAmount > 0
        ? Number(((totalPaymentReceived / totalDealAmount) * 100).toFixed(2))
        : 0;

      setStats({
        totalSubmissions,
        totalDealAmount,
        totalTokenReceived,
        totalApprovedSecondPayments,
        totalPaymentReceived,
        totalDueAmount,
        collectionPercentage
      });

      setLoading(false);
    } catch (err) {
      console.log("Dashboard Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    const refreshSales = () => fetchClients();
    window.addEventListener("payment-updated", refreshSales);

    return () => window.removeEventListener("payment-updated", refreshSales);
  }, []);

  const getPaymentStatus = (client) => {
    const totalReceived = calculateClientTotalReceived(client);
    const dealAmount = Number(client.dealAmount || 0);
    const receivedPercent = dealAmount > 0
      ? Number(((totalReceived / dealAmount) * 100).toFixed(2))
      : 0;

    if (receivedPercent === 100) return "Completed";
    if (receivedPercent === 0) return "Pending";
    return "Partial";
  };

  return (
    <div className="min-h-screen bg-white p-6" style={{ marginTop: "10vh" }}>
      {/* ======================= */}
      {/*      KPI CARDS         */}
      {/* ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Submissions</p>
          <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Deal Amount</p>
          <p className="text-3xl font-bold">₹{stats.totalDealAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Payment Received</p>
          <p className="text-3xl font-bold">₹{stats.totalPaymentReceived.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            (Token: ₹{stats.totalTokenReceived.toLocaleString()} + Approved: ₹{stats.totalApprovedSecondPayments.toLocaleString()})
          </p>
          <p className="text-xs text-gray-500">
            {stats.collectionPercentage}% Collected
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Total Due Amount</p>
          <p className="text-3xl font-bold">₹{stats.totalDueAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalDealAmount > 0
              ? `${((stats.totalDueAmount / stats.totalDealAmount) * 100).toFixed(1)}% Pending`
              : '0% Pending'
            }
          </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium">TOKEN AMOUNT</th>
                <th className="px-6 py-3 text-left text-xs font-medium">APPROVED PAYMENTS</th>
                <th className="px-6 py-3 text-left text-xs font-medium">TOTAL RECEIVED</th>
                <th className="px-6 py-3 text-left text-xs font-medium">PAYMENT STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium">RECEIVED %</th>
                <th className="px-6 py-3 text-left text-xs font-medium">BALANCE</th>
                <th className="px-6 py-3 text-left text-xs font-medium">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                clients.map((c) => {
                  const totalReceived = calculateClientTotalReceived(c);
                  const approvedSecondPayments = calculateApprovedSecondPayments(c);
                  const dealAmount = Number(c.dealAmount || 0);
                  const receivedPercent = dealAmount > 0
                    ? Number(((totalReceived / dealAmount) * 100).toFixed(2))
                    : 0;
                  const balanceAmount = dealAmount - totalReceived;
                  const approvedPaymentsCount = c.secondPayments?.filter(p => p.status === "approved").length || 0;

                  return (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{c.name}</td>
                      <td className="px-6 py-4">
                        {c.createdBy?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{dealAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        ₹{Number(c.tokenReceivedAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {approvedPaymentsCount > 0 ? (
                          <div>
                            <span className="text-green-600 font-medium">
                              ₹{approvedSecondPayments.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({approvedPaymentsCount} approved)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ₹{totalReceived.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${receivedPercent === 100
                          ? "bg-green-100 text-green-800"
                          : receivedPercent === 0
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                          }`}>
                          {getPaymentStatus(c)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(receivedPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span>{receivedPercent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-orange-600">
                        ₹{balanceAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => openDetails(c)}
                          className="bg-[#0070b9] text-white px-3 py-1 rounded text-sm hover:bg-[#005a94]"
                        >
                          View
                        </button>

                        <button
                          onClick={() => openPaymentModal(c)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Add Payment
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {showPaymentModal && (
        <PaymentUpdateModal
          client={selectedClient}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => fetchClients()}
        />
      )}
    </div>
  );
}