import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAPI } from "../../utils/api";
import { FileText, Eye, Download } from "lucide-react";

export default function SalesClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Function to calculate payment details
    const calculatePaymentDetails = (client) => {
        if (!client) return {
            totalReceived: 0,
            receivedPercent: 0,
            remainPercent: 100,
            balanceAmount: 0
        };

        const dealAmount = Number(client.dealAmount) || 0;
        const baseToken = Number(client.tokenReceivedAmount) || 0;

        // Calculate approved second payments
        const approvedSecondPayments = client.secondPayments
            ?.filter(p => p.status === "approved")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

        const totalReceived = baseToken + approvedSecondPayments;
        const receivedPercent = dealAmount > 0 ? ((totalReceived / dealAmount) * 100).toFixed(2) : 0;
        const remainPercent = (100 - Number(receivedPercent)).toFixed(2);
        const balanceAmount = dealAmount - totalReceived;

        return {
            totalReceived,
            receivedPercent,
            remainPercent,
            balanceAmount
        };
    };

    // Check if file is PDF
    const isPdfFile = (filepath) => {
        if (!filepath) return false;
        const filename = typeof filepath === 'string'
            ? filepath.split("\\").pop().split("/").pop()
            : filepath.path?.split("\\").pop().split("/").pop() || '';
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

    if (loading) return <div className="p-6 text-lg">Loading...</div>;
    if (!client) return <div className="p-6 text-lg">Client not found</div>;

    // Calculate payment details
    const paymentDetails = calculatePaymentDetails(client);

    return (
        <div className="p-6 space-y-10 mt-5">
            {/* PAGE HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#0070b9]">
                    Client Details
                </h1>

                <button
                    onClick={() => navigate("/sales/dashboard")}
                    className="px-4 py-2 rounded text-white bg-[#0070b9]"
                >
                    Back
                </button>
            </div>

            {/* MAIN DETAILS CARD */}
            <div className="bg-white shadow-xl border rounded-xl p-6">

                {/* FRANCHISE DETAILS */}
                <Section title="Franchise Details">

                    {info("Franchise Type", client.franchiseType)}

                    {client.franchiseType === "Master Franchise" && (
                        <>
                            {info("Territory", client.territory)}
                        </>
                    )}

                    {client.franchiseType === "Daewoo District Partner Franchise" && (
                        <>
                            {info("State", client.franchiseState)}
                            {info("DDP Territory", client.territory)}
                        </>
                    )}

                    {client.franchiseType === "Signature" && (
                        <>
                            {info("State", client.franchiseState)}
                            {info("District", client.franchiseDistrict)}
                            {info("City", client.franchiseCity)}
                            {info("PIN Code", client.franchisePin)}
                        </>
                    )}

                </Section>

                {/* PERSONAL INFORMATION */}
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

                {/* PAYMENT SUMMARY */}
                <Section title="Payment Summary">
                    {info("Deal Amount", `₹ ${client.dealAmount ? Number(client.dealAmount).toLocaleString() : '0'}`)}
                    {info("Received Amount", `₹ ${paymentDetails.totalReceived.toLocaleString()}`)}
                    {info("Received %", `${paymentDetails.receivedPercent}%`)}
                    {info("Remaining %", `${paymentDetails.remainPercent}%`)}
                    {info("Balance Amount", `₹ ${paymentDetails.balanceAmount.toLocaleString()}`)}
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
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border">
                                        <th className="p-3 text-left">#</th>
                                        <th className="p-3 text-left">Amount</th>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Mode</th>
                                        <th className="p-3 text-left">Txn ID</th>
                                        <th className="p-3 text-left">Proof</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-left">Approved Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        client.secondPayments.map((p, i) => {
                                            const fileRoot = import.meta.env.VITE_API_URL;
                                            const cleanedRoot = fileRoot.replace(/\/api$/, "");

                                            // FIXED: Handle both string and object paths
                                            const clean = (path) => {
                                                if (!path) return "";

                                                // If path is an object with a path property
                                                if (typeof path === 'object' && path !== null) {
                                                    path = path.path || path.url || path.filename || "";
                                                }

                                                // If it's still not a string, return empty
                                                if (typeof path !== 'string') {
                                                    console.warn('Path is not a string:', path);
                                                    return "";
                                                }

                                                return `${cleanedRoot}/uploads/${path.split("\\").pop().split("/").pop()}`;
                                            };

                                            // Get the proof URL - p.proof is likely an object
                                            const proofURL = p.proof ? clean(p.proof) : null;
                                            const isPdf = isPdfFile(p.proof);

                                            const rowColor =
                                                p.status === "approved"
                                                    ? "bg-green-50"
                                                    : p.status === "rejected"
                                                        ? "bg-red-50"
                                                        : "bg-yellow-50";

                                            return (
                                                <tr key={p._id} className={`${rowColor} border`}>
                                                    <td className="p-3">{i + 1}</td>
                                                    <td className="p-3 font-semibold">₹ {p.amount}</td>
                                                    <td className="p-3">{p.paymentDate?.slice(0, 10)}</td>
                                                    <td className="p-3">{p.mode}</td>
                                                    <td className="p-3">{p.transactionId || "--"}</td>

                                                    <td className="p-3">
                                                        {proofURL ? (
                                                            isPdf ? (
                                                                // PDF Display
                                                                <div className="relative group">
                                                                    <div className="h-16 w-16 border border-gray-300 rounded flex flex-col items-center justify-center bg-red-50">
                                                                        <FileText className="text-red-500" size={24} />
                                                                        <span className="text-xs text-gray-600 mt-1">PDF</span>
                                                                    </div>
                                                                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                                                        <button
                                                                            onClick={() => viewPdf(proofURL)}
                                                                            className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                                                                            title="View PDF"
                                                                        >
                                                                            <Eye size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                const fileName = typeof p.proof === 'string'
                                                                                    ? p.proof.split("\\").pop().split("/").pop()
                                                                                    : p.proof?.path?.split("\\").pop().split("/").pop() || 'document.pdf';
                                                                                downloadFile(proofURL, fileName);
                                                                            }}
                                                                            className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                                                                            title="Download PDF"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                // Image Display
                                                                <div className="relative group">
                                                                    <img
                                                                        src={proofURL}
                                                                        alt={`Payment proof ${i + 1}`}
                                                                        className="h-16 w-16 object-cover rounded border cursor-pointer"
                                                                        onClick={() => {
                                                                            setPreviewImage(proofURL);
                                                                            setShowPreview(true);
                                                                        }}
                                                                    />
                                                                    <div className="absolute bottom-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const fileName = typeof p.proof === 'string'
                                                                                    ? p.proof.split("\\").pop().split("/").pop()
                                                                                    : p.proof?.path?.split("\\").pop().split("/").pop() || 'image.png';
                                                                                downloadFile(proofURL, fileName);
                                                                            }}
                                                                            className="bg-blue-600 text-white p-1 rounded-tl-md"
                                                                            title="Download image"
                                                                        >
                                                                            <Download size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <span className="text-gray-400">No File</span>
                                                        )}
                                                    </td>

                                                    <td className="p-3 font-medium">
                                                        {p.status === "approved" && (
                                                            <span className="bg-green-200 text-green-800 px-3 py-1 rounded">Approved</span>
                                                        )}
                                                        {p.status === "pending" && (
                                                            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">Pending</span>
                                                        )}
                                                        {p.status === "rejected" && (
                                                            <span className="bg-red-200 text-red-800 px-3 py-1 rounded">Rejected</span>
                                                        )}
                                                    </td>

                                                    <td className="p-3 font-semibold">
                                                        {p.status === "approved" ? `₹ ${p.amount}` : "--"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Section>
                )}

                {/* REMARKS */}
                <Section title="Remarks">
                    <div className="p-3 bg-gray-50 rounded border">{client.remark || "--"}</div>
                </Section>
            </div>

            {/* IMAGE MODAL */}
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

/* Helper Components */

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
    const fileRoot = import.meta.env.VITE_API_URL;
    const cleanedRoot = fileRoot.replace(/\/api$/, "");

    const clean = (p) => {
        if (!p) return "";

        // Handle both object and string paths
        if (typeof p === 'object' && p !== null) {
            p = p.path || p.url || p.filename || "";
        }

        if (typeof p !== 'string') {
            return "";
        }

        return `${cleanedRoot}/uploads/${p.split("\\").pop().split("/").pop()}`;
    };

    // Helper function to get file name
    const getFileName = (fileObj) => {
        if (!fileObj) return "";

        let path = fileObj;
        if (typeof fileObj === 'object' && fileObj !== null) {
            path = fileObj.path || fileObj.url || fileObj.filename || "";
        }

        if (typeof path !== 'string') {
            return "";
        }

        return path.split("\\").pop().split("/").pop();
    };

    // Render single file or multiple files
    const renderFileDisplay = (fileObj, index = null) => {
        const fileUrl = clean(fileObj);
        const isPdf = isPdfFile(fileObj);
        const fileName = getFileName(fileObj);

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
                    className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-800"
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