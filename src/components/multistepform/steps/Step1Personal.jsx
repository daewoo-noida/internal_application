import React, { useState } from "react";
import { stateDistricts } from "../../../stateData/stateDistrictData";
import { ddpTerritories } from "../../../stateData/ddpTerritories";
import Select from "react-select";

export default function Step1Personal({ formData, setFormData, next }) {

    const [errors, setErrors] = useState({});

    // VALIDATION FUNCTION
    const validateStep = () => {
        let newErrors = {};

        // ALL FIELDS REQUIRED FOR ALL FRANCHISE TYPES
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.phone) newErrors.phone = "Phone is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.franchiseType) newErrors.franchiseType = "Franchise Type is required";
        if (!formData.territory) newErrors.territory = "Territory is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.streetAddress) newErrors.streetAddress = "Street Address is required";
        if (!formData.pin) newErrors.pin = "PIN Code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset fields on franchise change
        if (name === "franchiseType") {
            setFormData({
                ...formData,
                franchiseType: value,
                territory: "",
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // Territory options based on franchise
    const territoryOptions =
        formData.franchiseType === "DDP Franchise"
            ? ddpTerritories
            : Object.keys(stateDistricts);

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">Personal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* FRANCHISE TYPE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Franchise Type *</label>
                    <select
                        name="franchiseType"
                        value={formData.franchiseType}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg 
                            ${errors.franchiseType ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select Franchise Type</option>
                        <option value="Master Franchise">Master Franchise</option>
                        <option value="DDP Franchise">DDP Franchise</option>
                        <option value="Signature">Signature Store</option>
                    </select>
                    {errors.franchiseType && <p className="text-red-500 text-sm mt-1">{errors.franchiseType}</p>}
                </div>

                {/* CLIENT NAME */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Client Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg 
                            ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter client name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email *</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg"
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
                        className={`w-full border p-3 rounded-lg 
                            ${errors.phone ? "border-red-500" : "border-gray-300"}`}
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
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="Alternate contact number"
                    />
                </div>

                {/* TERRITORY */}
                {/* TERRITORY */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Territory *</label>

                    <Select
                        options={territoryOptions.map((item) => ({
                            label: item,
                            value: item
                        }))}
                        value={
                            formData.territory
                                ? { label: formData.territory, value: formData.territory }
                                : null
                        }
                        onChange={(selected) => {
                            setFormData({
                                ...formData,
                                territory: selected.value
                            });
                            setErrors({ ...errors, territory: "" });
                        }}
                        placeholder="Search Territory..."
                        className="text-black"
                    />

                    {errors.territory && (
                        <p className="text-red-500 text-sm mt-1">{errors.territory}</p>
                    )}
                </div>


                {/* STATE */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">State *</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg 
                            ${errors.state ? "border-red-500" : "border-gray-300"}`}
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
                        className={`w-full border p-3 rounded-lg 
                            ${errors.district ? "border-red-500" : "border-gray-300"}`}
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
                    <label className="block text-gray-700 font-medium mb-1">City *</label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* STREET ADDRESS */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Street Address *</label>
                    <input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="House No / Street / Area"
                    />
                    {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                </div>

                {/* PIN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">PIN Code *</label>
                    <input
                        name="pin"
                        value={formData.pin}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="PIN Code"
                    />
                    {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
                </div>
            </div>

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
