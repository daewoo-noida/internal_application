import React, { useEffect, useState } from "react";
import { Image, X, CheckCircle, Edit, ArrowRight, Info } from "lucide-react";
import { authAPI } from "../../utils/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [edit, setEdit] = useState(false);
    const [customBranch, setCustomBranch] = useState("");
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showGuide, setShowGuide] = useState(false); // New state for guide modal

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        // Show guide modal when user data is loaded and profile is incomplete
        if (user && !isProfileComplete(user)) {
            // Show after a short delay for better UX
            const timer = setTimeout(() => {
                setShowGuide(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const loadUser = async () => {
        const res = await authAPI.profile();
        setUser(res.data.user);
        setForm(res.data.user);

        if (
            res.data.user.officeBranch &&
            !["Noida", "Zirakpur", "Chandigadh", "Mumbai", "Hyderabad", "Others"]
                .includes(res.data.user.officeBranch)
        ) {
            setCustomBranch(res.data.user.officeBranch);
        }
    };

    // Check if profile is complete
    const isProfileComplete = (userData = user) => {
        return userData &&
            userData.gender && userData.gender.trim() !== "" &&
            userData.dob && userData.dob.trim() !== "" &&
            userData.officeBranch && userData.officeBranch.trim() !== "" &&
            userData.profileImage && userData.profileImage.trim() !== "";
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Gender validation
        if (!form.gender || form.gender.trim() === "") {
            newErrors.gender = "Gender is required";
        }

        // Date of Birth validation
        if (!form.dob || form.dob.trim() === "") {
            newErrors.dob = "Date of Birth is required";
        } else {
            const dobDate = new Date(form.dob);
            const today = new Date();
            if (dobDate > today) {
                newErrors.dob = "Date of Birth cannot be in the future";
            }
        }

        // Office Branch validation
        if (!form.officeBranch || form.officeBranch.trim() === "") {
            newErrors.officeBranch = "Office Branch is required";
        } else if (form.officeBranch === "Others" && (!customBranch || customBranch.trim() === "")) {
            newErrors.officeBranch = "Please specify your branch";
        }

        // Profile Image validation (optional but recommended)
        if (!form.profileImage || form.profileImage.trim() === "") {
            newErrors.profileImage = "Profile image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const saveChanges = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields correctly");
            return;
        }

        setIsSaving(true);
        try {
            const updated = { ...form };
            if (form.officeBranch === "Others") {
                updated.officeBranch = customBranch;
            }

            const res = await authAPI.updateProfile(updated);
            setUser(res.data.user);
            setEdit(false);
            setErrors({});

            // Update localStorage
            localStorage.setItem("userData", JSON.stringify(res.data.user));

            // ✅ Use the profileCompleted flag from server response
            if (res.data.profileCompleted) {
                localStorage.setItem("salesProfileComplete", "true");
            }

            // Close guide if profile is now complete
            if (res.data.profileCompleted) {
                setShowGuide(false);
                // Redirect to dashboard after successful completion
                setTimeout(() => {
                    window.location.href = "/sales/dashboard";
                }, 1500);
            }

            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid image file (JPEG, PNG, GIF)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("image", file);

            const res = await authAPI.updateProfileImage(fd);

            setUser({ ...user, profileImage: res.data.imageUrl });
            setForm({ ...form, profileImage: res.data.imageUrl });

            // Clear profile image error if any
            setErrors(prev => ({ ...prev, profileImage: "" }));

        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    if (!user) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <>
            {/* GUIDE MODAL */}
            {showGuide && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-[#0070b9] p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Welcome {user.name}!</h3>
                                        <p className="text-blue-100 text-sm mt-1">Complete your profile to get started</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {isProfileComplete() ? (
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <CheckCircle className="text-[#0070b9]" size={32} />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Profile Complete!</h4>
                                    <p className="text-gray-600 mb-6">
                                        Your profile is already complete. You can access all features now.
                                    </p>
                                    <button
                                        onClick={() => setShowGuide(false)}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-[#0070b9] transition-colors font-medium"
                                    >
                                        Continue to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-3">Please complete your profile:</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.profileImage ? 'bg-gray-100 text-[#0070b9]' : 'bg-gray-100 text-gray-400'}`}>
                                                    {user.profileImage ? <CheckCircle size={14} /> : "1"}
                                                </div>
                                                <span className={user.profileImage ? 'text-[#0070b9] font-medium' : 'text-gray-700'}>
                                                    Upload Profile Picture
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.gender ? 'bg-gray-100 text-[#0070b9]' : 'bg-gray-100 text-gray-400'}`}>
                                                    {user.gender ? <CheckCircle size={14} /> : "2"}
                                                </div>
                                                <span className={user.gender ? 'text-[#0070b9] font-medium' : 'text-gray-700'}>
                                                    Select Your Gender
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.dob ? 'bg-gray-100 text-[#0070b9]' : 'bg-gray-100 text-gray-400'}`}>
                                                    {user.dob ? <CheckCircle size={14} /> : "3"}
                                                </div>
                                                <span className={user.dob ? 'text-[#0070b9] font-medium' : 'text-gray-700'}>
                                                    Enter Date of Birth
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.officeBranch ? 'bg-gray-100 text-[#0070b9]' : 'bg-gray-100 text-gray-400'}`}>
                                                    {user.officeBranch ? <CheckCircle size={14} /> : "4"}
                                                </div>
                                                <span className={user.officeBranch ? 'text-[#0070b9] font-medium' : 'text-gray-700'}>
                                                    Choose Office Branch
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-blue-800 text-sm">
                                            <strong>Note:</strong> You need to complete all 4 steps above before you can access other pages.

                                        </p>
                                        <p className="text-blue-800 text-sm">
                                            <strong>Note:</strong> If you have already showing comleted step please edit and update.</p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {edit ? (
                                            <button
                                                onClick={saveChanges}
                                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        Save Profile & Continue
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEdit(true);
                                                    setShowGuide(false);
                                                }}
                                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-[#0070b9] transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Edit size={18} />
                                                Edit Profile to Complete
                                            </button>
                                        )}
                                        {/* <button
                                            onClick={() => setShowGuide(false)}
                                            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            I'll do it later
                                        </button> */}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <p className="text-gray-500 text-sm text-center">
                                You can access other features only after completing your profile
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN PROFILE CONTENT */}
            <div
                className="flex justify-center bg-gray-100 min-h-screen py-10 md:py-20"
                style={{ paddingTop: "12vh" }}
            >
                <div className="w-[95%] md:w-[85%] bg-white rounded-3xl shadow-xl overflow-hidden 
                    flex flex-col md:flex-row">

                    {/* LEFT PANEL */}
                    <div className="w-full md:w-1/3 bg-[#0066b3] text-center py-10 md:py-16 
                        flex flex-col items-center justify-center relative">

                        {/* Profile Completion Status */}
                        {isProfileComplete() && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                Profile Complete ✓
                            </div>
                        )}

                        {/* Help Button */}
                        <button
                            onClick={() => setShowGuide(true)}
                            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                            title="Need help?"
                        >
                            <Info size={18} />
                        </button>

                        <div className="relative">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-white"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-[#0066b3] text-4xl md:text-5xl font-bold shadow-xl">
                                    {user.name[0].toUpperCase()}
                                </div>
                            )}

                            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <Image size={20} />
                            </label>
                        </div>

                        {errors.profileImage && (
                            <p className="text-red-200 text-sm mt-2 bg-red-500/20 px-3 py-1 rounded">
                                {errors.profileImage}
                            </p>
                        )}

                        <h2 className="mt-6 text-xl md:text-2xl text-white font-semibold">
                            {isProfileComplete() ? "Profile Complete!" : "Let's get you set up"}
                        </h2>

                        <p className="text-white/80 mt-2 w-[80%] text-sm md:text-base">
                            {isProfileComplete()
                                ? "Your profile is complete and ready to use."
                                : "Complete your profile to access all features."}
                        </p>

                        {/* Progress indicator */}
                        {!isProfileComplete() && (
                            <div className="mt-4 w-3/4">
                                <div className="flex justify-between text-white text-xs mb-1">
                                    <span>Profile Completion</span>
                                    <span>
                                        {[
                                            user.gender ? 25 : 0,
                                            user.dob ? 25 : 0,
                                            user.officeBranch ? 25 : 0,
                                            user.profileImage ? 25 : 0
                                        ].reduce((a, b) => a + b, 0)}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/30 rounded-full h-2">
                                    <div
                                        className="bg-white h-2 rounded-full"
                                        style={{
                                            width: `${[
                                                user.gender ? 25 : 0,
                                                user.dob ? 25 : 0,
                                                user.officeBranch ? 25 : 0,
                                                user.profileImage ? 25 : 0
                                            ].reduce((a, b) => a + b, 0)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-full md:w-2/3 px-6 md:px-12 py-8 md:py-10">
                        <div className="flex justify-between items-center mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#0066b3]">
                                User Profile
                            </h2>
                            {!isProfileComplete() && (
                                <button
                                    onClick={() => setShowGuide(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-[#0070b9] transition-colors text-sm"
                                >
                                    <Info size={16} />
                                    Need Help?
                                </button>
                            )}
                        </div>

                        {/* FORM GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input label="Name" disabled={!edit}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <Input label="Email" disabled value={user.email} />

                            {/* Gender */}
                            <div>
                                <label className="block mb-1 text-gray-600">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-4 mt-2">
                                    {["Male", "Female", "Other"].map((g) => (
                                        <label key={g} className="flex gap-2 text-sm md:text-base items-center">
                                            <input
                                                type="radio"
                                                value={g}
                                                disabled={!edit}
                                                checked={form.gender === g}
                                                onChange={(e) => {
                                                    setForm({ ...form, gender: e.target.value });
                                                    setErrors(prev => ({ ...prev, gender: "" }));
                                                }}
                                                className="text-[#0066b3]"
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>

                            <Input
                                label="Date of Birth"
                                type="date"
                                disabled={!edit}
                                value={form.dob?.slice(0, 10) || ""}
                                onChange={(e) => {
                                    setForm({ ...form, dob: e.target.value });
                                    setErrors(prev => ({ ...prev, dob: "" }));
                                }}
                                error={errors.dob}
                            />

                            <Input label="Mobile" disabled={!edit}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />

                            <Input label="Designation" disabled value={user.designation} />

                            {/* Branch */}
                            <div>
                                <label className="block mb-1 text-gray-600">
                                    Office Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    disabled={!edit}
                                    value={
                                        ["Noida", "Zirakpur", "Chandigadh", "Mumbai",
                                            "Hyderabad", "Others"].includes(form.officeBranch)
                                            ? form.officeBranch
                                            : "Others"
                                    }
                                    onChange={(e) => {
                                        setForm({ ...form, officeBranch: e.target.value });
                                        setErrors(prev => ({ ...prev, officeBranch: "" }));
                                    }}
                                    className={`w-full border p-3 rounded-xl ${edit ? "bg-white" : "bg-gray-100"} ${errors.officeBranch ? "border-red-500" : ""}`}
                                >
                                    <option value="">Select Branch</option>
                                    <option value="Noida">Noida</option>
                                    <option value="Zirakpur">Zirakpur</option>
                                    <option value="Chandigadh">Chandigadh</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Others">Others</option>
                                </select>

                                {form.officeBranch === "Others" && edit && (
                                    <input
                                        placeholder="Enter branch name"
                                        className={`border mt-3 w-full p-3 rounded-xl ${errors.officeBranch ? "border-red-500" : ""}`}
                                        value={customBranch}
                                        onChange={(e) => {
                                            setCustomBranch(e.target.value);
                                            setErrors(prev => ({ ...prev, officeBranch: "" }));
                                        }}
                                    />
                                )}
                                {errors.officeBranch && (
                                    <p className="text-red-500 text-sm mt-1">{errors.officeBranch}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row justify-end mt-10 gap-4">
                            {edit ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setEdit(false);
                                            setForm(user);
                                            setErrors({});
                                        }}
                                        className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors w-full md:w-auto"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={saveChanges}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 w-full md:w-auto flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {!isProfileComplete() && (
                                        <button
                                            onClick={() => setShowGuide(true)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-[#0070b9] transition-colors w-full md:w-auto flex items-center gap-2"
                                        >
                                            <Info size={18} />
                                            Show Instructions
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEdit(true)}
                                        className="px-6 py-3 bg-[#0066b3] text-white rounded-xl hover:bg-[#005a94] transition-colors w-full md:w-auto flex items-center gap-2"
                                    >
                                        <Edit size={18} />
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Input({ label, value, onChange, disabled, type = "text", error }) {
    return (
        <div>
            <label className="block text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                disabled={disabled}
                value={value}
                onChange={onChange}
                className={`w-full p-3 rounded-xl border ${disabled ? "bg-gray-100" : "bg-white"} ${error ? "border-red-500" : ""}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}

// Add CSS for fade-in animation
const styles = `
@keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}