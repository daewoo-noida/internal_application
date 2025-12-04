import React, { useState } from "react";
import { personalStateDistricts } from "../../../stateData/personalStateDistricts";

export default function Step1Personal({ formData, setFormData, next, prev }) {
    const [errors, setErrors] = useState({});

    const validateStep = () => {
        let newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";

        if (!formData.phone) {
            newErrors.phone = "Phone is required";
        } else if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = "Phone must contain only numbers";
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone must be exactly 10 digits";
        }

        // Personal address validation
        if (!formData.personalState) newErrors.personalState = "State is required";
        if (!formData.personalDistrict) newErrors.personalDistrict = "District is required";
        if (!formData.personalCity) newErrors.personalCity = "City is required";
        if (!formData.personalStreetAddress) newErrors.personalStreetAddress = "Street Address is required";
        if (!formData.personalPin) newErrors.personalPin = "PIN is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "personalState") {
            setFormData({
                ...formData,
                personalState: value,
                personalDistrict: "",
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setErrors({ ...errors, [name]: "" });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CLIENT NAME */}
                <div>
                    <label className="block font-medium">Client Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter client name"
                        className={`w-full border p-3 rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block font-medium">Email *</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className={`w-full border p-3 rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* PHONE */}
                <div>
                    <label className="block font-medium">Phone *</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) setFormData({ ...formData, phone: value });
                        }}
                        placeholder="Phone number"
                        className={`w-full border p-3 rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                {/* ALT PHONE */}
                <div>
                    <label className="block font-medium">Alternate Phone</label>
                    <input
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) setFormData({ ...formData, altPhone: value });
                        }}
                        placeholder="Optional"
                        className="w-full border p-3 rounded-lg border-gray-300"
                    />
                </div>

                {/* PERSONAL STATE */}
                <div>
                    <label className="block font-medium">State *</label>
                    <select
                        name="personalState"
                        value={formData.personalState}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.personalState ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select State</option>
                        {Object.keys(personalStateDistricts).map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    {errors.personalState && <p className="text-red-500 text-sm">{errors.personalState}</p>}
                </div>

                {/* PERSONAL DISTRICT */}
                <div>
                    <label className="block font-medium">District *</label>
                    <select
                        name="personalDistrict"
                        value={formData.personalDistrict}
                        onChange={handleChange}
                        disabled={!formData.personalState}
                        className={`w-full border p-3 rounded-lg ${errors.personalDistrict ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select District</option>
                        {formData.personalState &&
                            personalStateDistricts[formData.personalState].map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                    </select>
                    {errors.personalDistrict && <p className="text-red-500 text-sm">{errors.personalDistrict}</p>}
                </div>

                {/* PERSONAL CITY */}
                <div>
                    <label className="block font-medium">City *</label>
                    <input
                        name="personalCity"
                        value={formData.personalCity}
                        onChange={handleChange}
                        placeholder="City"
                        className={`w-full border p-3 rounded-lg ${errors.personalCity ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.personalCity && <p className="text-red-500 text-sm">{errors.personalCity}</p>}
                </div>

                {/* PERSONAL PIN */}
                <div>
                    <label className="block font-medium">PIN Code *</label>
                    <input
                        name="personalPin"
                        value={formData.personalPin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 6) setFormData({ ...formData, personalPin: val });
                        }}
                        placeholder="6 digit PIN"
                        className={`w-full border p-3 rounded-lg ${errors.personalPin ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.personalPin && <p className="text-red-500 text-sm">{errors.personalPin}</p>}
                </div>

                {/* STREET ADDRESS */}
                <div className="md:col-span-2">
                    <label className="block font-medium">Street Address *</label>
                    <input
                        name="personalStreetAddress"
                        value={formData.personalStreetAddress}
                        onChange={handleChange}
                        placeholder="House No / Street / Area"
                        className={`w-full border p-3 rounded-lg ${errors.personalStreetAddress ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.personalStreetAddress && (
                        <p className="text-red-500 text-sm">{errors.personalStreetAddress}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button onClick={prev} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl">
                    ← Back
                </button>

                <button onClick={handleNext} className="bg-[#0070b9] text-white px-6 py-3 rounded-xl">
                    Next →
                </button>
            </div>
        </div>
    );
}
