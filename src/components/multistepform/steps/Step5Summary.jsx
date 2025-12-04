import React from "react";
import { clientAPI } from "../../../utils/api";

export default function Step5Summary({ formData, prev }) {

    const handleSubmit = async () => {
        console.log("FINAL FORM DATA:", formData);  // <-- DEBUG PRINT

        const fd = new FormData();

        // ================= FILES =================
        if (Array.isArray(formData.adharImages)) {
            formData.adharImages.forEach(file => fd.append("adharImages", file));
        }

        if (formData.panImage) fd.append("panImage", formData.panImage);
        if (formData.companyPanImage) fd.append("companyPanImage", formData.companyPanImage);
        if (formData.gstFile) fd.append("gst", formData.gstFile);

        // ================= PERSONAL =================
        fd.append("name", formData.name);
        fd.append("email", formData.email);
        fd.append("phone", formData.phone);
        fd.append("altPhone", formData.altPhone || "");

        fd.append("personalState", formData.personalState);
        fd.append("personalDistrict", formData.personalDistrict);
        fd.append("personalCity", formData.personalCity);
        fd.append("personalStreetAddress", formData.personalStreetAddress);
        fd.append("personalPin", formData.personalPin);

        // ================= FRANCHISE =================
        fd.append("franchiseType", formData.franchiseType);
        fd.append("franchiseState", formData.franchiseState);
        fd.append("franchiseDistrict", formData.franchiseDistrict);
        fd.append("franchiseCity", formData.franchiseCity);
        fd.append("franchisePin", formData.franchisePin);
        fd.append("territory", formData.territory);

        // ================= PAYMENT =================
        fd.append("dealAmount", formData.dealAmount);
        fd.append("tokenReceivedAmount", formData.tokenReceivedAmount);
        fd.append("tokenDate", formData.tokenDate);
        fd.append("modeOfPayment", formData.modeOfPayment);
        fd.append("proofOfPayment", formData.proofOfPayment || "");

        // ================= OFFICE =================
        fd.append("officeBranch", formData.officeBranch);
        fd.append("bda", formData.bda);
        fd.append("bde", formData.bde);
        fd.append("bdm", formData.bdm);
        fd.append("leadSource", formData.leadSource);

        // ================= REMARK =================
        fd.append("remark", formData.remark || "");

        try {
            const res = await clientAPI.create(fd);
            alert("Client added successfully!");
            console.log("SERVER RESPONSE:", res.data);
            window.location.reload();
        } catch (err) {
            console.error("SUBMISSION ERROR:", err);
            alert("Error submitting client. Check console.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Review & Submit
            </h2>

            {/* SHOW FINAL SUMMARY */}
            <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(formData, null, 2)}
            </pre>

            <div className="flex justify-between mt-8">
                <button onClick={prev} className="bg-gray-300 px-6 py-3 rounded-xl">
                    ← Back
                </button>

                <button onClick={handleSubmit} className="bg-[#0070b9] text-white px-6 py-3 rounded-xl">
                    Submit
                </button>
            </div>
        </div>
    );
}
