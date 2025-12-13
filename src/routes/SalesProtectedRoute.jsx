import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "../utils/api";

export default function SalesProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const isImpersonating = localStorage.getItem("isImpersonating") === "true";
    const [isLoading, setIsLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {
        const checkProfileFromServer = async () => {
            // If impersonating, skip profile check
            if (isImpersonating) {
                setProfileComplete(true);
                setIsLoading(false);
                return;
            }

            if (!token || role?.toLowerCase() !== "sales") {
                setIsLoading(false);
                return;
            }

            try {
                const res = await authAPI.profile();
                const userData = res.data.user;
                localStorage.setItem("userData", JSON.stringify(userData));
                const complete = userData.profileCompleted || false;
                setProfileComplete(complete);
                localStorage.setItem("salesProfileComplete", complete ? "true" : "false");
            } catch (error) {
                console.error("Error checking profile:", error);
                const storedComplete = localStorage.getItem("salesProfileComplete");
                if (storedComplete === "true") {
                    setProfileComplete(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkProfileFromServer();
    }, [token, role, isImpersonating]);

    // Check authentication - allow if either:
    // 1. Regular sales user OR
    // 2. Admin impersonating a sales user
    if (!token || (role?.toLowerCase() !== "sales" && !isImpersonating)) {
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

    // If impersonating, skip profile completion check
    if (!isImpersonating && !isProfilePage && !profileComplete) {
        return <Navigate to="/sales/profile" replace />;
    }

    return children;
}