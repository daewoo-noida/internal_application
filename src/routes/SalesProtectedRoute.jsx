import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function SalesProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("isAuthenticated") === "true";
        const role = localStorage.getItem("userRole");
        if (auth && role === "Sales") {
            setAllowed(true);
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;
    return allowed ? children : <Navigate to="/login" replace />;
}
