import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || role?.toLowerCase() !== "admin") {
        return <Navigate to="/login" />;
    }

    const fiveHours = 5 * 60 * 60 * 1000;

    if (Date.now() - Number(loginTime) > fiveHours) {
        localStorage.clear();
        return <Navigate to="/login" />;
    }

    return children;
}
