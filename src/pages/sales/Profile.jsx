import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);

    // Fetch user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${API}/auth/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(res.data.user);
                setLoading(false);
            } catch (err) {
                console.log("Error fetching user", err);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!user) return <div className="text-center py-10">No user found</div>;

    return (
        <div className="w-full flex justify-center py-10 bg-gray-100">
            <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-2xl p-8 border-4 border-[#0070b9]">

                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-3xl font-bold text-[#0070b9]">User Profile</h1>
                </div>

                {/* Employee Code */}
                <div className="text-center mt-4">
                    <p className="text-lg text-gray-600">Employee ID</p>
                    <div className="flex justify-center items-center gap-2 bg-[#0070b9] text-white rounded-full w-48 py-2 mx-auto mt-2">
                        <i className="fa fa-user"></i>
                        <span className="font-semibold">{user.employeeId}</span>
                    </div>
                </div>

                {/* Two–Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                    <div>
                        <p className="label">Name</p>
                        <input value={user.name} disabled className="input-box" />

                        <p className="label">Email</p>
                        <input value={user.email} disabled className="input-box" />

                        <p className="label">Designation</p>
                        <input value={user.designation} disabled className="input-box" />
                    </div>

                    <div>
                        <p className="label">Contact</p>
                        <input value={user.phone} disabled className="input-box" />

                        <p className="label">Gender</p>
                        <input value={user.gender} disabled className="input-box" />

                        <p className="label">Date of Birth</p>
                        <input value={user.dob?.slice(0, 10)} disabled className="input-box" />
                    </div>
                </div>

                {/* Security Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-[#0070b9] mb-4">Security & Password</h2>

                    <button
                        onClick={() => setShowResetModal(true)}
                        className="blue-btn"
                    >
                        Reset Password
                    </button>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
                <ResetPasswordModal onClose={() => setShowResetModal(false)} />
            )}
        </div>
    );
}


/* RESET PASSWORD POPUP */
function ResetPasswordModal({ onClose }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const API = import.meta.env.VITE_API_URL;

    const handleReset = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${API}/auth/reset-password`,
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage("Password updated successfully!");
            setTimeout(onClose, 1200);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error updating password");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] md:w-[400px] rounded-xl shadow-xl p-6 border-2 border-[#0070b9]">

                <h2 className="text-2xl font-bold text-[#0070b9] text-center mb-4">Reset Password</h2>

                {message && <p className="text-red-500 text-center mb-3">{message}</p>}

                <p className="label">Current Password</p>
                <input
                    type="password"
                    className="input-box mb-4"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <p className="label">New Password</p>
                <input
                    type="password"
                    className="input-box mb-6"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button onClick={handleReset} className="blue-btn px-6">Update</button>
                </div>
            </div>
        </div>
    );
}
