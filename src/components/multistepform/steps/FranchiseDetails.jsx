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

        // MF
        if (formData.franchiseType === "Master Franchise" && !formData.territory)
            err.territory = "Select a territory";

        // DDP
        if (formData.franchiseType === "DDP Franchise") {
            if (!formData.state) err.state = "State is required";
            if (!formData.territory) err.territory = "Select DDP territory";
        }

        // SIGNATURE
        if (formData.franchiseType === "Signature") {
            if (!formData.state) err.state = "State is required";
            if (!formData.district) err.district = "District is required";
            if (!formData.city) err.city = "City is required";
            if (!formData.pin) err.pin = "PIN is required";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleNext = () => {
        if (validate()) next();
    };

    // ---------------- COMPONENT UI ----------------
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
                                state: "",
                                territory: "",
                                district: "",
                                city: "",
                                pin: "",
                            })
                        }
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="">Select</option>
                        <option value="Master Franchise">Master Franchise</option>
                        <option value="DDP Franchise">Daewoo District Partner Franchise</option>
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
                {formData.franchiseType === "DDP Franchise" && (
                    <>
                        {/* STATE */}
                        <div>
                            <label className="font-medium">State *</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        state: e.target.value,
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
                            {errors.state && (
                                <p className="text-red-500 text-sm">{errors.state}</p>
                            )}
                        </div>

                        {/* TERRITORY (STATE BASED) */}
                        <div className="md:col-span-2">
                            <label className="font-medium">Territory *</label>
                            <Select
                                options={
                                    formData.state
                                        ? ddpTerritories[formData.state].map(t => ({
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
                                    formData.state
                                        ? "Select DDP Territory"
                                        : "Select State First"
                                }
                                isDisabled={!formData.state}
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
                                name="state"
                                value={formData.state}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        state: e.target.value,
                                        district: "",
                                    })
                                }
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="">Select State</option>
                                {Object.keys(stateDistricts).map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                            {errors.state && (
                                <p className="text-red-500 text-sm">{errors.state}</p>
                            )}
                        </div>

                        {/* DISTRICT */}
                        <div>
                            <label className="font-medium">District *</label>
                            <select
                                name="district"
                                disabled={!formData.state}
                                value={formData.district}
                                onChange={(e) =>
                                    setFormData({ ...formData, district: e.target.value })
                                }
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="">Select District</option>
                                {formData.state &&
                                    stateDistricts[formData.state].map((d) => (
                                        <option key={d}>{d}</option>
                                    ))}
                            </select>
                            {errors.district && (
                                <p className="text-red-500 text-sm">{errors.district}</p>
                            )}
                        </div>

                        {/* CITY */}
                        <div>
                            <label className="font-medium">City *</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                                className="w-full border p-3 rounded-lg"
                                placeholder="Enter city"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm">{errors.city}</p>
                            )}
                        </div>

                        {/* PIN */}
                        <div>
                            <label className="font-medium">PIN Code *</label>
                            <input
                                name="pin"
                                value={formData.pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 6)
                                        setFormData({ ...formData, pin: value });
                                }}
                                className="w-full border p-3 rounded-lg"
                                placeholder="PIN Code"
                            />
                            {errors.pin && (
                                <p className="text-red-500 text-sm">{errors.pin}</p>
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
