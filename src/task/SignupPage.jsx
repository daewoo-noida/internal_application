import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        designationOther: "",
        email: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const allowedDomains = [
            "@theebg.com",
            "@daewooappliances.in",
            "@ebikego.in",
        ];

        const finalEmail = `${formData.emailName}${formData.emailDomain}`;

        const emailValid = allowedDomains.some(domain =>
            finalEmail.toLowerCase().endsWith(domain)
        );

        if (!emailValid) {
            setError(`Email must be one of: ${allowedDomains.join(", ")}`);
            setLoading(false);
            return;
        }

        const submitData = {
            ...formData,
            email: finalEmail,
            designation:
                formData.designation === "others"
                    ? formData.designationOther.trim()
                    : formData.designation,
        };

        if (formData.designation === "others" && !formData.designationOther.trim()) {
            setError("Please specify your designation");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful! Redirecting to login...");
                navigate("/");
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("Network error. Please check if backend is running.");
        } finally {
            setLoading(false);
        }
    };



    const backGroundImage = {
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
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50 "
            style={backGroundImage}
        >
            <div className="w-full max-w-md  rounded-xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6">Sign up to continue</p>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-2 flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">
                            Designation
                        </label>
                        <select
                            name="designation"
                            value={formData.designation}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    designation: e.target.value,
                                    designationOther: "",
                                })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">Select designation</option>
                            <option value="bda">BDA</option>
                            <option value="bde">BDE</option>
                            <option value="bdm">BDM</option>
                            <option value="operations">Operations</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    {formData.designation === "others" && (
                        <div className="mb-2">
                            <label className="block text-gray-700 font-medium mb-1">
                                Please specify your designation
                            </label>
                            <input
                                type="text"
                                value={formData.designationOther}
                                onChange={(e) =>
                                    setFormData({ ...formData, designationOther: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required={formData.designation === "others"}
                            />
                        </div>
                    )}

                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>

                        <div className="flex gap-2">
                            {/* LEFT: USERNAME PART */}
                            <input
                                type="text"
                                placeholder="Enter username (e.g. john)"
                                value={formData.emailName || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, emailName: e.target.value })
                                }
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />

                            {/* RIGHT: DOMAIN DROPDOWN */}
                            <select
                                value={formData.emailDomain || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, emailDomain: e.target.value })
                                }
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            >
                                <option value="">Select Domain</option>
                                <option value="@theebg.com">@theebg.com</option>
                                <option value="@daewooappliances.in">@daewooappliances.in</option>
                                <option value="@ebikego.in">@ebikego.in</option>
                            </select>
                        </div>
                    </div>


                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${error ? "border-red-300" : "border-gray-300"
                                    } shadow-sm`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-4 text-black">
                    Don’t have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="font-semibold underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
