import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function useAutoLogout() {
    const navigate = useNavigate();

    useEffect(() => {
        let lastActivityTime = Date.now();

        // Function to update last activity time
        const updateActivity = () => {
            lastActivityTime = Date.now();
            localStorage.setItem("lastActivityTime", lastActivityTime.toString());
        };

        // Add event listeners for user activity
        const events = ["click", "keypress", "mousemove", "scroll", "touchstart"];
        events.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        const checkInactivity = () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const storedActivityTime = localStorage.getItem("lastActivityTime") || Date.now();
            const now = Date.now();
            const THIRTY_MIN = 30 * 60 * 1000;

            // Check if 30 minutes have passed since last activity
            if (now - Number(storedActivityTime) > THIRTY_MIN) {
                // Clear all auth data
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("userRole");
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("loginTime");
                localStorage.removeItem("lastActivityTime");

                alert("You have been logged out due to inactivity.");

                navigate("/login");
            }
        };

        // Initialize last activity time if not set
        if (!localStorage.getItem("lastActivityTime")) {
            localStorage.setItem("lastActivityTime", Date.now().toString());
        }

        // Check every 30 seconds
        const interval = setInterval(checkInactivity, 30000);

        // Cleanup
        return () => {
            clearInterval(interval);
            events.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
        };
    }, [navigate]);
}