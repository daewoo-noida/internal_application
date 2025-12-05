import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAutoLogout() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkExpiration = () => {
            const loginTime = localStorage.getItem("loginTime");
            const token = localStorage.getItem("authToken");

            if (!token || !loginTime) return;

            const now = Date.now();
            const THIRTY_MIN = 30 * 60 * 1000;

            if (now - Number(loginTime) > THIRTY_MIN) {
                // Logout User
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("userRole");
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("loginTime");

                alert("Your session expired. Please log in again.");

                navigate("/login");
            }
        };

        // Check every 30 seconds
        const interval = setInterval(checkExpiration, 30000);

        return () => clearInterval(interval);
    }, [navigate]);
}
