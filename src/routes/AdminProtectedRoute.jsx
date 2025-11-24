import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role?.toLowerCase() !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return children;
}
