import { useState } from "react";

export default function Reimbursement() {
    const [form, setForm] = useState({
        reason: "",
        amount: "",
        date: "",
        category: "",
        paymentMethod: "",
        vendor: "",
        notes: "",
        bank: "",
        screenshot: null,
        bill: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10" style={{ marginTop: "9vh" }}>

            {/* PAGE TITLE */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Submit Reimbursement Request
            </h1>
            <p className="text-gray-600 mb-10">
                Fill in the details below and upload your supporting documents.
            </p>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* -------------------- FORM CARD -------------------- */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-[#0070b9] uppercase">
                        Expense Details
                    </h2>

                    <div className="space-y-5">

                        {/* Reason */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Reason</label>
                            <input
                                name="reason"
                                placeholder="Ex: Client meeting travel, office purchase..."
                                value={form.reason}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9] transition"
                            />
                        </div>

                        {/* Amount + Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Amount (₹)</label>
                                <input
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070b9]"
                            >
                                <option value="">Choose category</option>
                                <option value="travel">Travel</option>
                                <option value="food">Food & Stay</option>
                                <option value="meeting">Client Meeting</option>
                                <option value="office">Office Purchase</option>
                                <option value="software">Software/Tools</option>
                                <option value="misc">Miscellaneous</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070b9]"
                            >
                                <option value="">Choose method</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                                <option value="cash">Cash</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>

                        {/* Vendor */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Vendor (optional)</label>
                            <input
                                name="vendor"
                                value={form.vendor}
                                onChange={handleChange}
                                placeholder="Store / platform name"
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Add optional details..."
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-[#0070b9]"
                            ></textarea>
                        </div>

                        {/* Bank */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Bank / UPI ID</label>
                            <input
                                name="bank"
                                value={form.bank}
                                onChange={handleChange}
                                placeholder="Enter account number or UPI ID"
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                            />
                        </div>

                        {/* Files */}
                        <div className="mt-4">
                            <label className="text-sm font-semibold text-gray-700">Payment Screenshot</label>
                            <input
                                type="file"
                                name="screenshot"
                                onChange={handleChange}
                                className="mt-1 w-full text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Bill / Invoice (optional)</label>
                            <input
                                type="file"
                                name="bill"
                                onChange={handleChange}
                                className="mt-1 w-full text-sm"
                            />
                        </div>

                        <button className="w-full bg-[#0070b9] text-white py-3 mt-4 rounded-lg font-semibold hover:bg-[#0070b9] transition">
                            Submit Request
                        </button>
                    </div>
                </div>

                {/* -------------------- PREVIEW SECTION -------------------- */}
                <div className="bg-white  rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-xl font-bold text-[#0070b9] uppercase mb-6">
                        Preview Summary
                    </h2>

                    <div className="space-y-3 text-gray-700 text-sm">
                        <p><strong>Reason:</strong> {form.reason || "---"}</p>
                        <p><strong>Amount:</strong> {form.amount ? `₹${form.amount}` : "---"}</p>
                        <p><strong>Date:</strong> {form.date || "---"}</p>
                        <p><strong>Category:</strong> {form.category || "---"}</p>
                        <p><strong>Payment Method:</strong> {form.paymentMethod || "---"}</p>
                        <p><strong>Vendor:</strong> {form.vendor || "---"}</p>
                        <p><strong>Notes:</strong> {form.notes || "---"}</p>
                        <p><strong>Bank / UPI:</strong> {form.bank || "---"}</p>

                        <p>
                            <strong>Screenshot:</strong>{" "}
                            {form.screenshot ? form.screenshot.name : "---"}
                        </p>

                        <p>
                            <strong>Bill / Invoice:</strong>{" "}
                            {form.bill ? form.bill.name : "---"}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
