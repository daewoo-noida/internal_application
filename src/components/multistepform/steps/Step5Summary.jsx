import React from "react";
import { clientAPI } from "../../../utils/api";

export default function Step5Summary({ formData, prev }) {

    const handleSubmit = async () => {
        const fd = new FormData();

        // Files
        if (formData.adharImages) {
            formData.adharImages.forEach(file => fd.append("adharImages", file));
        }
        if (formData.panImage) fd.append("panImage", formData.panImage);
        if (formData.companyPanImage) fd.append("companyPanImage", formData.companyPanImage);
        if (formData.gstFile) fd.append("gst", formData.gstFile);

        // Text Data
        Object.keys(formData).forEach(key => {
            if (
                key !== "adharImages" &&
                key !== "panImage" &&
                key !== "companyPanImage" &&
                key !== "gstFile"
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
            <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>

            <SummaryBlock title="Personal Details">
                <SummaryItem label="Name" value={formData.name} />
                <SummaryItem label="Email" value={formData.email} />
                <SummaryItem label="Phone" value={formData.phone} />
                <SummaryItem label="State" value={formData.personalState} />
            </SummaryBlock>

            <SummaryBlock title="Franchise Details">
                <SummaryItem label="Franchise Type" value={formData.franchiseType} />
                <SummaryItem label="Territory" value={formData.territory} />
            </SummaryBlock>

            <SummaryBlock title="Documents">
                <SummaryItem label="Aadhaar" value={formData.adharImages?.length} />
                <SummaryItem label="PAN" value={formData.panImage ? "Uploaded" : "Missing"} />
                <SummaryItem label="GST" value={formData.gstFile ? "Uploaded" : "Missing"} />
            </SummaryBlock>

            <SummaryBlock title="Payment Details">
                <SummaryItem label="Deal Amount" value={formData.dealAmount} />
                <SummaryItem label="Received" value={formData.tokenReceivedAmount} />
            </SummaryBlock>

            <div className="flex justify-between mt-8">
                <button onClick={prev} className="bg-gray-300 px-6 py-3 rounded-xl">← Back</button>
                <button onClick={handleSubmit} className="bg-[#0070b9] text-white px-6 py-3 rounded-xl">Submit</button>
            </div>
        </div>
    );
}

const SummaryBlock = ({ title, children }) => (
    <div className="bg-[#f4f9ff] border p-6 rounded-2xl mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const SummaryItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg border">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-gray-900 font-medium mt-1">{value || "--"}</div>
    </div>
);
