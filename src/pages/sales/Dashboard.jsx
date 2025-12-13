import React, { useEffect, useState } from "react";
import { clientAPI } from "../../utils/api";
import PaymentUpdateModal from "../../components/PaymentUpdateModal";
import { useNavigate } from "react-router-dom";
import {
  Users, DollarSign, CreditCard, TrendingUp,
  Eye, PlusCircle, FileText, Calendar,
  ChevronRight, TrendingDown, CheckCircle, Clock, AlertCircle
} from "lucide-react";

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
  const getUserRoleForClient = (client, userId) => {
    const roles = [];

    if (client.createdBy?._id === userId || client.createdBy === userId) {
      roles.push('Creator');
    }
    if (client.bda?._id === userId || client.bda === userId) {
      roles.push('BDA');
    }
    if (client.bde?._id === userId || client.bde === userId) {
      roles.push('BDE');
    }
    if (client.bdm?._id === userId || client.bdm === userId) {
      roles.push('BDM');
    }
    if (client.bhead?._id === userId || client.bhead === userId) {
      roles.push('BHead');
    }

    return roles.length > 0 ? roles.join(', ') : 'N/A';
  };

  // ======================================
  // FETCH CLIENTS OF LOGGED-IN SALES USER
  // ======================================
  const fetchClients = async () => {
    try {
      setLoading(true);

      // Get user data from localStorage
      const userDataString = localStorage.getItem("userData");
      let userData = null;

      if (userDataString) {
        try {
          userData = JSON.parse(userDataString);
        } catch (parseError) {
          console.error("Error parsing userData:", parseError);
          setLoading(false);
          return;
        }
      }

      const userId = userData?._id || userData?.id;

      if (!userData || !userId) {
        console.error("No valid user data found.");
        setLoading(false);
        return;
      }

      setUser(userData);

      // Get all clients
      const res = await clientAPI.getAll();
      const allClients = res.data.clients || [];

      // Filter clients where user appears in ANY role
      const userClients = allClients.filter(client => {
        const compareIds = (id1, id2) => {
          if (!id1 || !id2) return false;
          return id1.toString() === id2.toString();
        };

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
          _userRole: getUserRoleForClient(client, userId)
        };
      });

      setClients(processedClients);

      // Calculate stats
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

    // If no payment received at all
    if (receivedPercent === 0) return "Pending";

    // If payment received but less than 100%
    if (receivedPercent < 100) return "Partial";

    // If payment is 100% or more (includes GST)
    return "Completed";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle size={16} className="text-green-500" />;
      case "Pending": return <Clock size={16} className="text-yellow-500" />;
      case "Partial": return <AlertCircle size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const formatCurrency = (num) => {
    if (num === undefined || num === null) return "₹0";
    return `₹${Number(num).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6" style={{ marginTop: "10vh" }}>

      {/* HEADER */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Sales Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">Overview of your clients and payments</p>
      </div>

      {/* ======================= */}
      {/*      MODERN KPI CARDS   */}
      {/* ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Total Submissions Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 rounded-xl bg-blue-50">
              <Users className="text-[#0070b9]" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm font-medium">Total Clients</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{stats.totalSubmissions}</p>
          <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">Clients assigned to you</p>
        </div>

        {/* Total Deal Amount Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 rounded-xl bg-purple-50">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm font-medium">Total Deal Amount + GST</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{formatCurrency(stats.totalDealAmount)}</p>
          <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">Total agreement value</p>
        </div>

        {/* Total Received Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 rounded-xl bg-green-50">
              <CreditCard className="text-green-600" size={20} />
            </div>
            <div className="flex items-center">
              <span className={`text-xs md:text-sm font-medium ${stats.collectionPercentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.collectionPercentage}%
              </span>
              {stats.collectionPercentage >= 70 ?
                <TrendingUp className="text-green-500 ml-1" size={14} /> :
                <TrendingDown className="text-orange-500 ml-1" size={14} />
              }
            </div>
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm font-medium">Total Received</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{formatCurrency(stats.totalPaymentReceived)}</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-1 md:mt-2 gap-1">
            <span className="text-gray-400 text-xs">Token: {formatCurrency(stats.totalTokenReceived)}</span>
            <span className="text-gray-400 text-xs">Approved: {formatCurrency(stats.totalApprovedSecondPayments)}</span>
          </div>
        </div>

        {/* Total Due Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 rounded-xl bg-orange-50">
              <FileText className="text-orange-600" size={20} />
            </div>
            <TrendingDown className="text-orange-500" size={16} />
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm font-medium">Total Due Amount</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2">{formatCurrency(stats.totalDueAmount)}</p>
          <div className="mt-2 md:mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{
                  width: `${stats.totalDealAmount > 0 ? Math.min((stats.totalDueAmount / stats.totalDealAmount) * 100, 100) : 0}%`
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs mt-1 md:mt-2">
              {stats.totalDealAmount > 0 ? `${((stats.totalDueAmount / stats.totalDealAmount) * 100).toFixed(1)}% Pending` : '0% Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/*   CLIENT LIST SECTION   */}
      {/* ======================= */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Client Portfolio</h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">Manage your assigned clients</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
              {clients.length} Clients
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 md:py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="py-12 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 mb-3 md:mb-4">
              <Users className="text-gray-400" size={24} />
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-1 md:mb-2">No clients found</h3>
            <p className="text-gray-500 text-sm md:text-base">You are not assigned to any clients yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Details</th>
                  <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Financial Overview</th>
                  <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {clients.map((c) => {
                  const totalReceived = calculateClientTotalReceived(c);
                  const approvedSecondPayments = calculateApprovedSecondPayments(c);
                  const dealAmount = Number(c.dealAmount || 0);
                  const receivedPercent = dealAmount > 0
                    ? Number(((totalReceived / dealAmount) * 100).toFixed(2))
                    : 0;
                  const balanceAmount = dealAmount - totalReceived;
                  const approvedPaymentsCount = c.secondPayments?.filter(p => p.status === "approved").length || 0;
                  const status = getPaymentStatus(c);

                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Client Details */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-blue-500 to-[#0070b9] rounded-lg flex items-center justify-center text-white font-bold text-capitalize text-sm md:text-base">
                              {c.name?.charAt(0) || "C"}
                            </div>
                            <div className="ml-3 md:ml-4">
                              <h4 className="text-sm font-semibold text-gray-900 truncate max-w-[150px] md:max-w-none">{c.name || "Unnamed Client"}</h4>
                              <div className="flex flex-col md:flex-row md:items-center mt-0.5 md:mt-1 gap-1 md:gap-0">
                                <span className="text-xs text-gray-500">{c.clientId || "N/A"}</span>
                                <span className="hidden md:inline mx-2 text-gray-300">•</span>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full self-start md:self-auto">
                                  {c._userRole}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar size={10} className="mr-1" />
                            {formatDate(c.createdAt)}
                          </div>
                        </div>
                      </td>

                      {/* Financial Overview */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="space-y-2 md:space-y-3">
                          <div>
                            <div className="flex justify-between text-xs md:text-sm">
                              <span className="text-gray-600">Deal Amount</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(dealAmount)}</span>
                            </div>
                            <div className="flex justify-between text-xs md:text-sm mt-0.5 md:mt-1">
                              <span className="text-gray-600">Received</span>
                              <span className="font-semibold text-green-600">{formatCurrency(totalReceived)}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex flex-col md:flex-row justify-between text-xs text-gray-500 gap-0.5">
                              <span>Token: {formatCurrency(c.tokenReceivedAmount || 0)}</span>
                              {approvedPaymentsCount > 0 && (
                                <span className="text-green-600">+{approvedPaymentsCount} approved payments</span>
                              )}
                            </div>
                            <div className="mt-1 md:mt-2">
                              <div className="flex justify-between text-xs mb-0.5 md:mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{receivedPercent}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                                <div
                                  className={`h-1 md:h-1.5 rounded-full ${receivedPercent === 100 ? 'bg-green-500' : receivedPercent === 0 ? 'bg-gray-400' : 'bg-blue-500'}`}
                                  style={{ width: `${Math.min(receivedPercent, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex flex-col items-start">
                          <div className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${status === "Completed" ? "bg-green-50 text-green-700" :
                            status === "Pending" ? "bg-yellow-50 text-yellow-700" :
                              "bg-blue-50 text-blue-700"
                            }`}>
                            {getStatusIcon(status)}
                            <span className="ml-1 md:ml-2">{status}</span>
                          </div>

                          {status !== "Completed" && (
                            <div className="mt-2 text-xs md:text-sm">
                              <div className="text-gray-600">Balance Due</div>
                              <div className="font-semibold text-orange-600">{formatCurrency(balanceAmount)}</div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex flex-col space-y-1.5 md:space-y-2">
                          <button
                            onClick={() => openDetails(c)}
                            className="inline-flex items-center justify-center px-2 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-[#0070b9] text-white rounded-lg hover:from-[#0070b9] hover:to-blue-700 transition-all duration-200 text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            <Eye size={14} className="mr-1 md:mr-2" />
                            View Details
                            <ChevronRight size={12} className="ml-0.5 md:ml-1" />
                          </button>

                          <button
                            onClick={() => openPaymentModal(c)}
                            className="inline-flex items-center justify-center px-2 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            <PlusCircle size={14} className="mr-1 md:mr-2" />
                            Add Payment
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {clients.length > 0 && (
          <div className="px-3 md:px-6 py-2 md:py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-gray-600 gap-1">
              <div>
                Showing <span className="font-semibold">{clients.length}</span> clients
              </div>
              <div className="mt-0 sm:mt-0">
                Total Collection: <span className="font-bold text-green-600">{formatCurrency(stats.totalPaymentReceived)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
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