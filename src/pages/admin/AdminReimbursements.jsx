import { useState, useEffect } from 'react';
import { reimbursementAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminReimbursements() {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [action, setAction] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchReimbursements();
        fetchStats();
    }, [statusFilter]);

    const fetchReimbursements = async () => {
        try {
            const response = await reimbursementAPI.getAllRequests({
                status: statusFilter,
                page: 1,
                limit: 50
            });

            if (response.data.success) {
                setReimbursements(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch reimbursements');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await reimbursementAPI.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const handleAction = async () => {
        if (!selected || !action) return;

        try {
            const response = await reimbursementAPI.verifyRequest(selected._id, {
                status: action,
                adminNotes
            });

            if (response.data.success) {
                toast.success(`Reimbursement ${action} successfully`);
                fetchReimbursements();
                fetchStats();
                setSelected(null);
                setAction('');
                setAdminNotes('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'paid': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const fileRoot = import.meta.env.VITE_API_URL;
    const cleanedRoot = fileRoot.replace(/\/api$/, "");
    console.log(cleanedRoot);
    const clean = (p) => {
        if (!p) return "";
        return `${cleanedRoot}/uploads/reimbursements/${p.split("\\").pop().split("/").pop()}`;
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reimbursement Management</h1>
                    <p className="text-gray-600">Review and verify employee reimbursement requests</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.total?.totalRequests || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                            <p className="text-3xl font-bold text-gray-900">₹{(stats.total?.totalAmount || 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                            <p className="text-3xl font-bold text-yellow-600">
                                {stats.stats?.find(s => s._id === 'pending')?.count || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow">
                            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {stats.stats?.find(s => s._id === 'approved')?.count || 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0070b9] focus:border-transparent"
                            >
                                <option value="all">All Requests</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0070b9]"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reimbursements.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.user?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.user?.email}
                                                        </div>
                                                        {item.user?.designation && (
                                                            <div className="text-xs text-gray-400">
                                                                {item.user.designation}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 truncate max-w-xs">{item.reason}</div>
                                                <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">₹{item.amount}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <button
                                                    onClick={() => setSelected(item)}
                                                    className="text-[#0070b9] hover:text-[#0070b9] mr-3 px-3 py-1 border border-[#0070b9] rounded hover:bg-[#0070b9] hover:text-white transition"
                                                >
                                                    View Details
                                                </button>
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelected(item);
                                                                setAction('approved');
                                                            }}
                                                            className="text-green-600 hover:text-green-900 mr-3 px-3 py-1 border border-green-600 rounded hover:bg-green-600 hover:text-white transition"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelected(item);
                                                                setAction('rejected');
                                                            }}
                                                            className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {item.status === 'approved' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelected(item);
                                                            setAction('paid');
                                                        }}
                                                        className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded hover:bg-green-600 hover:text-white transition"
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Reimbursement Details</h3>
                                    <p className="text-sm text-gray-600">Request ID: {selected._id.substring(0, 8)}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelected(null);
                                        setAction('');
                                        setAdminNotes('');
                                    }}
                                    className="text-gray-400 hover:text-gray-500 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Basic Details */}
                                <div className="space-y-6">
                                    {/* Employee Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Employee Information</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Name:</span>
                                                <p className="text-lg font-semibold">{selected.user?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Email:</span>
                                                <p className="text-gray-700">{selected.user?.email}</p>
                                            </div>
                                            {selected.user?.designation && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Designation:</span>
                                                    <p className="text-gray-700">{selected.user.designation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expense Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Expense Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Amount</span>
                                                <p className="text-2xl font-bold text-[#0070b9]">₹{selected.amount}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Date</span>
                                                <p className="text-lg">{formatDate(selected.date)}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Category</span>
                                                <p className="text-lg capitalize">{selected.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Payment Method</span>
                                                <p className="text-lg capitalize">{selected.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">UPI Details</h4>
                                        <div className="bg-white p-3 rounded border">
                                            <p className="font-mono text-gray-800">{selected.bankDetails}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Additional Info & Actions */}
                                <div className="space-y-6">
                                    {/* Reason & Notes */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Reason</h4>
                                        <p className="text-gray-700 text-lg">{selected.reason}</p>

                                        {selected.vendor && (
                                            <div className="mt-4">
                                                <span className="text-sm font-medium text-gray-500">Vendor:</span>
                                                <p className="text-gray-700">{selected.vendor}</p>
                                            </div>
                                        )}

                                        {selected.notes && (
                                            <div className="mt-4">
                                                <h5 className="text-sm font-medium text-gray-500 mb-1">Additional Notes:</h5>
                                                <p className="text-gray-700">{selected.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h4>
                                        <div className="space-y-3">
                                            {selected.screenshot && (
                                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-[#0070b9] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        <span className="text-sm font-medium">Payment Screenshot</span>
                                                    </div>
                                                    <a
                                                        href={clean(selected.screenshot)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#0070b9] hover:text-[#0070b9] font-medium"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            )}

                                            {selected.bill && (
                                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-[#0070b9] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">Bill/Invoice</span>
                                                    </div>
                                                    <a
                                                        href={clean(selected.bill)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#0070b9] hover:text-[#0070b9] font-medium"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Timeline */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Status Timeline</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <div className="ml-3">
                                                    <span className="text-sm font-medium">Submitted</span>
                                                    <p className="text-xs text-gray-500">{formatDate(selected.createdAt)}</p>
                                                </div>
                                            </div>

                                            {selected.status !== 'pending' && (
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <div className="ml-3">
                                                        <span className="text-sm font-medium capitalize">{selected.status}</span>
                                                        <p className="text-xs text-gray-500">
                                                            {selected.verifiedAt ? formatDate(selected.verifiedAt) : 'N/A'}
                                                        </p>
                                                        {selected.verifiedBy && (
                                                            <p className="text-xs text-gray-500">
                                                                by {selected.verifiedBy?.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {selected.adminNotes && (
                                                <div className="mt-3 p-3 bg-white rounded border">
                                                    <h5 className="text-sm font-medium text-gray-900 mb-1">Admin Notes:</h5>
                                                    <p className="text-sm text-gray-700">{selected.adminNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section (only for pending/approved status) */}
                            {(selected.status === 'pending' || (selected.status === 'approved' && action === 'paid')) && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Take Action</h4>
                                    <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <p className="text-sm text-yellow-700">
                                                {selected.status === 'pending'
                                                    ? 'Review the request carefully before approving or rejecting.'
                                                    : 'Mark this request as paid once the payment has been processed.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {selected.status === 'pending' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Action</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => setAction('approved')}
                                                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${action === 'approved' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500'}`}
                                                    >
                                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="font-semibold">Approve</span>
                                                        <span className="text-xs mt-1">Mark as approved</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setAction('rejected')}
                                                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${action === 'rejected' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-500'}`}
                                                    >
                                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="font-semibold">Reject</span>
                                                        <span className="text-xs mt-1">Reject the request</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {selected.status === 'approved' && action === 'paid' && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <div className="flex items-center mb-3">
                                                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <h5 className="text-lg font-semibold text-green-800">Confirm Payment</h5>
                                                </div>
                                                <p className="text-sm text-green-700 mb-4">
                                                    This will mark the reimbursement as paid. Make sure the payment of ₹{selected.amount} has been successfully transferred to {selected.bankDetails}.
                                                </p>
                                                <button
                                                    onClick={() => setAction('paid')}
                                                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Mark as Paid
                                                </button>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes (Optional)
                                            </label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about this decision..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9] focus:border-transparent"
                                                rows="3"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                These notes will be visible to the employee.
                                            </p>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                onClick={() => {
                                                    setSelected(null);
                                                    setAction('');
                                                    setAdminNotes('');
                                                }}
                                                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAction}
                                                disabled={!action}
                                                className="px-6 py-2 bg-[#0070b9] text-white rounded-lg font-medium hover:bg-[#0070b9] disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                {action === 'approved' ? 'Approve Request' :
                                                    action === 'rejected' ? 'Reject Request' :
                                                        action === 'paid' ? 'Confirm Payment' : 'Submit Action'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}