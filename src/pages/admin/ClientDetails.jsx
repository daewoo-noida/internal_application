import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clientAPI } from "../../utils/api";

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
            await clientAPI.delete(id);
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

    // Download function - ADDED THIS
    const downloadImage = (imageUrl, fileName = "image") => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName.includes('.') ? fileName : `${fileName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download error:', error);
                alert('Failed to download image');
            });
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
                        downloadImage={downloadImage}
                    />
                    <FileRow
                        label="PAN Card"
                        file={client.panImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadImage={downloadImage}
                    />
                    <FileRow
                        label="Company PAN"
                        file={client.companyPanImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadImage={downloadImage}
                    />
                    <FileRow
                        label="GST"
                        file={client.gstFile}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                        downloadImage={downloadImage}
                    />
                </Section>

                {/* PAYMENT DETAILS */}
                <Section title="Payment Details">
                    {info("Deal Amount", `₹ ${client.dealAmount}`)}
                    {info("Received Amount", `₹ ${client.tokenReceivedAmount}`)}
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
                        downloadImage={downloadImage} // ADDED THIS
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
                                        <th className="p-3 text-left">Payment Date</th>
                                        <th className="p-3 text-left">Mode</th>
                                        <th className="p-3 text-left">Txn ID</th>
                                        <th className="p-3 text-left">Proof</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-left">Approved Amount</th>
                                        <th className="p-3 text-left">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {client.secondPayments.map((p, index) => {
                                        // Get proof URL
                                        const getProofURL = () => {
                                            if (!p.proof || !p.proof.path) return null;
                                            const fileRoot = import.meta.env.VITE_API_URL.replace("/api", "");
                                            const filename = p.proof.path.split("\\").pop().split("/").pop();
                                            return `${fileRoot}/uploads/${filename}`;
                                        };

                                        const proofURL = getProofURL();

                                        const rowColor =
                                            p.status === "approved"
                                                ? "bg-green-50"
                                                : p.status === "rejected"
                                                    ? "bg-red-50"
                                                    : "bg-yellow-50";

                                        return (
                                            <tr key={p._id} className={`${rowColor} border`}>
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3 font-semibold">₹ {p.amount}</td>
                                                <td className="p-3">{p.paymentDate?.slice(0, 10)}</td>
                                                <td className="p-3">{p.mode}</td>
                                                <td className="p-3">{p.transactionId || "--"}</td>

                                                <td className="p-3">
                                                    {proofURL ? (
                                                        <div className="flex items-center gap-2">
                                                            {/* Image with download button - ADDED THIS */}
                                                            <div className="relative group">
                                                                <img
                                                                    src={proofURL}
                                                                    alt={`Payment proof ${index + 1}`}
                                                                    className="h-16 w-16 object-cover rounded border cursor-pointer"
                                                                    onClick={() => {
                                                                        setPreviewImage(proofURL);
                                                                        setShowPreview(true);
                                                                    }}
                                                                />
                                                                {/* Download button - ADDED THIS */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const fileName = p.proof.path?.split("\\").pop().split("/").pop();
                                                                        downloadImage(proofURL, fileName);
                                                                    }}
                                                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Download image"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No File</span>
                                                    )}
                                                </td>

                                                <td className="p-3 font-medium">
                                                    {p.status === "approved" && <span className="bg-green-200 text-green-800 px-3 py-1 rounded">Approved</span>}
                                                    {p.status === "pending" && <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">Pending</span>}
                                                    {p.status === "rejected" && <span className="bg-red-200 text-red-800 px-3 py-1 rounded">Rejected</span>}
                                                </td>

                                                <td className="p-3 font-semibold">
                                                    {p.status === "approved" ? `₹ ${p.amount}` : "--"}
                                                </td>

                                                <td className="p-3">
                                                    {p.status === "pending" && user?.role === "admin" && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => approvePayment(p._id)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => rejectPayment(p._id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    {p.status !== "pending" && <span className="text-gray-500">--</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                    downloadImage={downloadImage} // ADDED THIS
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

function FileRow({ label, file, files, setPreviewImage, setShowPreview, downloadImage }) {
    const fileBase = import.meta.env.VITE_API_URL.replace("/api", "");

    const cleanPath = (p) => {
        if (!p) return "";
        const fileName = p.split("\\").pop().split("/").pop();
        return `${fileBase}/uploads/${fileName}`;
    };

    return (
        <div className="py-3 border-b">
            <div className="font-medium text-gray-600">{label}</div>

            <div className="mt-2 flex gap-3 flex-wrap">
                {files &&
                    files.map((f, i) => (
                        // Wrapped in div with download button - ADDED THIS
                        <div key={i} className="relative group">
                            <img
                                src={cleanPath(f.path)}
                                className="h-20 w-20 object-cover rounded border cursor-pointer"
                                onClick={() => {
                                    setPreviewImage(cleanPath(f.path));
                                    setShowPreview(true);
                                }}
                            />
                            {/* Download button - ADDED THIS */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fileName = f.path?.split("\\").pop().split("/").pop();
                                    downloadImage(cleanPath(f.path), fileName);
                                }}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Download image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}

                {file && (
                    // Wrapped in div with download button - ADDED THIS
                    <div className="relative group">
                        <img
                            src={cleanPath(file.path)}
                            className="h-20 w-20 object-cover rounded border cursor-pointer"
                            onClick={() => {
                                setPreviewImage(cleanPath(file.path));
                                setShowPreview(true);
                            }}
                        />
                        {/* Download button - ADDED THIS */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const fileName = file.path?.split("\\").pop().split("/").pop();
                                downloadImage(cleanPath(file.path), fileName);
                            }}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Download image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {!file && (!files || files.length === 0) && (
                    <span className="text-gray-400">No File</span>
                )}
            </div>
        </div>
    );
}

function ImageModal({ previewImage, setShowPreview, downloadImage }) {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
        >
            <div
                className="relative bg-white rounded-xl shadow-2xl p-3 max-w-3xl w-[90%]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Added download button - ADDED THIS */}
                <div className="absolute top-2 right-10 flex gap-2">
                    <button
                        onClick={() => {
                            const fileName = previewImage?.split('/').pop() || "image.png";
                            downloadImage(previewImage, fileName);
                        }}
                        className="bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-blue-700"
                        title="Download image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <button
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex justify-center items-center"
                    onClick={() => setShowPreview(false)}
                >
                    ✕
                </button>

                <img
                    src={previewImage}
                    className="w-full max-h-[80vh] object-contain rounded"
                />
            </div>
        </div>
    );
}