import React, { useState } from "react";
import { stateDistricts } from "../../../stateData/stateDistrictData";
import { ddpTerritories } from "../../../stateData/ddpTerritories";
import { mfTerritories } from "../../../stateData/mfTerritories";
import Select from "react-select";

export default function FranchiseDetails({ formData, setFormData, next }) {

    const [errors, setErrors] = useState({});

    // ---------------- VALIDATION ----------------
    const validate = () => {
        let err = {};

        if (!formData.franchiseType)
            err.franchiseType = "Please select a franchise type";

        // MASTER
        if (formData.franchiseType === "Master Franchise" && !formData.territory)
            err.territory = "Select a territory";

        // DDP
        if (formData.franchiseType === "Daewoo District Partner Franchise") {
            if (!formData.franchiseState) err.franchiseState = "State is required";
            if (!formData.territory) err.territory = "Select DDP territory";
        }

        // SIGNATURE
        if (formData.franchiseType === "Signature") {
            if (!formData.franchiseState) err.franchiseState = "State is required";
            if (!formData.franchiseDistrict) err.franchiseDistrict = "District is required";
            if (!formData.franchiseCity) err.franchiseCity = "City is required";
            if (!formData.franchisePin) err.franchisePin = "PIN is required";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleNext = () => {
        if (validate()) next();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">Franchise Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* FRANCHISE TYPE */}
                <div>
                    <label className="font-medium">Franchise Type *</label>
                    <select
                        name="franchiseType"
                        value={formData.franchiseType}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                franchiseType: e.target.value,

                                // Reset dependent values
                                franchiseState: "",
                                territory: "",
                                franchiseDistrict: "",
                                franchiseCity: "",
                                franchisePin: "",
                            })
                        }
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="">Select</option>
                        <option value="Master Franchise">Master Franchise</option>
                        <option value="Daewoo District Partner Franchise">Daewoo District Partner Franchise</option>
                        <option value="Signature">Signature Store</option>
                    </select>
                    {errors.franchiseType && (
                        <p className="text-red-500 text-sm">{errors.franchiseType}</p>
                    )}
                </div>

                {/* ---------------- MASTER FRANCHISE ---------------- */}
                {formData.franchiseType === "Master Franchise" && (
                    <div className="md:col-span-2">
                        <label className="font-medium">Territory *</label>
                        <Select
                            options={mfTerritories.map(t => ({ label: t, value: t }))}
                            value={
                                formData.territory
                                    ? { label: formData.territory, value: formData.territory }
                                    : null
                            }
                            onChange={(selected) =>
                                setFormData({ ...formData, territory: selected.value })
                            }
                            placeholder="Select Master Franchise Territory"
                        />
                        {errors.territory && (
                            <p className="text-red-500 text-sm">{errors.territory}</p>
                        )}
                    </div>
                )}

                {/* ---------------- DDP FRANCHISE ---------------- */}
                {formData.franchiseType === "Daewoo District Partner Franchise" && (
                    <>
                        {/* STATE */}
                        <div>
                            <label className="font-medium">State *</label>
                            <select
                                name="franchiseState"
                                value={formData.franchiseState}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        franchiseState: e.target.value,
                                        territory: "",
                                    })
                                }
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="">Select State</option>
                                {Object.keys(ddpTerritories).map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                            {errors.franchiseState && (
                                <p className="text-red-500 text-sm">{errors.franchiseState}</p>
                            )}
                        </div>

                        {/* TERRITORY */}
                        <div className="md:col-span-2">
                            <label className="font-medium">Territory *</label>
                            <Select
                                options={
                                    formData.franchiseState
                                        ? (ddpTerritories[formData.franchiseState] || []).map(t => ({
                                            label: t,
                                            value: t
                                        }))
                                        : []
                                }
                                value={
                                    formData.territory
                                        ? { label: formData.territory, value: formData.territory }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({ ...formData, territory: selected.value })
                                }
                                placeholder={
                                    formData.franchiseState
                                        ? "Select DDP Territory"
                                        : "Select State First"
                                }
                                isDisabled={!formData.franchiseState}
                            />
                            {errors.territory && (
                                <p className="text-red-500 text-sm">{errors.territory}</p>
                            )}
                        </div>
                    </>
                )}

                {/* ---------------- SIGNATURE STORE ---------------- */}
                {formData.franchiseType === "Signature" && (
                    <>
                        {/* STATE */}
                        <div>
                            <label className="font-medium">State *</label>
                            <select
                                name="franchiseState"
                                value={formData.franchiseState}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        franchiseState: e.target.value,
                                        franchiseDistrict: "",
                                    })
                                }
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="">Select State</option>
                                {Object.keys(stateDistricts).map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                            {errors.franchiseState && (
                                <p className="text-red-500 text-sm">{errors.franchiseState}</p>
                            )}
                        </div>

                        {/* DISTRICT */}
                        <div>
                            <label className="font-medium">District *</label>
                            <select
                                name="franchiseDistrict"
                                disabled={!formData.franchiseState}
                                value={formData.franchiseDistrict}
                                onChange={(e) =>
                                    setFormData({ ...formData, franchiseDistrict: e.target.value })
                                }
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="">Select District</option>

                                {(stateDistricts[formData.franchiseState] || []).map((d) => (
                                    <option key={d}>{d}</option>
                                ))}
                            </select>
                            {errors.franchiseDistrict && (
                                <p className="text-red-500 text-sm">{errors.franchiseDistrict}</p>
                            )}
                        </div>

                        {/* CITY */}
                        <div>
                            <label className="font-medium">City *</label>
                            <input
                                name="franchiseCity"
                                value={formData.franchiseCity}
                                onChange={(e) =>
                                    setFormData({ ...formData, franchiseCity: e.target.value })
                                }
                                className="w-full border p-3 rounded-lg"
                                placeholder="Enter city"
                            />
                            {errors.franchiseCity && (
                                <p className="text-red-500 text-sm">{errors.franchiseCity}</p>
                            )}
                        </div>

                        {/* PIN */}
                        <div>
                            <label className="font-medium">PIN Code *</label>
                            <input
                                name="franchisePin"
                                value={formData.franchisePin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 6)
                                        setFormData({ ...formData, franchisePin: value });
                                }}
                                className="w-full border p-3 rounded-lg"
                                placeholder="PIN Code"
                            />
                            {errors.franchisePin && (
                                <p className="text-red-500 text-sm">{errors.franchisePin}</p>
                            )}
                        </div>
                    </>
                )}

            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    className="bg-[#0070b9] text-white px-6 py-3 rounded-lg font-semibold"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
