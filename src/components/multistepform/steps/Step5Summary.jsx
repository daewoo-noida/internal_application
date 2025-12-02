import React from "react";
import { clientAPI } from "../../../utils/api";

export default function Step5Summary({ formData, prev }) {

    const handleSubmit = async () => {
        const fd = new FormData();

        if (Array.isArray(formData.adharImages)) {
            formData.adharImages.forEach((file) => {
                if (file) fd.append("adharImages", file);
            });
        }

        if (formData.panImage)
            fd.append("panImage", formData.panImage);

        if (formData.companyPanImage)
            fd.append("companyPanImage", formData.companyPanImage);

        if (formData.addressProof)
            fd.append("addressProof", formData.addressProof);

        Object.keys(formData).forEach((key) => {
            if (
                key !== "adharImages" &&
                key !== "panImage" &&
                key !== "companyPanImage" &&
                key !== "addressProof"
            ) {
                fd.append(key, formData[key]);
            }
        });

        try {
            await clientAPI.create(fd);
            alert("Client added successfully!");
        } catch (error) {
            console.log(error);
            alert("Error while submitting client");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Review & Submit
            </h2>

            <p className="text-gray-600 mb-6">
                Please review the information below before submitting.
            </p>

            <div className="bg-[#f4f9ff] border border-[#d2e7f7] rounded-2xl p-6 mb-10">

                <h3 className="text-lg font-semibold text-[#0070b9] mb-3">
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <SummaryItem label="Name" value={formData.name} />
                    <SummaryItem label="Email" value={formData.email} />
                    <SummaryItem label="Phone" value={formData.phone} />
                    <SummaryItem label="Alt Phone" value={formData.altPhone} />
                    <SummaryItem label="Territory" value={formData.territory} />
                    <SummaryItem label="State" value={formData.state} />
                    <SummaryItem label="District" value={formData.district} />
                    <SummaryItem label="City" value={formData.city} />
                    <SummaryItem label="Street Address" value={formData.streetAddress} />
                    <SummaryItem label="PIN" value={formData.pin} />
                </div>

                <h3 className="text-lg font-semibold text-[#0070b9] mb-3">
                    Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <SummaryItem label="Deal Amount" value={formData.dealAmount} />
                    <SummaryItem label="Received Amount" value={formData.tokenReceivedAmount} />
                    <SummaryItem label="Received %" value={formData.receivedPercent + "%"} />
                    <SummaryItem label="Remaining %" value={formData.remainPercent + "%"} />
                    <SummaryItem label="Balance Amount" value={`₹ ${formData.balanceAmount}`} />
                    <SummaryItem label="Mode of Payment" value={formData.modeOfPayment} />
                    <SummaryItem label="Token Date" value={formData.tokenDate} />
                </div>

                <h3 className="text-lg font-semibold text-[#0070b9] mb-3">
                    Office & Allocation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <SummaryItem label="Office Branch" value={formData.officeBranch} />

                    {/* ⭐ USE NAMES HERE */}
                    <SummaryItem label="BDA" value={formData.bdaName} />
                    <SummaryItem label="BDE" value={formData.bdeName} />
                    <SummaryItem label="BDM" value={formData.bdmName} />

                    <SummaryItem label="Lead Source" value={formData.leadSource} />
                    <SummaryItem label="GST Number" value={formData.gst} />
                </div>

                {formData.remark && (
                    <>
                        <h3 className="text-lg font-semibold text-[#0070b9] mb-2">Remark</h3>
                        <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-300">
                            {formData.remark}
                        </p>
                    </>
                )}
            </div>

            <div className="flex justify-between">
                <button
                    onClick={prev}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400"
                >
                    ← Back
                </button>

                <button
                    onClick={handleSubmit}
                    className="bg-[#0070b9] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005a94]"
                >
                    Submit Form ✔
                </button>
            </div>
        </div>
    );
}

const SummaryItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg border border-gray-300">
        <div className="text-xs font-semibold text-gray-500">{label}</div>
        <div className="text-gray-900 font-medium mt-1">{value || "--"}</div>
    </div>
);
