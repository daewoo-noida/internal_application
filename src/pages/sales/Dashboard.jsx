import React, { useEffect, useState } from "react";
import { clientAPI } from "../../utils/api";
import PaymentUpdateModal from "../../components/PaymentUpdateModal";
import { useNavigate } from "react-router-dom";

export default function SalesDashboard() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalDealAmount: 0,
    totalPaymentReceived: 0,
    totalDueAmount: 0,
    totalApprovedSecondPayments: 0,
    collectionPercentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [user, setUser] = useState(null);

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

  // Function to get user's role for a specific client
  // const getUserRoleForClient = (client, userId) => {
  //   const roles = [];

  //   if (client.createdBy?._id === userId || client.createdBy === userId) {
  //     roles.push('Creator');
  //   }
  //   if (client.bda?._id === userId || client.bda === userId) {
  //     roles.push('BDA');
  //   }
  //   if (client.bde?._id === userId || client.bde === userId) {
  //     roles.push('BDE');
  //   }
  //   if (client.bdm?._id === userId || client.bdm === userId) {
  //     roles.push('BDM');
  //   }
  //   if (client.bhead?._id === userId || client.bhead === userId) {
  //     roles.push('BHead');
  //   }

  //   return roles.length > 0 ? roles.join(', ') : 'N/A';
  // };

  // ======================================
  // FETCH CLIENTS OF LOGGED-IN SALES USER
  // ======================================
  // ======================================
  // FETCH CLIENTS OF LOGGED-IN SALES USER
  // ======================================
  const fetchClients = async () => {
    try {
      setLoading(true);

      // Get user data from localStorage
      const userDataString = localStorage.getItem("userData");
      console.log("userData string from localStorage:", userDataString);

      let userData = null;

      if (userDataString) {
        try {
          userData = JSON.parse(userDataString);
          console.log("Parsed userData:", userData);
        } catch (parseError) {
          console.error("Error parsing userData from localStorage:", parseError);
          setLoading(false);
          return;
        }
      }

      // Debug: Check what we have
      console.log("Final userData:", userData);

      // Check for both id and _id (Mongoose uses _id, but your data has id)
      const userId = userData?._id || userData?.id;

      if (!userData || !userId) {
        console.error("No valid user data found.");
        console.log("User data available:", userData);
        setLoading(false);
        return;
      }

      setUser(userData);

      // Get all clients (backend should filter based on user roles)
      const res = await clientAPI.getAll();
      const allClients = res.data.clients || [];

      console.log("Total clients from API:", allClients.length);
      console.log("User ID for filtering:", userId);

      // Filter clients where user appears in ANY role
      const userClients = allClients.filter(client => {
        // Helper function to compare IDs
        const compareIds = (id1, id2) => {
          if (!id1 || !id2) return false;
          return id1.toString() === id2.toString();
        };

        // Get IDs from client (check both _id and id fields)
        const clientCreatedBy = client.createdBy?._id || client.createdBy?.id || client.createdBy;
        const clientBDA = client.bda?._id || client.bda?.id || client.bda;
        const clientBDE = client.bde?._id || client.bde?.id || client.bde;
        const clientBDM = client.bdm?._id || client.bdm?.id || client.bdm;
        const clientBHead = client.bhead?._id || client.bhead?.id || client.bhead;

        return (
          compareIds(clientCreatedBy, userId) ||
          compareIds(clientBDA, userId) ||
          compareIds(clientBDE, userId) ||
          compareIds(clientBDM, userId) ||
          compareIds(clientBHead, userId)
        );
      });

      console.log("Filtered clients for user:", userClients.length);

      // Process clients to add calculated fields
      const processedClients = userClients.map(client => {
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
          _approvedPaymentsCount: client.secondPayments?.filter(p => p.status === "approved").length || 0,
          _userRole: getUserRoleForClient(client, userId) // Pass userId here
        };
      });

      setClients(processedClients);

      // ---- CALCULATE STATS WITH APPROVED PAYMENTS ----
      const totalSubmissions = userClients.length;
      let totalDealAmount = 0;
      let totalTokenReceived = 0;
      let totalApprovedSecondPayments = 0;
      let totalPaymentReceived = 0;

      userClients.forEach((c) => {
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

  // Also update the getUserRoleForClient function to handle both id and _id:
  const getUserRoleForClient = (client, userId) => {
    const roles = [];

    // Helper to compare IDs
    const compareIds = (id1, id2) => {
      if (!id1 || !id2) return false;
      return id1.toString() === id2.toString();
    };

    // Check createdBy (check both _id and id fields)
    const clientCreatedById = client.createdBy?._id || client.createdBy?.id || client.createdBy;
    if (compareIds(clientCreatedById, userId)) {
      roles.push('Creator');
    }

    // Check bda
    const clientBDAId = client.bda?._id || client.bda?.id || client.bda;
    if (compareIds(clientBDAId, userId)) {
      roles.push('BDA');
    }

    // Check bde
    const clientBDEId = client.bde?._id || client.bde?.id || client.bde;
    if (compareIds(clientBDEId, userId)) {
      roles.push('BDE');
    }

    // Check bdm
    const clientBDMId = client.bdm?._id || client.bdm?.id || client.bdm;
    if (compareIds(clientBDMId, userId)) {
      roles.push('BDM');
    }

    // Check bhead
    const clientBHeadId = client.bhead?._id || client.bhead?.id || client.bhead;
    if (compareIds(clientBHeadId, userId)) {
      roles.push('BHead');
    }

    return roles.length > 0 ? roles.join(', ') : 'N/A';
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

  // Fix for .toLocaleString() error - add safe number formatting
  const safeFormatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString();
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
          <p className="text-3xl font-bold">₹{safeFormatNumber(stats.totalDealAmount)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Payment Received</p>
          <p className="text-3xl font-bold">₹{safeFormatNumber(stats.totalPaymentReceived)}</p>
          <p className="text-xs text-gray-500 mt-1">
            (Token: ₹{safeFormatNumber(stats.totalTokenReceived)} + Approved: ₹{safeFormatNumber(stats.totalApprovedSecondPayments)})
          </p>
          <p className="text-xs text-gray-500">
            {stats.collectionPercentage}% Collected
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Total Due Amount</p>
          <p className="text-3xl font-bold">₹{safeFormatNumber(stats.totalDueAmount)}</p>
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
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">CLIENT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium">CLIENT NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium">YOUR ROLE</th>
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
                  <td colSpan="12" className="text-center py-10 text-gray-500">
                    No clients found where you are assigned (Creator, BDA, BDE, BDM, or BHead)
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
                      <td className="px-6 py-4 font-mono text-sm">{c.clientId || "N/A"}</td>
                      <td className="px-6 py-4 font-medium">{c.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {c._userRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{safeFormatNumber(dealAmount)}
                      </td>
                      <td className="px-6 py-4">
                        ₹{safeFormatNumber(c.tokenReceivedAmount || 0)}
                      </td>
                      <td className="px-6 py-4">
                        {approvedPaymentsCount > 0 ? (
                          <div>
                            <span className="text-green-600 font-medium">
                              ₹{safeFormatNumber(approvedSecondPayments)}
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
                        ₹{safeFormatNumber(totalReceived)}
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
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
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
                        ₹{safeFormatNumber(balanceAmount)}
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