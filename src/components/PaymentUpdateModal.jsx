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

    const handleChange = (e) => {
        if (e.target.name === "proof") {
            setForm({ ...form, proof: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
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
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
                <button
                    className="absolute top-2 right-2 bg-gray-800 text-white w-8 h-8 rounded-full"
                    onClick={onClose}
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
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="paymentDate"
                        type="date"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <select
                        name="mode"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
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
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="file"
                        name="proof"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}