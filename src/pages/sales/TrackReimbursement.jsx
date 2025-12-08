import { useState, useEffect } from 'react';
import { reimbursementAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function TrackReimbursement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await reimbursementAPI.getUserRequests();
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch your reimbursement requests');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'approved': return '✅';
            case 'rejected': return '❌';
            case 'paid': return '💰';
            default: return '📝';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'paid': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Under Review';
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            case 'paid': return 'Paid';
            default: return 'Unknown';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // const getFileUrl = (filepath) => {

    const fileRoot = import.meta.env.VITE_API_URL;
    const cleanedRoot = fileRoot.replace(/\/api$/, "");
    console.log(cleanedRoot);
    const clean = (p) => {
        if (!p) return "";
        return `${cleanedRoot}/uploads/reimbursements/${p.split("\\").pop().split("/").pop()}`;
    };

    // if (!filepath) return null;

    // const cleanedPath = import.meta.evn.VITE_API_URL

    // const filename = filepath.replace('uploads/', '');
    // return `${import.meta.env.VITE_API_URL || ''}/uploads/${filename}`;
    // };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;

        try {
            // Note: You need to add delete API endpoint
            const response = await reimbursementAPI.deleteRequest(id);
            if (response.data.success) {
                toast.success('Request deleted successfully');
                fetchRequests();
            }
        } catch (error) {
            toast.error('Failed to delete request');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" style={{ marginTop: "12vh" }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Reimbursements</h1>
                    <p className="text-gray-600">View the status of all your reimbursement requests</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0070b9]"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No reimbursement requests yet</h3>
                        <p className="text-gray-600 mb-6">Submit your first reimbursement request to get started</p>
                        <a
                            href="/reimbursement"
                            className="inline-flex items-center px-6 py-3 bg-[#0070b9] text-white rounded-lg hover:bg-[#0070b9] transition font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Submit New Request
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white rounded-2xl shadow overflow-hidden">
                                {/* Request Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex items-start mb-4 md:mb-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 ${getStatusColor(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{request.reason}</h3>
                                                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                                                    <span>Submitted: {formatDate(request.createdAt)}</span>
                                                    <span className="capitalize">• {request.category}</span>
                                                    <span>• {request.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                {getStatusText(request.status)}
                                            </span>
                                            <div className="text-2xl font-bold text-[#0070b9] mt-2">₹{request.amount}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 mb-1">Bank Details</h4>
                                                <p className="text-gray-900 font-mono">{request.bankDetails}</p>
                                            </div>

                                            {request.vendor && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Vendor</h4>
                                                    <p className="text-gray-900">{request.vendor}</p>
                                                </div>
                                            )}

                                            {request.notes && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                                                    <p className="text-gray-700">{request.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column - Attachments */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">Attachments</h4>
                                            <div className="space-y-2">
                                                {request.screenshot && (
                                                    <a
                                                        href={clean(request.screenshot)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        <svg className="w-5 h-5 text-[#0070b9] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-900">Payment Screenshot</span>
                                                        <span className="ml-auto text-sm text-[#0070b9]">View</span>
                                                    </a>
                                                )}

                                                {request.bill && (
                                                    <a
                                                        href={clean(request.bill)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        <svg className="w-5 h-5 text-[#0070b9] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-900">Bill/Invoice</span>
                                                        <span className="ml-auto text-sm text-[#0070b9]">View</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Timeline */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Status Timeline</h4>
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div className="absolute top-8 left-4 w-0.5 h-12 bg-green-500"></div>
                                            </div>
                                            <div className="ml-4">
                                                <span className="text-sm font-medium">Submitted</span>
                                                <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                                            </div>
                                        </div>

                                        {request.status !== 'pending' && (
                                            <div className="flex items-center mt-4">
                                                <div className="relative">
                                                    <div className={`w-8 h-8 rounded-full ${request.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center`}>
                                                        {request.status === 'rejected' ? (
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <span className="text-sm font-medium capitalize">{request.status}</span>
                                                    <p className="text-xs text-gray-500">
                                                        {request.verifiedAt ? formatDate(request.verifiedAt) : 'N/A'}
                                                    </p>
                                                    {request.verifiedBy && (
                                                        <p className="text-xs text-gray-500">
                                                            by {request.verifiedBy?.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {request.adminNotes && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h5 className="text-sm font-medium text-gray-900 mb-1">Admin Notes:</h5>
                                                <p className="text-sm text-gray-700">{request.adminNotes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-6">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleDeleteRequest(request._id)}
                                                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
                                                >
                                                    Delete Request
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // You can add edit functionality here
                                                        toast.info('Edit functionality coming soon');
                                                    }}
                                                    className="px-4 py-2 border border-[#0070b9] text-[#0070b9] rounded-lg text-sm hover:bg-[#0070b9] hover:text-white transition"
                                                >
                                                    Edit Request
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'rejected' && (
                                            <button
                                                onClick={() => {
                                                    toast.info('Appeal functionality coming soon');
                                                }}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
                                            >
                                                Appeal Decision
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {requests.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
                                <div className="text-sm text-gray-600">Total Requests</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-[#0070b9]">
                                    ₹{requests.reduce((sum, req) => sum + req.amount, 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Total Amount</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {requests.filter(req => req.status === 'paid').length}
                                </div>
                                <div className="text-sm text-gray-600">Paid Requests</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}