import React, { useState } from "react";

export default function Step2Documents({ formData, setFormData, next, prev }) {

    const [errors, setErrors] = useState({});

    const validateStep = () => {
        let newErrors = {};

        // Aadhaar must be exactly 2 images
        if (!formData.adharImages || formData.adharImages.length !== 2) {
            newErrors.adharImages = "Please upload 2 Aadhaar images (Front + Back)";
        }

        // PAN required
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

        // Aadhaar field (must be exactly 2)
        if (name === "adharImages") {
            if (files.length > 2) {
                setErrors({
                    ...errors,
                    adharImages: "You can upload maximum 2 Aadhaar images",
                });
                return;
            }

            if (files.length !== 2) {
                setErrors({
                    ...errors,
                    adharImages: "Please upload exactly 2 Aadhaar images",
                });
            } else {
                setErrors({ ...errors, adharImages: "" });
            }

            setFormData({
                ...formData,
                adharImages: Array.from(files),
            });

            return;
        }

        // Other file fields
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
                    <label className="block text-gray-700 font-medium mb-1">
                        Aadhaar Card *
                    </label>

                    <input
                        type="file"
                        name="adharImages"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className={`w-full border p-3 rounded-lg bg-white 
                            ${errors.adharImages ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    />

                    {/* Aadhaar Error */}
                    {errors.adharImages && (
                        <p className="text-red-500 text-sm mt-1">{errors.adharImages}</p>
                    )}

                    {/* Aadhaar Image Preview */}
                    {formData.adharImages && formData.adharImages.length > 0 && (
                        <div className="flex gap-4 mt-3">
                            {Array.from(formData.adharImages).map((img, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    className="w-28 h-20 object-cover rounded border"
                                    alt={`Aadhaar ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* PAN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        PAN Card *
                    </label>
                    <input
                        type="file"
                        name="panImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`w-full border p-3 rounded-lg bg-white 
                            ${errors.panImage ? "border-red-500" : "border-gray-300 focus:border-[#0070b9]"}`}
                    />

                    {errors.panImage && (
                        <p className="text-red-500 text-sm mt-1">{errors.panImage}</p>
                    )}
                </div>

                {/* COMPANY PAN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Company PAN (Optional)
                    </label>
                    <input
                        type="file"
                        name="companyPanImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:border-[#0070b9]"
                    />
                </div>

                {/* ADDRESS PROOF */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Address Proof (Optional)
                    </label>
                    <input
                        type="file"
                        name="addressProof"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:border-[#0070b9]"
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
