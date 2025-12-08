import { useState } from "react";
import { reimbursementAPI } from "../../utils/api";
import { toast } from "react-toastify";
import { FiVideo } from "react-icons/fi";

export default function Reimbursement() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reimbursementId, setReimbursementId] = useState(null);

    const [form, setForm] = useState({
        reason: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        paymentMethod: "",
        vendor: "",
        notes: "",
        bankDetails: "",
        screenshot: null,
        bill: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();

            // Append all form data
            Object.keys(form).forEach(key => {
                if (form[key] && key !== 'screenshot' && key !== 'bill') {
                    formData.append(key, form[key]);
                }
            });

            // Append files if they exist
            if (form.screenshot) formData.append('screenshot', form.screenshot);
            if (form.bill) formData.append('bill', form.bill);

            const response = await reimbursementAPI.create(formData);

            if (response.data.success) {
                setSubmitted(true);
                setReimbursementId(response.data.data._id);
                toast.success("Reimbursement submitted successfully!");

                // Reset form
                setForm({
                    reason: "",
                    amount: "",
                    date: new Date().toISOString().split('T')[0],
                    category: "",
                    paymentMethod: "",
                    vendor: "",
                    notes: "",
                    bankDetails: "",
                    screenshot: null,
                    bill: null,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit reimbursement");
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white contact-us-pages " style={{ marginTop: "12vh" }} >

            {/* Success Modal */}
            {submitted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Submitted Successfully!</h3>
                            <p className="text-gray-600 mb-6">
                                Your reimbursement request has been submitted and is pending admin verification.
                                Request ID: <span className="font-mono font-bold">{reimbursementId?.substring(0, 8)}</span>
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="w-full bg-[#0070b9] text-white py-3 rounded-lg font-semibold hover:bg-[#0070b9] transition"
                                >
                                    Submit Another Request
                                </button>
                                <button
                                    onClick={() => window.location.href = '/sales/reimbursement/track'}
                                    className="w-full border-2 border-[#0070b9] text-[#0070b9] py-3 rounded-lg font-semibold hover:bg-[#0070b9] hover:text-white transition"
                                >
                                    Track Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section
                className="text-[#0070b9] relative overflow-hidden rounded-2xl flex items-center justify-center"
                style={{
                    margin: "12vh 3vh",
                    backgroundImage: "url('/images/reimbersment.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "70vh",
                }}
            >
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Expense Reimbursement Made Easy
                    </h1>

                    <p className="text-lg text-[#0070b9] mt-4">
                        Upload your bills, choose the expense category, and track your request in real time | all in one simple, seamless Experience
                    </p>

                    <span className="inline-block px-4 py-1 text tracking-[3px] uppercase bg-[#0070B9] text-white rounded-full">
                        Submit → Verify → Get Paid
                    </span>
                </div>
            </section>


            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <div className="">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Submit Reimbursement Request
                        </h1>
                        <p className="text-gray-600 mb-10">
                            Fill in the details below and upload your supporting documents.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 hover:shadow-lg transition cursor-pointer flex items-center gap-2">
                        <button onClick={() => window.location.href = "/sales/reimbursement/track"}> Track Your Reimberment </button>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* FORM CARD */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">
                        <h2 className="text-xl font-bold mb-6 text-[#0070b9] uppercase">
                            Expense Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Form fields remain the same as before */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Reason *</label>
                                <input
                                    name="reason"
                                    placeholder="Ex: Client meeting travel, office purchase..."
                                    value={form.reason}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9] transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Amount (₹) *</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="Enter amount"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Date *</label>
                                    <input
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Category *</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
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

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Payment Method *</label>
                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0070b9]"
                                >
                                    <option value="">Choose method</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>

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

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Your UPI ID *</label>
                                <input
                                    name="bankDetails"
                                    value={form.bankDetails}
                                    onChange={handleChange}
                                    placeholder="Enter account number or UPI ID"
                                    required
                                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070b9]"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="text-sm font-semibold text-gray-700">Payment Screenshot *</label>
                                <input
                                    type="file"
                                    name="screenshot"
                                    onChange={handleChange}
                                    required
                                    accept="image/*,.pdf"
                                    className="mt-1 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0070b9] file:text-white hover:file:bg-[#0070b9]"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Bill / Invoice (optional)</label>
                                <input
                                    type="file"
                                    name="bill"
                                    onChange={handleChange}
                                    accept="image/*,.pdf"
                                    className="mt-1 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0070b9] text-white py-3 mt-4 rounded-lg font-semibold hover:bg-[#0070b9] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : "Submit Request"}
                            </button>
                        </form>
                    </div>

                    {/* PREVIEW SECTION */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">
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
                            <p><strong>Bank / UPI:</strong> {form.bankDetails || "---"}</p>

                            <p>
                                <strong>Screenshot:</strong>{" "}
                                {form.screenshot ? (
                                    <span className="text-green-600">{form.screenshot.name}</span>
                                ) : "---"}
                            </p>

                            <p>
                                <strong>Bill / Invoice:</strong>{" "}
                                {form.bill ? (
                                    <span className="text-green-600">{form.bill.name}</span>
                                ) : "---"}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Process Flow</h3>
                            <div className="flex items-center justify-between">
                                {['Submit', 'Admin Review', 'Approval', 'Payment'].map((step, index) => (
                                    <div key={step} className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-[#0070b9] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-xs mt-2">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}