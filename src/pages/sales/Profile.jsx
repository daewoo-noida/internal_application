import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { authAPI } from "../../utils/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [edit, setEdit] = useState(false);
    const [customBranch, setCustomBranch] = useState("");

    useEffect(() => {
        loadUser();
    }, []);

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

    const saveChanges = async () => {
        const updated = { ...form };
        if (form.officeBranch === "Others") {
            updated.officeBranch = customBranch;
        }

        const res = await authAPI.updateProfile(updated);
        setUser(res.data.user);
        setEdit(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("image", file);

        const res = await authAPI.updateProfileImage(fd);

        setUser({ ...user, profileImage: res.data.imageUrl });
        setForm({ ...form, profileImage: res.data.imageUrl });
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div
            className="flex justify-center bg-gray-100 min-h-screen py-10 md:py-20"
            style={{ paddingTop: "12vh" }}
        >
            <div className="w-[95%] md:w-[85%] bg-white rounded-3xl shadow-xl overflow-hidden 
                flex flex-col md:flex-row">

                {/* LEFT PANEL */}
                <div className="w-full md:w-1/3 bg-[#0066b3] text-center py-10 md:py-16 
                    flex flex-col items-center justify-center">

                    <div className="relative">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-white"
                            />
                        ) : (
                            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-[#0066b3] text-4xl md:text-5xl font-bold shadow-xl">
                                {user.name[0].toUpperCase()}
                            </div>
                        )}

                        <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <Image />
                        </label>
                    </div>

                    <h2 className="mt-6 text-xl md:text-2xl text-white font-semibold">
                        Let’s get you set up
                    </h2>

                    <p className="text-white/80 mt-2 w-[80%] text-sm md:text-base">
                        It should only take a couple of minutes to complete your profile.
                    </p>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-2/3 px-6 md:px-12 py-8 md:py-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0066b3] mb-6 md:mb-8">
                        User Profile
                    </h2>

                    {/* FORM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Input label="Name" disabled={!edit}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <Input label="Email" disabled value={user.email} />

                        {/* Gender */}
                        <div>
                            <label className="block mb-1 text-gray-600">Gender</label>
                            <div className="flex items-center gap-4 mt-2">
                                {["Male", "Female", "Other"].map((g) => (
                                    <label key={g} className="flex gap-2 text-sm md:text-base">
                                        <input
                                            type="radio"
                                            value={g}
                                            disabled={!edit}
                                            checked={form.gender === g}
                                            onChange={(e) =>
                                                setForm({ ...form, gender: e.target.value })
                                            }
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Date of Birth"
                            type="date"
                            disabled={!edit}
                            value={form.dob?.slice(0, 10) || ""}
                            onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        />

                        <Input label="Mobile" disabled={!edit}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />

                        <Input label="Designation" disabled value={user.designation} />

                        {/* Branch */}
                        <div>
                            <label className="block mb-1 text-gray-600">Office Branch *</label>
                            <select
                                disabled={!edit}
                                value={
                                    ["Noida", "Zirakpur", "Chandigadh", "Mumbai",
                                        "Hyderabad", "Others"].includes(form.officeBranch)
                                        ? form.officeBranch
                                        : "Others"
                                }
                                onChange={(e) =>
                                    setForm({ ...form, officeBranch: e.target.value })
                                }
                                className="w-full border p-3 rounded-xl bg-gray-100"
                            >
                                <option>Noida</option>
                                <option>Zirakpur</option>
                                <option>Chandigadh</option>
                                <option>Mumbai</option>
                                <option>Hyderabad</option>
                                <option>Others</option>
                            </select>

                            {form.officeBranch === "Others" && edit && (
                                <input
                                    placeholder="Enter branch"
                                    className="border mt-3 w-full p-3 rounded-xl"
                                    value={customBranch}
                                    onChange={(e) => setCustomBranch(e.target.value)}
                                />
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
                                    }}
                                    className="px-6 py-2 bg-gray-200 rounded-xl w-full md:w-auto"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveChanges}
                                    className="px-6 py-2 bg-green-600 text-white rounded-xl w-full md:w-auto"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEdit(true)}
                                className="px-6 py-2 bg-[#0066b3] text-white rounded-xl w-full md:w-auto"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, disabled, type = "text" }) {
    return (
        <div>
            <label className="block text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                disabled={disabled}
                value={value}
                onChange={onChange}
                className={`w-full p-3 rounded-xl border ${disabled ? "bg-gray-100" : "bg-white"}`}
            />
        </div>
    );
}
