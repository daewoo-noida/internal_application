import React, { useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        designationOther: "",
        emailName: "",
        emailDomain: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const finalEmail = `${formData.emailName}${formData.emailDomain}`;

    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // ---------------- SEND OTP ----------------
    const handleSendOtp = async () => {
        setError("");

        // PHONE VALIDATION
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            return setError("Phone number must be exactly 10 digits.");
        }

        // PASSWORD VALIDATION
        const password = formData.password;

        if (password.length < 6) {
            return setError("Password must be at least 6 characters long.");
        }

        if (!/[A-Z]/.test(password)) {
            return setError("Password must contain at least one uppercase letter.");
        }

        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
            return setError("Password must contain at least one special character.");
        }

        const allowedDomains = ["@theebg.com", "@daewooappliances.in", "@ebikego.in"];
        if (!allowedDomains.some((domain) => finalEmail.endsWith(domain))) {
            return setError(`Email must be one of: ${allowedDomains.join(", ")}`);
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    email: finalEmail,
                    designation:
                        formData.designation === "others"
                            ? formData.designationOther
                            : formData.designation,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpStep(true);
                setResendTimer(30);
                startTimer();
            } else {
                setError(data.message);
            }

        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    };


    // ---------------- VERIFY OTP ----------------
    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) return setError("Please enter a valid OTP");

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: finalEmail, otp: enteredOtp }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account Verified Successfully!");
                navigate("/login");
            } else {
                setError(data.message);
            }

        } catch {
            setError("Server error.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- RESEND OTP ----------------
    const handleResendOtp = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: finalEmail }),
            });

            const data = await response.json();
            if (response.ok) {
                setOtp(["", "", "", "", "", ""]);
                setResendTimer(30);
                startTimer();
            } else {
                setError(data.message);
            }
        } catch {
            setError("Server error.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- TIMER ----------------
    const startTimer = () => {
        let sec = 30;
        const interval = setInterval(() => {
            sec--;
            setResendTimer(sec);
            if (sec === 0) clearInterval(interval);
        }, 1000);
    };

    // ---------------- OTP INPUT ----------------
    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    // Background Image
    const backgroundStyle = {
        backgroundImage: `url(/images/Signup_Banner.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "5rem",
        paddingLeft: "2rem",
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                style={backgroundStyle}
                className="w-full flex justify-center lg:justify-end px-4 sm:px-10 lg:pr-20 bg-login"
            >
                <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-6 sm:p-8">

                    {/* LOGO */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="/images/logo.png"
                            alt="App Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Sign up to get started
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* SIGNUP FORM (before OTP) */}
                    {!otpStep && (
                        <form className="space-y-4">

                            {/* Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>

                            {/* Designation */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Designation</label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            designation: e.target.value,
                                            designationOther: "",
                                        })
                                    }
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                >
                                    <option value="">Select designation</option>
                                    <option value="bda">BDA</option>
                                    <option value="bde">BDE</option>
                                    <option value="bdm">BDM</option>
                                    <option value="operations">Operations</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            {/* Other Designation */}
                            {formData.designation === "others" && (
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Specify Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designationOther}
                                        onChange={(e) =>
                                            setFormData({ ...formData, designationOther: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Email</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="username"
                                        className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        value={formData.emailName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, emailName: e.target.value })
                                        }
                                        required
                                    />
                                    <select
                                        className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        value={formData.emailDomain}
                                        onChange={(e) =>
                                            setFormData({ ...formData, emailDomain: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Domain</option>
                                        <option value="@theebg.com">@theebg.com</option>
                                        <option value="@daewooappliances.in">@daewooappliances.in</option>
                                        <option value="@ebikego.in">@ebikego.in</option>
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                                <input
                                    type="text"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        if (/^[0-9]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, phone: e.target.value });
                                        }
                                    }}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* SEND OTP */}
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>

                        </form>
                    )}

                    {/* OTP SCREEN */}
                    {otpStep && (
                        <div className="mt-4 text-center">

                            <p className="text-gray-600 mb-4">
                                Enter OTP sent to<br />
                                <strong>{finalEmail}</strong>
                            </p>

                            <div className="flex justify-center gap-2 mb-4">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        value={digit}
                                        maxLength="1"
                                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                                        className="w-12 h-12 border rounded text-center text-xl font-semibold"
                                    />
                                ))}
                            </div>

                            <div className="flex justify-between mt-3">
                                <button
                                    disabled={resendTimer > 0}
                                    onClick={handleResendOtp}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
                                </button>
                                <button
                                    onClick={handleVerifyOtp}
                                    className="px-6 py-2 bg-black text-white rounded-lg font-semibold"
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Login instead */}
                    <p className="text-center mt-4 text-gray-700">
                        Already have an account?
                        <button onClick={() => navigate("/login")} className="font-semibold underline ml-1">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default SignupPage;
