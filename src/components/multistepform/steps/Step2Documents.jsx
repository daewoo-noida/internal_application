import React, { useState } from "react";
import { FileText, Image as ImageIcon, File } from "lucide-react";

export default function Step2Documents({ formData, setFormData, next, prev }) {

    const [errors, setErrors] = useState({});

    const validateStep = () => {
        let newErrors = {};

        if (!formData.adharImages || formData.adharImages.length === 0) {
            newErrors.adharImages = "At least 1 Aadhaar document is required";
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

        if (name === "gstFile") {
            setFormData({
                ...formData,
                gstFile: files[0],
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: files[0],
        });
    };

    const removeFile = (fileName, isArray = false, index = null) => {
        if (isArray && index !== null) {
            const newArray = [...formData[fileName]];
            newArray.splice(index, 1);
            setFormData({
                ...formData,
                [fileName]: newArray
            });
        } else {
            setFormData({
                ...formData,
                [fileName]: null
            });
        }
    };

    const getFileIcon = (file) => {
        if (!file) return <File size={20} />;

        const type = file.type;
        const name = file.name.toLowerCase();

        if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
            return <ImageIcon size={20} />;
        } else if (type === 'application/pdf' || name.endsWith('.pdf')) {
            return <FileText size={20} />;
        } else {
            return <File size={20} />;
        }
    };

    const getFilePreview = (file, index) => {
        if (!file) return null;

        const type = file.type;
        const name = file.name.toLowerCase();

        if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
            return (
                <div className="relative">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-28 h-20 object-cover rounded border"
                    />
                    <button
                        type="button"
                        onClick={() => removeFile('adharImages', true, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                        ×
                    </button>
                </div>
            );
        } else if (type === 'application/pdf' || name.endsWith('.pdf')) {
            return (
                <div className="relative border border-gray-300 rounded p-3 w-28 h-20 flex flex-col items-center justify-center">
                    <FileText size={24} className="text-red-500" />
                    <span className="text-xs mt-1 truncate w-full text-center">
                        {file.name.length > 15 ? `${file.name.substring(0, 12)}...` : file.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => removeFile('adharImages', true, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                        ×
                    </button>
                </div>
            );
        }

        return (
            <div className="border border-gray-300 rounded p-3 w-28 h-20 flex flex-col items-center justify-center">
                <File size={24} className="text-gray-500" />
                <span className="text-xs mt-1 truncate w-full text-center">
                    {file.name.length > 15 ? `${file.name.substring(0, 12)}...` : file.name}
                </span>
                <button
                    type="button"
                    onClick={() => removeFile('adharImages', true, index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                    ×
                </button>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0070b9] mb-6">Document Uploads</h2>

            <div className="space-y-6">
                {/* Aadhaar */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Aadhaar (Front and Back) *
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                        Upload images (JPG, PNG) or PDF files of your Aadhaar card
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0070b9] transition-colors">
                        <input
                            type="file"
                            name="adharImages"
                            accept="image/*,.pdf"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="adharImagesInput"
                        />

                        <label
                            htmlFor="adharImagesInput"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <FileText className="text-[#0070b9]" size={24} />
                            </div>
                            <p className="text-gray-700 font-medium mb-1">
                                Click to upload Aadhaar documents
                            </p>
                            <p className="text-gray-500 text-sm">
                                Supports JPG, PNG, PDF (Max 5MB each)
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                                Upload front and back sides separately
                            </p>
                        </label>
                    </div>

                    {errors.adharImages && (
                        <p className="text-red-500 text-sm mt-1">{errors.adharImages}</p>
                    )}

                    {formData.adharImages?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-gray-600 text-sm mb-2">
                                Uploaded Aadhaar documents ({formData.adharImages.length})
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {formData.adharImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        {getFilePreview(file, index)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* PAN Card */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        PAN Card *
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                        Upload image or PDF of your PAN card
                    </p>

                    {formData.panImage ? (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(formData.panImage)}
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {formData.panImage.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {(formData.panImage.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile('panImage')}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0070b9] transition-colors">
                            <input
                                type="file"
                                name="panImage"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="panImageInput"
                            />

                            <label
                                htmlFor="panImageInput"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <FileText className="text-[#0070b9]" size={24} />
                                </div>
                                <p className="text-gray-700 font-medium mb-1">
                                    Click to upload PAN card
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Supports JPG, PNG, PDF (Max 5MB)
                                </p>
                            </label>
                        </div>
                    )}

                    {errors.panImage && (
                        <p className="text-red-500 text-sm mt-1">{errors.panImage}</p>
                    )}
                </div>

                {/* Company PAN (Optional) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Company PAN (Optional)
                    </label>

                    {formData.companyPanImage ? (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(formData.companyPanImage)}
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {formData.companyPanImage.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {(formData.companyPanImage.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile('companyPanImage')}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-6 text-center hover:border-[#0070b9] transition-colors">
                            <input
                                type="file"
                                name="companyPanImage"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="companyPanImageInput"
                            />

                            <label
                                htmlFor="companyPanImageInput"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <FileText className="text-gray-500" size={20} />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">
                                    Click to upload Company PAN
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Optional - JPG, PNG, PDF
                                </p>
                            </label>
                        </div>
                    )}
                </div>

                {/* GST (Optional) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        GST Certificate (Optional)
                    </label>

                    {formData.gstFile ? (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(formData.gstFile)}
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {formData.gstFile.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {(formData.gstFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile('gstFile')}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-6 text-center hover:border-[#0070b9] transition-colors">
                            <input
                                type="file"
                                name="gstFile"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="gstFileInput"
                            />

                            <label
                                htmlFor="gstFileInput"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <FileText className="text-gray-500" size={20} />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">
                                    Click to upload GST Certificate
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Optional - JPG, PNG, PDF
                                </p>
                            </label>
                        </div>
                    )}
                </div>


                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-blue-800 font-medium mb-2">File Requirements:</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Accepted formats: JPG, PNG, PDF</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Maximum file size: 5MB per file</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Aadhaar: Upload both front and back sides (2 files)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>PAN Card: Required for all applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Ensure documents are clear and readable</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={prev}
                    className="bg-gray-300 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors flex items-center gap-2"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="bg-[#0070b9] text-white px-6 py-3 rounded-xl hover:bg-[#0070b9] transition-colors flex items-center gap-2"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}