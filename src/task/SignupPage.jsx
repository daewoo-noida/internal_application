import React, { useState, useRef } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();
    const finalEmail = `${formData.emailName}${formData.emailDomain}`;

    // ---------------- SEND OTP ----------------
    const handleSendOtp = async () => {
        setErrors({});

        // Phone validation
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setErrors({ phone: "Phone number must be exactly 10 digits." });
            return;
        }

        // Password validation
        const pw = formData.password;

        if (pw.length < 6) {
            setErrors({ password: "Password must be at least 6 characters long." });
            return;
        }
        if (!/[A-Z]/.test(pw)) {
            setErrors({ password: "Must contain at least one uppercase letter." });
            return;
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) {
            setErrors({ password: "Must contain at least one special character." });
            return;
        }

        // Email validation
        const allowedDomains = ["@theebg.com", "@daewooappliances.in", "@ebikego.in", "@franchiseworld.com"];
        if (!allowedDomains.some((d) => finalEmail.endsWith(d))) {
            setErrors({ email: "Please select a valid company domain." });
            return;
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

                // ⭐ SAVE email + password until OTP verification
                localStorage.setItem("verifyEmail", finalEmail);
                localStorage.setItem("tempSignupPassword", formData.password);
            } else {
                setErrors({ general: data.message });
            }
        } catch {
            setErrors({ general: "Network error." });
        } finally {
            setLoading(false);
        }
    };

    // ---------------- VERIFY OTP ----------------
    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            setErrors({ otp: "Please enter 6-digit OTP." });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: finalEmail,
                    otp: enteredOtp,

                    // ⭐ SEND password to backend for welcome email
                    password: localStorage.getItem("tempSignupPassword"),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account verified successfully!");

                // ⭐ CLEAN temporary stored values
                localStorage.removeItem("verifyEmail");
                localStorage.removeItem("tempSignupPassword");

                navigate("/login");
            } else {
                setErrors({ otp: data.message });
            }
        } catch {
            setErrors({ otp: "Server error." });
        } finally {
            setLoading(false);
        }
    };

    // ---------------- RESEND OTP ----------------
    const handleResendOtp = async () => {
        try {
            await fetch(`${API_URL}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: finalEmail }),
            });

            setOtp(["", "", "", "", "", ""]);
            setResendTimer(30);
            startTimer();
        } catch {
            setErrors({ otp: "Failed to resend OTP." });
        }
    };

    // ---------------- TIMER ----------------
    const startTimer = () => {
        let sec = 30;
        const timer = setInterval(() => {
            sec--;
            setResendTimer(sec);
            if (sec === 0) clearInterval(timer);
        }, 1000);
    };

    // ---------------- OTP HANDLING ----------------
    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0)
            otpRefs.current[index - 1].focus();
    };

    // Background image
    const bgStyle = {
        backgroundImage: "url(/images/Signup_Banner.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div style={bgStyle} className="w-full flex justify-center lg:justify-end p-6 lg:pr-20">

                <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border p-8">

                    {/* LOGO */}
                    <div className="flex justify-center mb-4">
                        <img src="/images/logo.png" className="h-10" />
                    </div>

                    {/* TITLE */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-gray-600 text-sm mt-1">Sign up to continue</p>
                    </div>

                    {/* SIGNUP FORM */}
                    {!otpStep && (
                        <form className="space-y-4">

                            {/* NAME */}
                            <div>
                                <label className="font-medium">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                            </div>

                            {/* DESIGNATION */}
                            <div>
                                <label className="font-medium">Designation</label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            designation: e.target.value,
                                            designationOther: "",
                                        })
                                    }
                                    className="w-full px-4 py-3 border rounded-lg"
                                >
                                    <option value="">Select</option>
                                    <option value="bda">BDA</option>
                                    <option value="bde">BDE</option>
                                    <option value="bdm">BDM</option>
                                    <option value="bhead">Bussiness Head</option>
                                    <option value="operations">Operations</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            {/* OTHER DESIGNATION */}
                            {formData.designation === "others" && (
                                <div>
                                    <label className="font-medium">Specify Designation</label>
                                    <input
                                        type="text"
                                        value={formData.designationOther}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                designationOther: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>
                            )}

                            {/* EMAIL */}
                            <div>
                                <label className="font-medium">Email</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="username"
                                        value={formData.emailName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                emailName: e.target.value,
                                            })
                                        }
                                        className="w-1/2 px-4 py-3 border rounded-lg"
                                    />

                                    <select
                                        value={formData.emailDomain}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                emailDomain: e.target.value,
                                            })
                                        }
                                        className="w-1/2 px-4 py-3 border rounded-lg"
                                    >
                                        <option value="">Domain</option>
                                        <option value="@theebg.com">@theebg.com</option>
                                        <option value="@daewooappliances.in">@daewooappliances.in</option>
                                        <option value="@ebikego.in">@ebikego.in</option>
                                        <option value="@franchiseworld.com">@franchiseworld.com</option>
                                    </select>
                                </div>

                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* PHONE */}
                            <div>
                                <label className="font-medium">Phone</label>
                                <input
                                    type="text"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        if (/^[0-9]*$/.test(e.target.value)) {
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            });
                                        }
                                        setErrors({ ...errors, phone: "" });
                                    }}
                                    className="w-full px-4 py-3 border rounded-lg"
                                />

                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            });
                                            setErrors({ ...errors, password: "" });
                                        }}
                                        className="w-full px-4 py-3 pr-12 border rounded-lg"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* SEND OTP */}
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg mt-2"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>

                            {/* GENERAL ERROR */}
                            {errors.general && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg mt-3 text-sm flex gap-2 items-center">
                                    <AlertCircle size={16} />
                                    {errors.general}
                                </div>
                            )}
                        </form>
                    )}

                    {/* OTP STEP */}
                    {otpStep && (
                        <div className="mt-4 text-center">

                            <p className="text-gray-600 mb-4">
                                OTP sent to <strong>{finalEmail}</strong>
                            </p>

                            {/* OTP BOXES */}
                            <div className="flex justify-center gap-2 mb-2">
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (otpRefs.current[i] = el)}
                                        value={d}
                                        maxLength="1"
                                        onChange={(e) =>
                                            handleOtpChange(e.target.value, i)
                                        }
                                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                        className="w-12 h-12 border rounded-lg text-center text-xl font-semibold"
                                    />
                                ))}
                            </div>

                            {errors.otp && (
                                <p className="text-red-500 text-sm mb-3">{errors.otp}</p>
                            )}

                            <div className="flex justify-between mt-4">
                                <button
                                    disabled={resendTimer > 0}
                                    onClick={handleResendOtp}
                                    className="px-4 py-2 border rounded-lg text-sm"
                                >
                                    {resendTimer > 0
                                        ? `Resend (${resendTimer}s)`
                                        : "Resend OTP"}
                                </button>

                                <button
                                    onClick={handleVerifyOtp}
                                    className="px-6 py-2 bg-black text-white rounded-lg"
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LOGIN LINK */}
                    <p className="text-center mt-6">
                        Already have an account?
                        <button
                            onClick={() => navigate("/login")}
                            className="underline ml-1 font-semibold"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
