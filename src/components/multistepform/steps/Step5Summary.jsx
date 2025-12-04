import React from "react";
import { clientAPI } from "../../../utils/api";

export default function Step5Summary({ formData, prev }) {

    const handleSubmit = async () => {
        const fd = new FormData();

        // Upload Files
        if (Array.isArray(formData.adharImages)) {
            formData.adharImages.forEach(file => fd.append("adharImages", file));
        }
        if (formData.panImage) fd.append("panImage", formData.panImage);
        if (formData.companyPanImage) fd.append("companyPanImage", formData.companyPanImage);
        if (formData.gstFile) fd.append("gstFile", formData.gstFile);
        if (formData.paymentImage) fd.append("paymentImage", formData.paymentImage);
        // Text fields
        Object.keys(formData).forEach(key => {
            if (
                key !== "adharImages" &&
                key !== "panImage" &&
                key !== "companyPanImage" &&
                key !== "gstFile" &&
                key !== "paymentImage"
            ) {
                fd.append(key, formData[key]);
            }
        });

        try {
            await clientAPI.create(fd);
            alert("Client added successfully!");
            window.location.reload();
        } catch (err) {
            console.log(err);
            alert("Error submitting form");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Review All Details Before Submit
            </h2>

            {/* ======================== PERSONAL DETAILS ======================== */}
            <SummaryBlock title="Personal Details">
                <SummaryItem label="Full Name" value={formData.name} />
                <SummaryItem label="Email" value={formData.email} />
                <SummaryItem label="Phone" value={formData.phone} />
                <SummaryItem label="Alt Phone" value={formData.altPhone} />
                <SummaryItem label="State" value={formData.personalState} />
                <SummaryItem label="District" value={formData.personalDistrict} />
                <SummaryItem label="City" value={formData.personalCity} />
                <SummaryItem label="Street Address" value={formData.personalStreetAddress} />
                <SummaryItem label="PIN Code" value={formData.personalPin} />
            </SummaryBlock>

            {/* ======================== FRANCHISE DETAILS ======================== */}
            {/* ======================== FRANCHISE DETAILS ======================== */}
            <SummaryBlock title="Franchise Details">
                <SummaryItem label="Franchise Type" value={formData.franchiseType} />

                {/* MASTER FRANCHISE */}
                {formData.franchiseType === "Master Franchise" && (
                    <>
                        <SummaryItem label="Master Franchise Territory" value={formData.territory} />
                    </>
                )}

                {/* DDP FRANCHISE */}
                {formData.franchiseType === "Daewoo District Partner Franchise" && (
                    <>
                        <SummaryItem label="State" value={formData.franchiseState} />
                        <SummaryItem label="DDP Territory" value={formData.territory} />
                    </>
                )}

                {/* SIGNATURE STORE */}
                {formData.franchiseType === "Signature" && (
                    <>
                        <SummaryItem label="State" value={formData.franchiseState} />
                        <SummaryItem label="District" value={formData.franchiseDistrict} />
                        <SummaryItem label="City" value={formData.franchiseCity} />
                        <SummaryItem label="PIN Code" value={formData.franchisePin} />
                    </>
                )}
            </SummaryBlock>


            {/* ======================== DOCUMENT DETAILS ======================== */}
            <SummaryBlock title="Uploaded Documents">
                <SummaryItem label="Aadhaar Images" value={`${formData.adharImages?.length || 0} file(s)`} />
                <SummaryItem label="PAN Card" value={formData.panImage ? "Uploaded" : "Missing"} />
                <SummaryItem label="Company PAN" value={formData.companyPanImage ? "Uploaded" : "Missing"} />
                <SummaryItem label="GST File" value={formData.gstFile ? "Uploaded" : "Missing"} />
            </SummaryBlock>

            {/* ======================== OFFICE DETAILS ======================== */}
            <SummaryBlock title="Office & Sales Allocation">
                <SummaryItem label="Office Branch" value={formData.officeBranch} />
                <SummaryItem label="Lead Source" value={formData.leadSource} />
                <SummaryItem label="BDA" value={formData.bdaName} />
                <SummaryItem label="BDE" value={formData.bdeName} />
                <SummaryItem label="BDM" value={formData.bdmName} />
            </SummaryBlock>

            {/* ======================== PAYMENT DETAILS ======================== */}
            <SummaryBlock title="Payment Details">
                <SummaryItem label="Deal Amount" value={formData.dealAmount} />
                <SummaryItem label="Token Received Amount" value={formData.tokenReceivedAmount} />
                <SummaryItem label="Token Date" value={formData.tokenDate} />
                <SummaryItem label="Mode of Payment" value={formData.modeOfPayment} />
                <SummaryItem label="Received %" value={formData.receivedPercent} />
                <SummaryItem label="Remaining %" value={formData.remainPercent} />
                <SummaryItem label="Balance Amount" value={formData.balanceAmount} />
                <SummaryItem label="Payment Proof" value={formData.proofOfPayment} />

                <SummaryItem label="Payment Proof" value={formData.paymentImage ? "Uploaded" : "Missing"} />


            </SummaryBlock>

            {/* ======================== REMARK ======================== */}
            <SummaryBlock title="Remarks">
                <p className="p-3 bg-white rounded border">{formData.remark || "--"}</p>
            </SummaryBlock>

            {/* ======================== BUTTONS ======================== */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prev}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                >
                    ← Back
                </button>

                <button
                    onClick={handleSubmit}
                    className="bg-[#0070b9] text-white px-6 py-3 rounded-xl font-semibold"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

/* REUSABLE COMPONENTS */
const SummaryBlock = ({ title, children }) => (
    <div className="bg-[#f4f9ff] border border-[#d2e7f7] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#0070b9] mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const SummaryItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg border border-gray-300">
        <div className="text-xs font-semibold text-gray-500">{label}</div>
        <div className="text-gray-900 font-medium mt-1">{value || "--"}</div>
    </div>
);
