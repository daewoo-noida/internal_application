import React, { useState } from "react";
import { clientAPI } from "../utils/api";

export default function PaymentUpdateModal({ client, onClose, onSuccess }) {
    const [form, setForm] = useState({
        amount: "",
        paymentDate: "",
        mode: "",
        transactionId: "",
        proof: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === "proof") {
            setForm({ ...form, proof: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        // Validation
        if (!form.amount || form.amount <= 0) {
            alert("Amount is required and must be greater than 0");
            return;
        }

        if (!form.paymentDate) {
            alert("Payment date is required");
            return;
        }

        if (!form.mode) {
            alert("Payment mode is required");
            return;
        }

        if (!form.transactionId || form.transactionId.trim() === "") {
            alert("Transaction ID is required");
            return;
        }

        if (!form.proof) {
            alert("Payment proof is required");
            return;
        }

        setIsSubmitting(true);
        const fd = new FormData();
        Object.keys(form).forEach((key) => fd.append(key, form[key]));

        try {
            await clientAPI.addPayment(client._id, fd);
            alert("Payment submitted for approval!");
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error submitting payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
                <button
                    className="absolute top-3 right-3 bg-gray-800 text-white w-8 h-8 rounded-full hover:bg-gray-700 disabled:opacity-50"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Add Payment</h2>

                <div className="space-y-3">
                    <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        onChange={handleChange}
                        className="w-full border p-2 rounded disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    />

                    <input
                        name="paymentDate"
                        type="date"
                        onChange={handleChange}
                        className="w-full border p-2 rounded disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    />

                    <select
                        name="mode"
                        onChange={handleChange}
                        className="w-full border p-2 rounded disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                    </select>

                    <input
                        name="transactionId"
                        placeholder="Transaction ID"
                        onChange={handleChange}
                        className="w-full border p-2 rounded disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    />

                    <input
                        type="file"
                        name="proof"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`mt-4 text-white px-4 py-2 rounded w-full font-medium ${isSubmitting
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </div>
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
        </div>
    );
}