import React, { useEffect, useState } from "react";

export default function Step3Payment({ formData, setFormData, next, prev }) {

    const [errors, setErrors] = useState({});

    // -------------------- AUTO CALCULATIONS --------------------
    useEffect(() => {
        const deal = Number(formData.dealAmount || 0);
        const received = Number(formData.tokenReceivedAmount || 0);

        const receivedPercent = deal > 0 ? ((received / deal) * 100).toFixed(2) : 0;
        const remainPercent = (100 - receivedPercent).toFixed(2);
        const balanceAmount = deal - received;

        setFormData((prev) => ({
            ...prev,
            receivedPercent,
            remainPercent,
            balanceAmount,
        }));
    }, [formData.dealAmount, formData.tokenReceivedAmount]);

    // -------------------- VALIDATION --------------------
    const validateStep = () => {
        let newErrors = {};

        if (!formData.dealAmount) newErrors.dealAmount = "Deal amount is required";
        if (!formData.tokenReceivedAmount) newErrors.tokenReceivedAmount = "Received amount is required";
        if (!formData.modeOfPayment) newErrors.modeOfPayment = "Mode of payment is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            next();
        }
    };

    // -------------------- CHANGE HANDLER --------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* DEAL AMOUNT */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Deal Amount *
                    </label>
                    <input
                        type="number"
                        name="dealAmount"
                        value={formData.dealAmount}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                        ${errors.dealAmount ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                        placeholder="Enter deal amount"
                    />
                    {errors.dealAmount && <p className="text-red-500 text-sm">{errors.dealAmount}</p>}
                </div>

                {/* RECEIVED AMOUNT */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Received Amount *
                    </label>
                    <input
                        type="number"
                        name="tokenReceivedAmount"
                        value={formData.tokenReceivedAmount}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                        ${errors.tokenReceivedAmount ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                        placeholder="Amount received"
                    />
                    {errors.tokenReceivedAmount && (
                        <p className="text-red-500 text-sm">{errors.tokenReceivedAmount}</p>
                    )}
                </div>

                {/* Received % */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Received %</label>
                    <input
                        disabled
                        value={formData.receivedPercent + "%"}
                        className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                    />
                </div>

                {/* Remaining % */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Remaining %</label>
                    <input
                        disabled
                        value={formData.remainPercent + "%"}
                        className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                    />
                </div>

                {/* BALANCE */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Balance Amount</label>
                    <input
                        disabled
                        value={`₹ ${formData.balanceAmount}`}
                        className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                    />
                </div>

                {/* MODE OF PAYMENT */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Mode of Payment *
                    </label>
                    <select
                        name="modeOfPayment"
                        value={formData.modeOfPayment}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                        ${errors.modeOfPayment ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    >
                        <option value="">Select Mode</option>
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>
                    </select>
                    {errors.modeOfPayment && (
                        <p className="text-red-500 text-sm">{errors.modeOfPayment}</p>
                    )}
                </div>

                {/* TOKEN DATE (optional) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Token Date</label>
                    <input
                        type="date"
                        name="tokenDate"
                        value={formData.tokenDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#0070b9]"
                    />
                </div>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prev}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400"
                >
                    ← Back
                </button>

                <button
                    onClick={handleNext}
                    className="bg-[#0070b9] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005a94]"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
