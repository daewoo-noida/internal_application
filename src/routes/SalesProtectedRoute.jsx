import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "../utils/api";

export default function SalesProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const [isLoading, setIsLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {
        const checkProfileFromServer = async () => {
            if (!token || role?.toLowerCase() !== "sales") {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch fresh user data from server
                const res = await authAPI.profile();
                const userData = res.data.user;

                // Store user data in localStorage
                localStorage.setItem("userData", JSON.stringify(userData));

                // ✅ Check profile completion from server field
                const complete = userData.profileCompleted || false;
                setProfileComplete(complete);

                // Store completion status
                localStorage.setItem("salesProfileComplete", complete ? "true" : "false");

            } catch (error) {
                console.error("Error checking profile:", error);

                // Fallback to localStorage check
                const storedComplete = localStorage.getItem("salesProfileComplete");
                if (storedComplete === "true") {
                    setProfileComplete(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkProfileFromServer();
    }, [token, role]);

    // Check authentication
    if (!token || role?.toLowerCase() !== "sales") {
        return <Navigate to="/login" />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const currentPath = window.location.pathname;
    const isProfilePage = currentPath === "/sales/profile";

    // If profile is not complete and we're not on profile page, redirect
    if (!isProfilePage && !profileComplete) {
        return <Navigate to="/sales/profile" replace />;
    }

    return children;
}