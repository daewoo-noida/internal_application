import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clientAPI } from "../../utils/api";
import { FileText, Eye, Download } from "lucide-react";

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const primary = "#0070b9";

    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        loadClient();
    }, []);

    const loadClient = async () => {
        try {
            const res = await clientAPI.getById(id);
            setClient(res.data.client);
        } catch (err) {
            console.error("Client Details Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        try {
            await clientAPI.deleteClient(id);
            alert("Client deleted successfully");
            navigate("/admin/salesmen");
        } catch (err) {
            alert("Error deleting client");
        }
    };

    const approvePayment = async (paymentId) => {
        try {
            await clientAPI.approvePayment(client._id, paymentId);
            alert("Payment approved successfully");
            loadClient();
        } catch (err) {
            alert("Error approving payment");
        }
    };

    const rejectPayment = async (paymentId) => {
        if (!window.confirm("Are you sure you want to reject this payment?")) return;

        try {
            await clientAPI.rejectPayment(client._id, paymentId);
            alert("Payment rejected");
            loadClient();
        } catch (err) {
            alert("Error rejecting payment");
        }
    };

    const deletePayment = async (paymentId) => {
        if (!window.confirm("Are you sure you want to delete this payment?")) return;

        try {
            await clientAPI.deleteSecondPayment(client._id, paymentId);
            alert("Payment deleted");
            loadClient();
        } catch (err) {
            alert("Error deleting payment");
        }
    };

    // Check if file is PDF
    const isPdfFile = (filepath) => {
        if (!filepath) return false;
        const filename = filepath.split("\\").pop().split("/").pop();
        return filename.toLowerCase().endsWith('.pdf');
    };

    // Download function
    const downloadFile = (fileUrl, fileName = "file") => {
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // Keep original file extension
                const originalName = fileUrl.split('/').pop();
                a.download = originalName.includes('.') ? originalName : `${fileName}.pdf`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download error:', error);
                alert('Failed to download file');
            });
    };

    // View PDF in new tab
    const viewPdf = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    const user = JSON.parse(localStorage.getItem("userData"));

    if (loading) return <div className="p-6 text-lg">Loading...</div>;
    if (!client) return <div className="p-6 text-lg">Client not found</div>;

    return (
        <div className="p-6 space-y-10">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold" style={{ color: primary }}>
                    Client Details
                </h1>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/admin/client/edit/${client._id}`)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>

                    <Link
                        to="/admin/salesmen"
                        className="px-4 py-2 rounded text-white"
                        style={{ background: primary }}
                    >
                        Back
                    </Link>
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white shadow-xl border rounded-xl p-6">

                {/* FRANCHISE DETAILS */}
                <Section title="Franchise Details">
                    {info("Franchise Type", client.franchiseType)}

                    {/* MASTER FRANCHISE */}
                    {client.franchiseType === "Master Franchise" && (
                        <>
                            {info("Territory", client.territory)}
                        </>
                    )}

                    {/* DDP FRANCHISE */}
                    {client.franchiseType === "Daewoo District Partner Franchise" && (
                        <>
                            {info("State", client.franchiseState)}
                            {info("DDP Territory", client.territory)}
                        </>
                    )}

                    {/* SIGNATURE STORE */}
                    {client.franchiseType === "Signature" && (
                        <>
                            {info("State", client.franchiseState)}
                            {info("District", client.franchiseDistrict)}
                            {info("City", client.franchiseCity)}
                            {info("PIN Code", client.franchisePin)}
                        </>
                    )}
                </Section>

                {/* PERSONAL */}
                <Section title="Personal Information">
                    {info("Client ID", client.clientId)}
                    {info("Name", client.name)}
                    {info("Email", client.email)}
                    {info("Phone", client.phone)}
                    {info("Alternate Phone", client.altPhone)}
                    {info("State", client.personalState)}
                    {info("District", client.personalDistrict)}
                    {info("City", client.personalCity)}
                    {info("Street Address", client.personalStreetAddress)}
                    {info("PIN Code", client.personalPin)}
                </Section>

                {/* DOCUMENTS */}
                <Section title="Documents">
                    <FileRow
                        label="Aadhaar Card"
                        files={client.adharImages}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadFile={downloadFile}
                        viewPdf={viewPdf}
                        isPdfFile={isPdfFile}
                    />
                    <FileRow
                        label="PAN Card"
                        file={client.panImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadFile={downloadFile}
                        viewPdf={viewPdf}
                        isPdfFile={isPdfFile}
                    />
                    <FileRow
                        label="Company PAN"
                        file={client.companyPanImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadFile={downloadFile}
                        viewPdf={viewPdf}
                        isPdfFile={isPdfFile}
                    />
                    <FileRow
                        label="GST"
                        file={client.gstFile}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadFile={downloadFile}
                        viewPdf={viewPdf}
                        isPdfFile={isPdfFile}
                    />
                </Section>

                {/* PAYMENT DETAILS */}
                <Section title="Payment Details">
                    {info("Deal Amount", `₹ ${client.dealAmount}`)}
                    {info("Token Amount", `₹ ${client.tokenReceivedAmount}`)}
                    {info("Received %", `${client.receivedPercent}%`)}
                    {info("Remaining %", `${client.remainPercent}%`)}
                    {info("Balance Amount", `₹ ${client.balanceAmount}`)}
                    {info("Mode of Payment", client.modeOfPayment)}
                    {info("Token Date", client.tokenDate?.slice(0, 10))}
                    <FileRow
                        label="Payment Proof"
                        file={client.paymentImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadFile={downloadFile}
                        viewPdf={viewPdf}
                        isPdfFile={isPdfFile}
                    />
                </Section>

                {/* ADDITIONAL PAYMENTS */}
                {client.secondPayments?.length > 0 && (
                    <Section title="Additional Payments">
                        {/* <div className="overflow-x-auto"> */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mode</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Proof</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Approved Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {client.secondPayments.map((p, index) => {
                                        const fileRoot = import.meta.env.VITE_API_URL;
                                        const cleanedRoot = fileRoot.replace(/\/api$/, "");
                                        const clean = (p) => {
                                            if (!p) return "";
                                            return `${cleanedRoot}/uploads/${p.split("\\").pop().split("/").pop()}`;
                                        };

                                        const proofURL = clean(p.proof?.path);
                                        const isPdf = isPdfFile(p.proof?.path);

                                        return (
                                            <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">₹ {p.amount}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{p.paymentDate?.slice(0, 10)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{p.mode}</td>

                                                <td className="px-4 py-3">
                                                    {proofURL ? (
                                                        <div className="flex items-center gap-2">
                                                            {isPdf ? (
                                                                <div className="relative group">
                                                                    <div className="h-12 w-12 border border-gray-200 rounded flex flex-col items-center justify-center bg-red-50">
                                                                        <FileText className="text-red-500" size={20} />
                                                                        <span className="text-xs text-gray-600">PDF</span>
                                                                    </div>
                                                                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                                                        <button
                                                                            onClick={() => viewPdf(proofURL)}
                                                                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                                                            title="View PDF"
                                                                        >
                                                                            <Eye size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                const fileName = p.proof.path?.split("\\").pop().split("/").pop();
                                                                                downloadFile(proofURL, fileName);
                                                                            }}
                                                                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                                                            title="Download PDF"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="relative group">
                                                                    <img
                                                                        src={proofURL}
                                                                        alt={`Payment proof ${index + 1}`}
                                                                        className="h-12 w-12 object-cover rounded border cursor-pointer"
                                                                        onClick={() => {
                                                                            setPreviewImage(proofURL);
                                                                            setShowPreview(true);
                                                                        }}
                                                                    />
                                                                    <div className="absolute bottom-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const fileName = p.proof.path?.split("\\").pop().split("/").pop();
                                                                                downloadFile(proofURL, fileName);
                                                                            }}
                                                                            className="bg-blue-500 text-white p-1 rounded-tl-md"
                                                                            title="Download image"
                                                                        >
                                                                            <Download size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No File</span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {p.status === "approved" && (
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                            Approved
                                                        </span>
                                                    )}
                                                    {p.status === "pending" && (
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {p.status === "rejected" && (
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                            Rejected
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-sm font-medium">
                                                    {p.status === "approved" ? `₹ ${p.amount}` : (
                                                        <span className="text-gray-400">--</span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {p.status === "pending" && user?.role === "admin" && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => approvePayment(p._id)}
                                                                className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                                title="Approve Payment"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => rejectPayment(p._id)}
                                                                className="px-3 py-1.5 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                                                                title="Reject Payment"
                                                            >
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => deletePayment(p._id)}
                                                                className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                                title="Delete Payment"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}

                                                    {p.status !== "pending" && (
                                                        <span className="text-gray-400 text-sm">--</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* </div> */}
                    </Section>
                )}

                {/* OFFICE */}
                <Section title="Office & Allocation">
                    {info("Office Branch", client.officeBranch)}
                    {info("BDA", client.bda?.name)}
                    {info("BDE", client.bde?.name)}
                    {info("BDM", client.bdm?.name)}
                    {info("Lead Source", client.leadSource)}
                </Section>

                <Section title="Remarks">
                    <div className="p-3 bg-gray-50 rounded border">{client.remark || "--"}</div>
                </Section>
            </div>

            {showPreview && (
                <ImageModal
                    previewImage={previewImage}
                    setShowPreview={setShowPreview}
                    downloadFile={downloadFile}
                />
            )}
        </div>
    );
}

const info = (label, value) => (
    <div className="grid grid-cols-3 py-2 border-b">
        <span className="font-medium text-gray-500">{label}</span>
        <span className="col-span-2">{value || "--"}</span>
    </div>
);

function Section({ title, children }) {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-[#0070b9]">{title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg border">{children}</div>
        </div>
    );
}

function FileRow({ label, file, files, setPreviewImage, setShowPreview, downloadFile, viewPdf, isPdfFile }) {
    const fileBase = import.meta.env.VITE_API_URL;
    const cleanedRoot = fileBase.replace(/\/api$/, "");

    const cleanPath = (p) => {
        if (!p) return "";
        return `${cleanedRoot}/uploads/${p.split("\\").pop().split("/").pop()}`;
    };

    // Helper function to get file name
    const getFileName = (filepath) => {
        if (!filepath) return "";
        return filepath.split("\\").pop().split("/").pop();
    };

    // Render single file or multiple files
    const renderFileDisplay = (fileObj, index = null) => {
        const fileUrl = cleanPath(fileObj?.path);
        const isPdf = isPdfFile(fileObj?.path);
        const fileName = getFileName(fileObj?.path);

        if (isPdf) {
            // PDF Display
            return (
                <div key={index} className="relative group">
                    <div className="h-20 w-20 border border-gray-300 rounded flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-colors">
                        <FileText className="text-red-500" size={28} />
                        <span className="text-xs text-gray-600 mt-1">PDF</span>
                        <span className="text-xs text-gray-500 truncate w-16 text-center mt-1">
                            {fileName.length > 12 ? `${fileName.substring(0, 9)}...` : fileName}
                        </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                        <button
                            onClick={() => viewPdf(fileUrl)}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                            title="View PDF"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={() => downloadFile(fileUrl, fileName)}
                            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                            title="Download PDF"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            );
        } else {
            // Image Display
            return (
                <div key={index} className="relative group">
                    <img
                        src={fileUrl}
                        alt={label}
                        className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                            setPreviewImage(fileUrl);
                            setShowPreview(true);
                        }}
                    />
                    <div className="absolute bottom-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(fileUrl, fileName);
                            }}
                            className="bg-blue-600 text-white p-1 rounded-tl-md"
                            title="Download image"
                        >
                            <Download size={12} />
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="py-3 border-b">
            <div className="font-medium text-gray-600 mb-2">{label}</div>

            <div className="flex gap-3 flex-wrap">
                {files && files.map((f, i) => renderFileDisplay(f, i))}
                {file && renderFileDisplay(file)}

                {(!file && (!files || files.length === 0)) && (
                    <span className="text-gray-400 italic">No File</span>
                )}
            </div>
        </div>
    );
}

function ImageModal({ previewImage, setShowPreview, downloadFile }) {
    const fileName = previewImage?.split('/').pop() || "image.png";

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
        >
            <div
                className="relative bg-white rounded-xl shadow-2xl p-3 max-w-3xl w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-2 right-10 flex gap-2">
                    <button
                        onClick={() => downloadFile(previewImage, fileName)}
                        className="bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-blue-700"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>
                </div>

                <button
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-900"
                    onClick={() => setShowPreview(false)}
                >
                    ✕
                </button>

                <img
                    src={previewImage}
                    className="w-full max-h-[80vh] object-contain rounded"
                    alt="Preview"
                />
            </div>
        </div>
    );
}