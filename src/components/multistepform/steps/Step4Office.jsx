import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Step4Office({ formData, setFormData, next, prev }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const [errors, setErrors] = useState({});
    const [bdaList, setBdaList] = useState([]);
    const [bdeList, setBdeList] = useState([]);
    const [bdmList, setBdmList] = useState([]);
    const [bheadList, setBheadList] = useState([]); // ⭐ ADDED BHEAD

    // Input fields for custom values
    const [customOffice, setCustomOffice] = useState("");
    const [customLeadSource, setCustomLeadSource] = useState("");

    // -------------------- FETCH USERS --------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const response = await axios.get(`${API_URL}/auth/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const users = response.data?.data || [];

                setBdaList(users.filter((u) => u.designation?.toLowerCase() === "bda"));
                setBdeList(users.filter((u) => u.designation?.toLowerCase() === "bde"));
                setBdmList(users.filter((u) => u.designation?.toLowerCase() === "bdm"));
                setBheadList(users.filter((u) => u.designation?.toLowerCase() === "bhead")); // ⭐ ADDED
            } catch (error) {
                console.error("User fetch error", error);
            }
        };

        fetchUsers();
    }, []);

    // -------------------- VALIDATION --------------------
    const validateStep = () => {
        let newErrors = {};

        // Office branch required
        if (!formData.officeBranch) newErrors.officeBranch = "Office branch is required";

        // Validate custom office
        if (formData.officeBranch === "Others" && !customOffice.trim()) {
            newErrors.customOffice = "Please specify office branch";
        }

        // Lead source required
        if (!formData.leadSource) newErrors.leadSource = "Lead Source is required";
        if (!formData.bda) newErrors.bda = "BDA is required";
        if (!formData.bde) newErrors.bde = "BDE is required";
        if (!formData.bdm) newErrors.bdm = "BDM is required";
        if (!formData.bhead) newErrors.bhead = "Business Head is required";
        // Validate custom lead source
        if (formData.leadSource === "other" && !customLeadSource.trim()) {
            newErrors.customLeadSource = "Please enter lead source";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -------------------- NEXT BUTTON --------------------
    const handleNext = () => {
        let updatedData = { ...formData };


        if (formData.officeBranch === "Others") {
            updatedData.officeBranch = customOffice;
        }

        // If lead source = other → Replace with custom value
        if (formData.leadSource === "other") {
            updatedData.leadSource = customLeadSource;
        }

        setFormData(updatedData);

        if (validateStep()) next();
    };

    // -------------------- SELECT HANDLER --------------------
    const handleSelect = (e, name) => {
        const id = e.target.value;
        const list =
            name === "bda"
                ? bdaList
                : name === "bde"
                    ? bdeList
                    : name === "bdm"
                        ? bdmList
                        : bheadList; // ⭐ ADDED BHEAD

        const userName = list.find((u) => u._id === id)?.name || "";

        setFormData({
            ...formData,
            [name]: id,
            [`${name}Name`]: userName,
        });

        setErrors({ ...errors, [name]: "" });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Office & Allocation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ============ OFFICE BRANCH ============ */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">
                        Office Branch *
                    </label>

                    <select
                        name="officeBranch"
                        value={formData.officeBranch}
                        onChange={(e) =>
                            setFormData({ ...formData, officeBranch: e.target.value })
                        }
                        className={`w-full border p-3 rounded-lg 
                            ${errors.officeBranch ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select Office Branch</option>
                        <option>Noida</option>
                        <option>Zirakpur</option>
                        <option>Chandigadh</option>
                        <option>Mumbai</option>
                        <option>Hyderabad</option>
                        <option value="Others">Others</option>
                    </select>

                    {errors.officeBranch && (
                        <p className="text-red-500 text-sm">{errors.officeBranch}</p>
                    )}
                </div>

                {/* ===== SHOW CUSTOM OFFICE INPUT ===== */}
                {formData.officeBranch === "Others" && (
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-medium mb-1">
                            Specify Office Branch *
                        </label>

                        <input
                            type="text"
                            value={customOffice}
                            onChange={(e) => setCustomOffice(e.target.value)}
                            placeholder="Enter your office branch"
                            className={`w-full border p-3 rounded-lg 
                                ${errors.customOffice ? "border-red-500" : "border-gray-300"}`}
                        />

                        {errors.customOffice && (
                            <p className="text-red-500 text-sm">{errors.customOffice}</p>
                        )}
                    </div>
                )}

                {/* ⭐ ALL DROPDOWNS - VISIBLE TO EVERYONE */}

                {/* Select BDA */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Select BDA</label>
                    <select
                        value={formData.bda || ""}
                        onChange={(e) => handleSelect(e, "bda")}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    >
                        <option value="">Select BDA</option>
                        {bdaList.map((bda) => (
                            <option key={bda._id} value={bda._id}>{bda.name}</option>
                        ))}
                    </select>
                    {errors.bda && (
                        <p className="text-red-500 text-sm">{errors.bda}</p>
                    )}
                </div>

                {/* Select BDE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Select BDE</label>
                    <select
                        value={formData.bde || ""}
                        onChange={(e) => handleSelect(e, "bde")}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    >
                        <option value="">Select BDE</option>
                        {bdeList.map((bde) => (
                            <option key={bde._id} value={bde._id}>{bde.name}</option>
                        ))}
                    </select>
                    {errors.bde && (
                        <p className="text-red-500 text-sm">{errors.bde}</p>
                    )}
                </div>

                {/* Select BDM */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Select BDM</label>
                    <select
                        value={formData.bdm || ""}
                        onChange={(e) => handleSelect(e, "bdm")}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    >
                        <option value="">Select BDM</option>
                        {bdmList.map((bdm) => (
                            <option key={bdm._id} value={bdm._id}>{bdm.name}</option>
                        ))}
                    </select>
                    {errors.bdm && (
                        <p className="text-red-500 text-sm">{errors.bdm}</p>
                    )}
                </div>

                {/* ⭐ NEW: Select BHead */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Select Bussiness Head</label>
                    <select
                        value={formData.bhead || ""}
                        onChange={(e) => handleSelect(e, "bhead")}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    >
                        <option value="">Select Bussiness Head</option>
                        {bheadList.map((bhead) => (
                            <option key={bhead._id} value={bhead._id}>{bhead.name}</option>
                        ))}
                    </select>
                    {errors.bhead && (
                        <p className="text-red-500 text-sm">{errors.bhead}</p>
                    )}
                </div>

                {/* ============ LEAD SOURCE ============ */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Lead Source *</label>

                    <select
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={(e) =>
                            setFormData({ ...formData, leadSource: e.target.value })
                        }
                        className={`w-full border p-3 rounded-lg 
                            ${errors.leadSource ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select Lead Source</option>
                        <option value="crm">CRM</option>
                        <option value="other">Other</option>
                    </select>

                    {errors.leadSource && (
                        <p className="text-red-500 text-sm">{errors.leadSource}</p>
                    )}
                </div>

                {/* ===== CUSTOM LEAD SOURCE INPUT ===== */}
                {formData.leadSource === "other" && (
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-medium mb-1">Specify Lead Source *</label>

                        <input
                            type="text"
                            value={customLeadSource}
                            onChange={(e) => setCustomLeadSource(e.target.value)}
                            placeholder="Enter lead source"
                            className={`w-full border p-3 rounded-lg 
                                ${errors.customLeadSource ? "border-red-500" : "border-gray-300"}`}
                        />

                        {errors.customLeadSource && (
                            <p className="text-red-500 text-sm">{errors.customLeadSource}</p>
                        )}
                    </div>
                )}

                {/* REMARK */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Remark</label>
                    <textarea
                        name="remark"
                        value={formData.remark}
                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        placeholder="Write remarks…"
                        className="w-full border p-3 rounded-lg h-24 border-gray-300"
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