import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { adminAPI } from "../../utils/api";

export default function SalesmanDetails() {
    const { id } = useParams();
    const [salesman, setSalesman] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({
        officeBranch: "",
        dob: "",
        profileImage: null,
        totalClients: 0,
        totalDealAmount: 0,
        totalReceived: 0,
        totalDue: 0,
        totalApprovedPayments: 0,
        collectionPercentage: 0,
        gender: ""
    });
    const [loading, setLoading] = useState(true);
    const primary = "#0070b9";

    useEffect(() => {
        loadData();
    }, [id]);

    // Function to calculate approved payments for a client
    const calculateClientTotalReceived = (client) => {
        const baseToken = Number(client.tokenReceivedAmount) || 0;
        const approvedSecondPayments = client.secondPayments
            ?.filter(p => p.status === "approved")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

        return baseToken + approvedSecondPayments;
    };

    const loadData = async () => {
        try {
            // 1) Get full salesman profile
            const userRes = await adminAPI.salesman(id);
            setSalesman(userRes.data.user);

            // 2) Get clients of this salesman
            const res = await adminAPI.salesmanClients(id);
            const data = res.data.clients || [];
            setClients(data);

            // 3) Compute stats with approved payments
            let totalClients = data.length;
            let totalDealAmount = 0;
            let totalTokenReceived = 0;
            let totalApprovedSecondPayments = 0;
            let totalReceived = 0;

            data.forEach((c) => {
                const deal = Number(c.dealAmount || 0);
                const baseToken = Number(c.tokenReceivedAmount || 0);

                // Calculate approved second payments
                const approvedSecondPayments = c.secondPayments
                    ?.filter(p => p.status === "approved")
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

                totalDealAmount += deal;
                totalTokenReceived += baseToken;
                totalApprovedSecondPayments += approvedSecondPayments;
            });

            totalReceived = totalTokenReceived + totalApprovedSecondPayments;
            const totalDue = totalDealAmount - totalReceived;
            const collectionPercentage = totalDealAmount > 0 ?
                Number(((totalReceived / totalDealAmount) * 100).toFixed(2)) : 0;

            setStats({
                totalClients,
                totalDealAmount,
                totalTokenReceived,
                totalApprovedSecondPayments,
                totalReceived,
                totalDue,
                collectionPercentage
            });

            // Update each client with real payment data
            const updatedClients = data.map(client => {
                const clientTotalReceived = calculateClientTotalReceived(client);
                const clientDealAmount = Number(client.dealAmount || 0);
                const clientReceivedPercent = clientDealAmount > 0 ?
                    Number(((clientTotalReceived / clientDealAmount) * 100).toFixed(2)) : 0;

                return {
                    ...client,
                    _totalReceived: clientTotalReceived,
                    _receivedPercent: clientReceivedPercent,
                    _approvedPaymentsCount: client.secondPayments?.filter(p => p.status === "approved").length || 0
                };
            });

            setClients(updatedClients);

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

            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100 w-full max-w-4xl">
                <div className="flex ">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center w-1/3">
                        {salesman?.profileImage ? (
                            <img
                                src={salesman.profileImage}
                                alt="Profile"
                                className="w-36 h-36 object-cover rounded-full border shadow-sm"
                            />
                        ) : (
                            <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-full border text-gray-500">
                                No Image
                            </div>
                        )}
                        <h2 className="text-xl font-semibold mt-4">{salesman?.name || "-"}</h2>
                        <p className="text-gray-500 capitalize">{salesman?.designation || "-"}</p>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-3 gap-y-6 gap-x-10 w-2/3 text-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-gray-900">{salesman?.email || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-900">{salesman?.phone || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Branch Office</p>
                            <p className="text-gray-900 capitalize">{salesman?.officeBranch || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                            <p className="text-gray-900">{salesman?.dob || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gender</p>
                            <p className="text-gray-900">{salesman?.gender || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Joined On</p>
                            <p className="text-gray-900">
                                {salesman?.createdAt ? new Date(salesman.createdAt).toLocaleDateString() : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT SUMMARY CARD */}
            <div className="bg-white shadow rounded-xl p-6">
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
                        <p className="text-gray-600 text-sm">Initial Token Amount</p>
                        <p className="text-lg font-semibold text-blue-600">
                            ₹{Number(stats.totalTokenReceived).toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">Approved 2nd Payments</p>
                        <p className="text-lg font-semibold text-green-600">
                            ₹{Number(stats.totalApprovedSecondPayments).toLocaleString()}
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-gray-600 text-sm">Total Received</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{Number(stats.totalReceived).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            {stats.collectionPercentage.toFixed(1)}% Collected
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
                </div>
            </div>

            {/* KPI CARDS - SIMPLIFIED */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: "Total Clients",
                        value: stats.totalClients,
                        subtext: `${stats.totalClients} Active`
                    },
                    {
                        label: "Deal Amount",
                        value: `₹${stats.totalDealAmount.toLocaleString()}`,
                        subtext: "Total Agreement Value"
                    },
                    {
                        label: "Total Collected",
                        value: `₹${stats.totalReceived.toLocaleString()}`,
                        subtext: `${stats.collectionPercentage}% Collected`
                    },
                    {
                        label: "Balance Due",
                        value: `₹${stats.totalDue.toLocaleString()}`,
                        subtext: `${(100 - stats.collectionPercentage).toFixed(1)}% Pending`
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        className="p-5 bg-white shadow rounded-lg border-l-4"
                        style={{ borderColor: primary }}
                    >
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-2xl font-semibold mt-1">{card.value}</p>
                        {card.subtext && (
                            <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* CLIENT TABLE - UPDATED WITH REAL PAYMENTS */}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                    Client Details (Including Approved Payments)
                </h2>

                <div className="overflow-x-auto">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Client ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Client Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Territory</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Deal Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Token Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Approved Payments</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Total Received</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">% Collected</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Balance</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Created</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clients.map((c) => {
                                    const approvedPaymentsCount = c.secondPayments?.filter(p => p.status === "approved").length || 0;
                                    const approvedPaymentsTotal = c.secondPayments
                                        ?.filter(p => p.status === "approved")
                                        .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

                                    const totalReceived = Number(c.tokenReceivedAmount || 0) + approvedPaymentsTotal;
                                    const balance = Number(c.dealAmount || 0) - totalReceived;
                                    const receivedPercent = Number(c.dealAmount || 0) > 0
                                        ? Number(((totalReceived / Number(c.dealAmount || 0)) * 100).toFixed(1))
                                        : 0;

                                    return (
                                        <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.clientId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{c.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{c.territory || "-"}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                ₹{Number(c.dealAmount || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                ₹{Number(c.tokenReceivedAmount || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {approvedPaymentsCount > 0 ? (
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium text-green-600">
                                                            ₹{approvedPaymentsTotal.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {approvedPaymentsCount} approved
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                                ₹{totalReceived.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                                        <div
                                                            className="bg-green-500 h-1.5 rounded-full"
                                                            style={{ width: `${Math.min(receivedPercent, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{receivedPercent}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-orange-600">
                                                ₹{balance.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${receivedPercent >= 100
                                                    ? "bg-green-100 text-green-800"
                                                    : receivedPercent === 0
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-blue-100 text-blue-800"
                                                    }`}>
                                                    {receivedPercent >= 100
                                                        ? "Completed"
                                                        : receivedPercent === 0
                                                            ? "Pending"
                                                            : "Partial"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                                    {c._userRole || 'Creator'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    to={`/admin/client/${c._id}`}
                                                    className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}