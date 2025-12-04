import React, { useState } from "react";

export default function Step2Documents({ formData, setFormData, next, prev }) {

    const [errors, setErrors] = useState({});

    const validateStep = () => {
        let newErrors = {};

        if (!formData.adharImages || formData.adharImages.length !== 2) {
            newErrors.adharImages = "Please upload exactly 2 Aadhaar images";
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
            setFormData({
                ...formData,
                adharImages: Array.from(files),
            });
            return;
        }

        if (name === "gst") {
            setFormData({
                ...formData,
                gstFile: files[0],   // ← store file properly
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: files[0],
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">Document Uploads</h2>

            <div className="grid grid-cols-1 gap-6">

                {/* Aadhaar */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Aadhaar Card *</label>
                    <input type="file" name="adharImages" accept="image/*" multiple
                        onChange={handleFileChange} className="w-full border p-3 rounded-lg bg-white" />

                    {formData.adharImages?.length > 0 && (
                        <div className="flex gap-4 mt-3">
                            {formData.adharImages.map((img, i) => (
                                <img key={i} src={URL.createObjectURL(img)}
                                    className="w-28 h-20 object-cover rounded border" />
                            ))}
                        </div>
                    )}
                </div>

                {/* PAN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">PAN Card *</label>
                    <input type="file" name="panImage" accept="image/*"
                        onChange={handleFileChange} className="w-full border p-3 rounded-lg bg-white" />
                </div>

                {/* Company PAN */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Company PAN (Optional)</label>
                    <input type="file" name="companyPanImage" accept="image/*"
                        onChange={handleFileChange} className="w-full border p-3 rounded-lg bg-white" />
                </div>

                {/* GST */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">GST (Optional)</label>
                    <input type="file" name="gst" accept="image/*"
                        onChange={handleFileChange} className="w-full border p-3 rounded-lg bg-white" />
                </div>

            </div>

            <div className="flex justify-between mt-8">
                <button onClick={prev} className="bg-gray-300 px-6 py-3 rounded-xl">← Back</button>
                <button onClick={handleNext} className="bg-[#0070b9] text-white px-6 py-3 rounded-xl">Next →</button>
            </div>
        </div>
    );
}
