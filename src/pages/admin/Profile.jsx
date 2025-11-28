import React, { useEffect, useState } from "react";
import { authAPI } from "../../utils/api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.profile();
        setUser(res.data.user);

        console.log(res.data.user)
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);



  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <div className="text-center py-10">No user found</div>;

  return (
    <div className="w-full flex justify-center py-10 bg-gray-100">
      <div className="w-[90%] md:w-[70%] bg-white shadow-xl rounded-2xl p-8 border-4 border-[#0070b9]">

        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-[#0070b9]">User Profile</h1>
        </div>

        <div className="text-center mt-4">
          <p className="text-lg text-gray-600">Employee ID</p>
          <div className="flex justify-center items-center gap-2 bg-[#0070b9] text-white rounded-full w-48 py-2 mx-auto mt-2">
            <i className="fa fa-user"></i>
            <span className="font-semibold">{user?.employeeId}</span>
          </div>
        </div>

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

      {showResetModal && (
        <ResetPasswordModal onClose={() => setShowResetModal(false)} />
      )}
    </div>
  );
}
