import React, { useState } from "react";

export default function Step2Documents({ formData, setFormData, next, prev }) {
    const [errors, setErrors] = useState({});

    const validateStep = () => {
        let newErrors = {};

        if (!formData.adharImages || formData.adharImages.length !== 2) {
            newErrors.adharImages = "Please upload 2 Aadhaar images (Front + Back)";
        }

        if (!formData.panImage) {
            newErrors.panImage = "PAN card is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) next();
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (name === "adharImages") {
            if (files.length !== 2) {
                setErrors({
                    ...errors,
                    adharImages: "Please upload exactly 2 Aadhaar images",
                });
                return;
            }

            setErrors({ ...errors, adharImages: "" });

            setFormData({
                ...formData,
                adharImages: Array.from(files),
            });
            return;
        }

        // NEW FIX — handle GST correctly
        if (name === "gstFile") {
            setFormData({
                ...formData,
                gstFile: files[0],
            });
            return;
        }

        // PAN, Company PAN etc
        if (files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });

            setErrors({ ...errors, [name]: "" });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">
                Document Uploads
            </h2>

            <div className="grid grid-cols-1 gap-6">

                {/* AADHAAR */}
                <div>
                    <label className="block font-medium">Aadhaar Card *</label>
                    <input
                        type="file"
                        name="adharImages"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`w-full border p-3 rounded-lg ${errors.adharImages ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.adharImages && (
                        <p className="text-red-500 text-sm">{errors.adharImages}</p>
                    )}
                </div>

                {/* PAN */}
                <div>
                    <label className="block font-medium">PAN Card *</label>
                    <input
                        type="file"
                        name="panImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`w-full border p-3 rounded-lg ${errors.panImage ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.panImage && (
                        <p className="text-red-500 text-sm">{errors.panImage}</p>
                    )}
                </div>

                {/* COMPANY PAN */}
                <div>
                    <label className="block font-medium">Company PAN (Optional)</label>
                    <input
                        type="file"
                        name="companyPanImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    />
                </div>

                {/* GST FIXED FIELD */}
                <div>
                    <label className="block font-medium">GST (Optional)</label>
                    <input
                        type="file"
                        name="gstFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border p-3 rounded-lg border-gray-300"
                    />
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button onClick={prev} className="bg-gray-300 px-6 py-3 rounded-xl">
                    ← Back
                </button>
                <button onClick={handleNext} className="bg-[#0070b9] text-white px-6 py-3 rounded-xl">
                    Next →
                </button>
            </div>
        </div>
    );
}
