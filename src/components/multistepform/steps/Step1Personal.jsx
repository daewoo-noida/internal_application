import React, { useState } from "react";
import { stateDistricts } from "../../../stateData/stateDistrictData";

export default function Step1Personal({ formData, setFormData, next }) {

    const [errors, setErrors] = useState({});

    // VALIDATION FUNCTION
    const validateStep = () => {
        let newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.phone) newErrors.phone = "Phone is required";
        if (!formData.territory) newErrors.territory = "Territory is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.district) newErrors.district = "District is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    // ON CHANGE HANDLER
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };


    return (
        <div>
            {/* SECTION TITLE */}
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Personal Details
            </h2>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* NAME */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Client Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                                    ${errors.name ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                        placeholder="Enter client name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#0070b9]"
                        placeholder="Enter email"
                    />
                </div>

                {/* PHONE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Phone *</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                                    ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                        placeholder="Phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* ALT PHONE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Alternate Phone</label>
                    <input
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#0070b9]"
                        placeholder="Alternate contact number"
                    />
                </div>

                {/* TERRITORY */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Territory *</label>
                    <select
                        name="territory"
                        value={formData.territory}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                                    ${errors.territory ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    >
                        <option value="">Select Territory</option>
                        {Object.keys(stateDistricts).map((state) => (
                            <option key={state}>{state}</option>
                        ))}
                    </select>
                    {errors.territory && <p className="text-red-500 text-sm mt-1">{errors.territory}</p>}
                </div>

                {/* STATE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">State *</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                                    ${errors.state ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    >
                        <option value="">Select State</option>

                        {Object.keys(stateDistricts).map((state) => (
                            <option key={state}>{state}</option>
                        ))}

                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                {/* DISTRICT */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">District *</label>
                    <select
                        name="district"
                        value={formData.district}
                        disabled={!formData.state}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:outline-none 
                                    ${errors.district ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}
                                    ${!formData.state && "bg-gray-100 cursor-not-allowed"}`}
                    >
                        <option value="">Select District</option>

                        {formData.state &&
                            stateDistricts[formData.state].map((district) => (
                                <option key={district}>{district}</option>
                            ))}

                    </select>
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                {/* CITY */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">City</label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#0070b9]"
                        placeholder="City"
                    />
                </div>

                {/* STREET ADDRESS */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Street Address</label>
                    <input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#0070b9]"
                        placeholder="House No / Street / Area"
                    />
                </div>

                {/* PIN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">PIN Code</label>
                    <input
                        name="pin"
                        value={formData.pin}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#0070b9]"
                        placeholder="PIN Code"
                    />
                </div>
            </div>

            {/* NEXT BUTTON */}
            <div className="flex justify-end mt-8">
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
