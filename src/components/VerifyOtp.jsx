import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = new URLSearchParams(location.search).get("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // only digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpValue }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/login");
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setResendLoading(true);
        setResendMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendMessage("A new OTP has been sent to your email.");
            } else {
                setError(data.message || "Could not resend OTP.");
            }
        } catch (err) {
            setError("Server error");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl border">

                <h2 className="text-2xl font-bold text-center mb-3">
                    Email Verification
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to <br />
                    <strong>{email}</strong>
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                {resendMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                        {resendMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="
                  w-12 h-12 
                  text-center text-xl 
                  border rounded-lg 
                  shadow-sm 
                  focus:ring-2 focus:ring-blue-500
                "
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-400"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Didn’t receive the code?{" "}
                    <button
                        disabled={resendLoading}
                        onClick={resendOtp}
                        className="font-semibold text-black underline"
                    >
                        {resendLoading ? "Resending..." : "Resend OTP"}
                    </button>
                </p>
            </div>
        </div>
    );
}
