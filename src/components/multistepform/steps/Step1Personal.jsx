import React, { useState } from "react";
import { stateDistricts } from "../../../stateData/stateDistrictData";

export default function Step1Personal({ formData, setFormData, next, prev }) {
    const [errors, setErrors] = useState({});

    // VALIDATION FUNCTION
    const validateStep = () => {
        let newErrors = {};

        // NAME
        if (!formData.name) newErrors.name = "Name is required";

        // EMAIL
        if (!formData.email) newErrors.email = "Email is required";

        // PHONE
        if (!formData.phone) {
            newErrors.phone = "Phone is required";
        } else if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = "Phone must contain only numbers";
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone must be exactly 10 digits";
        }

        // ALT PHONE (optional)
        if (formData.altPhone) {
            if (!/^\d+$/.test(formData.altPhone)) {
                newErrors.altPhone = "Alternate phone must contain only numbers";
            } else if (formData.altPhone.length !== 10) {
                newErrors.altPhone = "Alternate phone must be 10 digits";
            }
        }

        // ADDRESS VALIDATION
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.pin) newErrors.pin = "PIN Code is required";
        else if (!/^\d+$/.test(formData.pin))
            newErrors.pin = "PIN must contain only numbers";
        else if (formData.pin.length !== 6)
            newErrors.pin = "PIN Code must be 6 digits";

        if (!formData.streetAddress)
            newErrors.streetAddress = "Street Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset district when state changes
        if (name === "state") {
            setFormData({
                ...formData,
                state: value,
                district: "",
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CLIENT NAME */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Client Name *
                    </label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter client name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email *
                    </label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* PHONE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Phone *
                    </label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10)
                                setFormData({ ...formData, phone: value });
                        }}
                        className={`w-full border p-3 rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Phone number"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* ALT PHONE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Alternate Phone
                    </label>
                    <input
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10)
                                setFormData({ ...formData, altPhone: value });
                        }}
                        className={`w-full border p-3 rounded-lg ${errors.altPhone ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Alternate contact number"
                    />
                    {errors.altPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.altPhone}</p>
                    )}
                </div>

                {/* STATE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        State *
                    </label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.state ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select State</option>
                        {Object.keys(stateDistricts).map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                </div>

                {/* DISTRICT */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        District *
                    </label>
                    <select
                        name="district"
                        disabled={!formData.state}
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.district ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select District</option>
                        {formData.state &&
                            stateDistricts[formData.state].map((d) => (
                                <option key={d}>{d}</option>
                            ))}
                    </select>
                    {errors.district && (
                        <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                </div>

                {/* CITY */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        City *
                    </label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="City"
                    />
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                </div>

                {/* PIN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        PIN Code *
                    </label>
                    <input
                        name="pin"
                        value={formData.pin}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 6)
                                setFormData({ ...formData, pin: value });
                        }}
                        className={`w-full border p-3 rounded-lg ${errors.pin ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="PIN Code"
                    />
                    {errors.pin && (
                        <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                    )}
                </div>

                {/* STREET ADDRESS */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">
                        Street Address *
                    </label>
                    <input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg ${errors.streetAddress ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="House No / Street / Area"
                    />
                    {errors.streetAddress && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.streetAddress}
                        </p>
                    )}
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
