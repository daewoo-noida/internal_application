import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email + signupToken (needed to send real password in email)
    const queryEmail = new URLSearchParams(location.search).get("email");
    const queryToken = new URLSearchParams(location.search).get("signupToken");

    const storedEmail = localStorage.getItem("verifyEmail");
    const storedToken = localStorage.getItem("signupToken");

    const email = queryEmail || storedEmail;
    const signupToken = queryToken || storedToken;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // For verify button
    const [resendLoading, setResendLoading] = useState(false); // For resend button
    const [resendMessage, setResendMessage] = useState("");

    // Redirect if no email or no signupToken
    useEffect(() => {
        if (!email || !signupToken) {
            navigate("/signup");
        } else {
            // Save for refresh safety
            localStorage.setItem("verifyEmail", email);
            localStorage.setItem("signupToken", signupToken);
        }
    }, [email, signupToken, navigate]);

    // ---------------- OTP INPUT HANDLING ----------------
    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // ---------------- VERIFY OTP ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");
        setResendMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: otpValue,
                    signupToken, // IMPORTANT for sending real password email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("verifyEmail");
                localStorage.removeItem("signupToken");
                navigate("/login");
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- RESEND OTP ----------------
    const resendOtp = async () => {
        setResendLoading(true);
        setError("");
        setResendMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                setResendMessage("A new OTP has been sent to your email.");
            } else {
                setError(data.message || "Could not resend OTP.");
            }
        } catch {
            setError("Server error");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl border">

                <h2 className="text-2xl font-bold text-center mb-3">Email Verification</h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to<br />
                    <strong>{email}</strong>
                </p>

                {/* OTP INPUT */}
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-xl border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
                    {resendMessage && <p className="text-green-600 text-sm text-center mb-3">{resendMessage}</p>}

                    {/* VERIFY BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-400"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                {/* RESEND */}
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
