import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailName: "",
    emailDomain: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- HANDLE LOGIN ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setError({});
    setLoading(true);

    const finalEmail = `${formData.emailName}${formData.emailDomain}`;

    // Basic validation
    if (!formData.emailName) {
      setError({ email: "Please enter email username." });
      setLoading(false);
      return;
    }
    if (!formData.emailDomain) {
      setError({ email: "Please select an email domain." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginTime", Date.now());

        navigate("/");
      } else {
        setGeneralError(data.message || "Invalid email or password.");
      }
    } catch {
      setGeneralError("Network error. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  // AUTO-REDIRECT IF LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token && role?.toLowerCase() === "sales") {
      navigate("/");
    } else if (token && role?.toLowerCase() === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const backGroundImage = {
    backgroundImage: `url(/images/Login_Banner.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
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
        style={backGroundImage}
        className="w-full flex justify-center lg:justify-end px-4 sm:px-10 lg:pr-20 bg-login"
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border p-8">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="App Logo" className="h-10" />
          </div>

          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to continue</p>
          </div>

          {/* GENERAL ERROR */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {generalError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL SPLIT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <div className="flex gap-2">
                {/* EMAIL NAME */}
                <input
                  type="text"
                  name="emailName"
                  placeholder="username"
                  value={formData.emailName}
                  onChange={(e) =>
                    setFormData({ ...formData, emailName: e.target.value })
                  }
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                {/* EMAIL DOMAIN */}
                <select
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, emailDomain: e.target.value })
                  }
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Domain</option>
                  <option value="@theebg.com">@theebg.com</option>
                  <option value="@daewooappliances.in">@daewooappliances.in</option>
                  <option value="@ebikego.in">@ebikego.in</option>
                  <option value="@franchiseworld.com">@franchiseworld.com</option>
                  <option value="@kustard.in">@kustard.in</option>
                </select>
              </div>

              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
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

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="text-center mt-4 text-gray-700">
            Don’t have an account?
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold underline ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
