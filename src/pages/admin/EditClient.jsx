import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAPI } from "../../utils/api";
import axios from "axios";

export default function EditClient() {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    // For dropdown
    const [users, setUsers] = useState([]);
    const [bdaList, setBdaList] = useState([]);
    const [bdeList, setBdeList] = useState([]);
    const [bdmList, setBdmList] = useState([]);

    useEffect(() => {
        loadClient();
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/auth/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = res.data?.data || [];

            setUsers(data);
            setBdaList(data.filter(u => u.designation.toLowerCase() === "bda"));
            setBdeList(data.filter(u => u.designation.toLowerCase() === "bde"));
            setBdmList(data.filter(u => u.designation.toLowerCase() === "bdm"));
        } catch (err) {
            console.log("User Load Error", err);
        }
    };

    const loadClient = async () => {
        try {
            const res = await clientAPI.getById(id);
            setClient(res.data.client);
        } catch (err) {
            console.log("Error loading client:", err);
        } finally {
            setLoading(false);
        }
    };

    // Auto calculate on change
    const updateAmount = (key, value) => {
        const deal = Number(key === "dealAmount" ? value : client.dealAmount);
        const received = Number(key === "tokenReceivedAmount" ? value : client.tokenReceivedAmount);

        const receivedPercent = deal ? ((received / deal) * 100).toFixed(2) : 0;
        const remainPercent = (100 - receivedPercent).toFixed(2);
        const balanceAmount = deal - received;

        setClient({
            ...client,
            [key]: value,
            receivedPercent,
            remainPercent,
            balanceAmount
        });
    };

    const handleUpdate = async () => {
        try {
            await clientAPI.update(id, client);
            alert("Client updated successfully!");
            navigate(`/admin/client/${id}`);
        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

    if (loading) return <div className="p-6 text-xl">Loading...</div>;
    if (!client) return <div className="p-6 text-xl">Client not found</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#0070b9] mb-6">
                Edit Client Details
            </h1>

            {/* ===================================================== */}
            {/* PERSONAL INFORMATION */}
            {/* ===================================================== */}
            <Section title="Personal Information">
                <Grid>
                    <Field label="Name" value={client.name} onChange={(v) => setClient({ ...client, name: v })} />
                    <Field label="Email" value={client.email} onChange={(v) => setClient({ ...client, email: v })} />
                    <Field label="Phone" value={client.phone} onChange={(v) => setClient({ ...client, phone: v })} />
                    <Field label="Alternate Phone" value={client.altPhone} onChange={(v) => setClient({ ...client, altPhone: v })} />

                    <Field label="Territory" value={client.territory} onChange={(v) => setClient({ ...client, territory: v })} />
                    <Field label="State" value={client.state} onChange={(v) => setClient({ ...client, state: v })} />
                    <Field label="District" value={client.district} onChange={(v) => setClient({ ...client, district: v })} />
                    <Field label="City" value={client.city} onChange={(v) => setClient({ ...client, city: v })} />

                    <Field label="Street Address" value={client.streetAddress} onChange={(v) => setClient({ ...client, streetAddress: v })} />
                    <Field label="PIN Code" value={client.pin} onChange={(v) => setClient({ ...client, pin: v })} />
                </Grid>
            </Section>

            {/* ===================================================== */}
            {/* PAYMENT DETAILS */}
            {/* ===================================================== */}
            <Section title="Payment Details">
                <Grid>
                    <Field
                        label="Deal Amount"
                        value={client.dealAmount}
                        onChange={(v) => updateAmount("dealAmount", v)}
                    />

                    <Field
                        label="Received Amount"
                        value={client.tokenReceivedAmount}
                        onChange={(v) => updateAmount("tokenReceivedAmount", v)}
                    />

                    <ReadOnly label="Received %" value={client.receivedPercent + "%"} />
                    <ReadOnly label="Remaining %" value={client.remainPercent + "%"} />
                    <ReadOnly label="Balance Amount" value={"₹ " + client.balanceAmount} />

                    <Field label="Mode of Payment" value={client.modeOfPayment} onChange={(v) => setClient({ ...client, modeOfPayment: v })} />
                    <Field label="Token Date" type="date" value={client.tokenDate?.slice(0, 10)} onChange={(v) => setClient({ ...client, tokenDate: v })} />
                </Grid>
            </Section>

            {/* ===================================================== */}
            {/* OFFICE & ALLOCATION */}
            {/* ===================================================== */}
            <Section title="Office & Allocation">
                <Grid>
                    <Field label="Office Branch" value={client.officeBranch} onChange={(v) => setClient({ ...client, officeBranch: v })} />

                    {/* BDA */}
                    <Select
                        label="BDA"
                        value={client.bda?._id || client.bda}
                        options={bdaList}
                        onChange={(v) => setClient({ ...client, bda: v })}
                    />

                    {/* BDE */}
                    <Select
                        label="BDE"
                        value={client.bde?._id || client.bde}
                        options={bdeList}
                        onChange={(v) => setClient({ ...client, bde: v })}
                    />

                    {/* BDM */}
                    <Select
                        label="BDM"
                        value={client.bdm?._id || client.bdm}
                        options={bdmList}
                        onChange={(v) => setClient({ ...client, bdm: v })}
                    />

                    <Field label="Lead Source" value={client.leadSource} onChange={(v) => setClient({ ...client, leadSource: v })} />
                </Grid>

                <div className="mt-4">
                    <label className="text-gray-600 font-medium">Remark</label>
                    <textarea
                        className="w-full border p-3 rounded-lg mt-2"
                        value={client.remark}
                        onChange={(e) => setClient({ ...client, remark: e.target.value })}
                    ></textarea>
                </div>
            </Section>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-[#0070b9] text-white rounded-xl font-semibold hover:bg-[#005a94]"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

/* ---------------------------------------------- */
/* HELPER COMPONENTS */
/* ---------------------------------------------- */

function Section({ title, children }) {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-[#0070b9]">{title}</h2>
            <div className="bg-white border rounded-lg p-6 shadow-sm">{children}</div>
        </div>
    );
}

function Grid({ children }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function Field({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="text-gray-600">{label}</label>
            <input
                type={type}
                className="w-full border p-3 rounded-lg mt-1"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function ReadOnly({ label, value }) {
    return (
        <div>
            <label className="text-gray-600">{label}</label>
            <input
                disabled
                className="w-full border p-3 rounded-lg mt-1 bg-gray-100"
                value={value}
            />
        </div>
    );
}

function Select({ label, value, options, onChange }) {
    return (
        <div>
            <label className="text-gray-600">{label}</label>
            <select
                className="w-full border p-3 rounded-lg mt-1"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt._id} value={opt._id}>
                        {opt.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
