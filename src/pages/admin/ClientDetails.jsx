import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clientAPI } from "../../utils/api";
import axios from "axios";

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const primary = "#0070b9";

    // ⭐ IMAGE PREVIEW STATES
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

            loadClient(); // refresh data
        } catch (err) {
            console.log(err);
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
            console.log(err);
            alert("Error rejecting payment");
        }
    };

    const user = JSON.parse(localStorage.getItem("userData"));

    // console.log("Logged User:", user);
    // console.log("Is Admin:", user?.role === "admin");


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

                {/* PERSONAL */}
                <Section title="Personal Information">
                    {info("Name", client.name)}
                    {info("Email", client.email)}
                    {info("Phone", client.phone)}
                    {info("Alternate Phone", client.altPhone)}
                    {info("Territory", client.territory)}
                    {info("State", client.state)}
                    {info("District", client.district)}
                    {info("City", client.city)}
                    {info("Street Address", client.streetAddress)}
                    {info("PIN Code", client.pin)}
                </Section>

                {/* DOCUMENTS */}
                <Section title="Documents">
                    <FileRow
                        label="Aadhaar Card"
                        files={client.adharImages}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                    />
                    <FileRow
                        label="PAN Card"
                        file={client.panImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                    />
                    <FileRow
                        label="Company PAN"
                        file={client.companyPanImage}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                    />
                    <FileRow
                        label="Address Proof"
                        file={client.addressProof}
                        setPreviewImage={setPreviewImage}
                        setShowPreview={setShowPreview}
                    />
                </Section>

                {/* PAYMENT */}
                <Section title="Payment Details">
                    {info("Deal Amount", `₹ ${client.dealAmount}`)}
                    {info("Received Amount", `₹ ${client.tokenReceivedAmount}`)}
                    {info("Received %", `${client.receivedPercent}%`)}
                    {info("Remaining %", `${client.remainPercent}%`)}
                    {info("Balance Amount", `₹ ${client.balanceAmount}`)}
                    {info("Mode of Payment", client.modeOfPayment)}
                    {info("Token Date", client.tokenDate?.slice(0, 10))}
                </Section>
                {/* PAYMENT HISTORY */}

                {client.secondPayments && client.secondPayments.length > 0 && (
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
                                        const proofURL = p.proof
                                            ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${p.proof.path.split("\\").pop()}`
                                            : null;

                                        // Row background color
                                        const rowColor =
                                            p.status === "approved"
                                                ? "bg-green-50"
                                                : p.status === "rejected"
                                                    ? "bg-red-50"
                                                    : "bg-yellow-50";

                                        return (
                                            <tr key={p._id} className={`${rowColor} border hover:bg-gray-100`}>
                                                <td className="p-3">{index + 1}</td>

                                                <td className="p-3 font-semibold">₹ {p.amount}</td>

                                                <td className="p-3">{p.paymentDate?.slice(0, 10)}</td>

                                                <td className="p-3">{p.mode}</td>

                                                <td className="p-3">{p.transactionId || "--"}</td>

                                                <td className="p-3">
                                                    {proofURL ? (
                                                        <img
                                                            src={proofURL}
                                                            alt="proof"
                                                            className="h-16 w-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                                            onClick={() => {
                                                                setPreviewImage(proofURL);
                                                                setShowPreview(true);
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">No File</span>
                                                    )}
                                                </td>

                                                {/* STATUS */}
                                                <td className="p-3 font-medium">
                                                    {p.status === "approved" && (
                                                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded">
                                                            Approved
                                                        </span>
                                                    )}
                                                    {p.status === "pending" && (
                                                        <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {p.status === "rejected" && (
                                                        <span className="bg-red-200 text-red-800 px-3 py-1 rounded">
                                                            Rejected
                                                        </span>
                                                    )}
                                                </td>

                                                {/* APPROVED AMOUNT */}
                                                <td className="p-3 font-semibold">
                                                    {p.status === "approved" ? `₹ ${p.amount}` : "--"}
                                                </td>

                                                {/* APPROVE / REJECT BUTTONS FOR ADMIN */}
                                                <td className="p-3">
                                                    {p.status === "pending" && user?.role === "admin" && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => approvePayment(p._id)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() => rejectPayment(p._id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    {p.status !== "pending" && (
                                                        <span className="text-gray-500">--</span>
                                                    )}
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

                {/* REMARKS */}
                <Section title="Remarks">
                    <div className="p-3 bg-gray-50 rounded border">{client.remark || "--"}</div>
                </Section>
            </div>


            {/* IMAGE PREVIEW MODAL */}
            {showPreview && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative bg-white rounded-xl shadow-2xl p-3 max-w-3xl w-[90%] animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition"
                            onClick={() => setShowPreview(false)}
                        >
                            ✕
                        </button>

                        {/* Image */}
                        <img
                            src={previewImage}
                            alt="preview"
                            className="w-full max-h-[80vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}


        </div>
    );
}

/* ----------- Helper Components ----------- */

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

function FileRow({ label, file, files, setPreviewImage, setShowPreview }) {
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

                {/* Multiple files */}
                {files &&
                    files.map((f, i) => (
                        <img
                            key={i}
                            src={cleanPath(f.path)}
                            alt="document"
                            className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => {
                                setPreviewImage(cleanPath(f.path));
                                setShowPreview(true);
                            }}
                        />
                    ))}

                {/* Single file */}
                {file && (
                    <img
                        src={cleanPath(file.path)}
                        alt="document"
                        className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-80"
                        onClick={() => {
                            setPreviewImage(cleanPath(file.path));
                            setShowPreview(true);
                        }}
                    />
                )}

                {!file && (!files || files.length === 0) && (
                    <span className="text-gray-400">No file uploaded</span>
                )}
            </div>
        </div>
    );
}
