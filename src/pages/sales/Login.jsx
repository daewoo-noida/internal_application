import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const API_URL = import.meta.env.VITE_API_URL;



  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),

      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("isAuthenticated", "true");

        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token && role?.toLowerCase() === "sales") {
      navigate("/");
    }
    else if (token && role?.toLowerCase() === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const backGroundImage = {
    backgroundImage: `url(/images/Login_Banner.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: '5rem',
    paddingLeft: '2rem',
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        style={backGroundImage}
        className="w-full flex justify-center lg:justify-end px-4 sm:px-10 lg:pr-20 bg-login"
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-6 sm:p-8 ">

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to your account to continue
            </p>
          </div>


          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Don’t have an account?
            <button onClick={() => navigate("/signup")} className="font-semibold underline ml-1">
              Sign Up
            </button>
          </p>

        </div>
      </div>
    </div>
  );

}
