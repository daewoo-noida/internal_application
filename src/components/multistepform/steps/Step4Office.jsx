import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Step4Office({ formData, setFormData, next, prev }) {
    const API_URL = import.meta.env.VITE_API_URL || "https://api.daewooebg.com/api";

    const user = JSON.parse(localStorage.getItem("userData"));
    const role = user?.designation?.toLowerCase();   // ⭐ FIX: Always lowercase

    const [errors, setErrors] = useState({});
    const [bdaList, setBdaList] = useState([]);
    const [bdeList, setBdeList] = useState([]);
    const [bdmList, setBdmList] = useState([]);

    // FETCH USERS
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

            } catch (error) {
                console.error("User fetch error", error);
            }
        };

        fetchUsers();
    }, []);

    // VALIDATION
    const validateStep = () => {
        let newErrors = {};

        if (!formData.officeBranch) newErrors.officeBranch = "Office branch is required";

        if (role === "bdm") {
            if (!formData.bda) newErrors.bda = "Select BDA";
            if (!formData.bde) newErrors.bde = "Select BDE";
        }

        if (role === "bde") {
            if (!formData.bda) newErrors.bda = "Select BDA";
            if (!formData.bdm) newErrors.bdm = "Select BDM";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Office & Allocation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* OFFICE BRANCH */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Office Branch *</label>
                    <select
                        name="officeBranch"
                        value={formData.officeBranch}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg 
                            ${errors.officeBranch ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    >
                        <option value="">Select Office Branch</option>
                        <option>Noida</option>
                        <option>Zirakpur</option>
                        <option>Chandigadh</option>
                        <option>Mumbai</option>
                        <option>Hyderabad</option>
                        <option>Others</option>
                    </select>
                    {errors.officeBranch && <p className="text-red-500 text-sm">{errors.officeBranch}</p>}
                </div>

                {/* ⭐ BDM LOGIN → BDA + BDE + HIS OWN NAME */}
                {role === "bdm" && (
                    <>
                        {/* BDA */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Select BDA *</label>
                            <select
                                name="bda"
                                value={formData.bda}
                                onChange={handleChange}
                                className={`w-full border p-3 rounded-lg 
                                    ${errors.bda ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                            >
                                <option value="">Select BDA</option>
                                {bdaList.map((bda) => (
                                    <option key={bda._id} value={bda._id}>{bda.name}</option>
                                ))}
                            </select>
                            {errors.bda && <p className="text-red-500 text-sm">{errors.bda}</p>}
                        </div>

                        {/* BDE */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Select BDE *</label>
                            <select
                                name="bde"
                                value={formData.bde}
                                onChange={handleChange}
                                className={`w-full border p-3 rounded-lg 
                                    ${errors.bde ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                            >
                                <option value="">Select BDE</option>
                                {bdeList.map((bde) => (
                                    <option key={bde._id} value={bde._id}>{bde.name}</option>
                                ))}
                            </select>
                            {errors.bde && <p className="text-red-500 text-sm">{errors.bde}</p>}
                        </div>

                        {/* BDM = himself */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">BDM Name</label>
                            <input
                                disabled
                                value={user.name}
                                className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                            />
                        </div>
                    </>
                )}

                {/* ⭐ BDE LOGIN → SELECT BDA + SHOW OWN NAME + SELECT BDM */}
                {role === "bde" && (
                    <>
                        {/* SELECT BDA */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Select BDA *</label>
                            <select
                                name="bda"
                                value={formData.bda}
                                onChange={handleChange}
                                className={`w-full border p-3 rounded-lg 
                                    ${errors.bda ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                            >
                                <option value="">Select BDA</option>
                                {bdaList.map((bda) => (
                                    <option key={bda._id} value={bda._id}>{bda.name}</option>
                                ))}
                            </select>
                            {errors.bda && <p className="text-red-500 text-sm">{errors.bda}</p>}
                        </div>

                        {/* SHOW OWN NAME */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Your BDE Name</label>
                            <input
                                disabled
                                value={user.name}
                                className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                            />
                        </div>

                        {/* SELECT BDM */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Select BDM *</label>
                            <select
                                name="bdm"
                                value={formData.bdm}
                                onChange={handleChange}
                                className={`w-full border p-3 rounded-lg 
                                    ${errors.bdm ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                            >
                                <option value="">Select BDM</option>
                                {bdmList.map((bdm) => (
                                    <option key={bdm._id} value={bdm._id}>
                                        {bdm.name}
                                    </option>
                                ))}
                            </select>
                            {errors.bdm && <p className="text-red-500 text-sm">{errors.bdm}</p>}
                        </div>
                    </>
                )}

                {/* ⭐ BDA LOGIN → ONLY SHOW OWN NAME */}
                {role === "bda" && (
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-medium mb-1">Your BDA Name</label>
                        <input
                            disabled
                            value={user.name}
                            className="w-full border border-gray-200 bg-gray-100 p-3 rounded-lg text-gray-600"
                        />
                    </div>
                )}

                {/* LEAD SOURCE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Lead Source</label>
                    <select
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg border-gray-300 focus:border-[#0070b9]"
                    >
                        <option value="">Select Lead Source</option>
                        <option value="Kustard">Kustard Lead</option>
                        <option value="other">Others</option>
                    </select>
                </div>

                {/* GST */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">GST Number</label>
                    <input
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        placeholder="Enter GST"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#0070b9]"
                    />
                </div>

                {/* REMARK */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Remark</label>
                    <textarea
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        placeholder="Write remarks…"
                        className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:border-[#0070b9]"
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
