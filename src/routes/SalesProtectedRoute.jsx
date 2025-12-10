import { Navigate } from "react-router-dom";

// Function to check if sales profile is complete
const isSalesProfileComplete = (userData) => {
    if (!userData) return false;

    // Check all required fields for sales profile completion
    const requiredFields = {
        gender: userData.gender,
        dob: userData.dob,
        officeBranch: userData.officeBranch,
        profileImage: userData.profileImage
    };

    // All fields should not be empty/null/undefined
    return Object.values(requiredFields).every(field =>
        field !== undefined &&
        field !== null &&
        field !== "" &&
        field.trim() !== ""
    );
};

export default function SalesProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const loginTime = localStorage.getItem("loginTime");

    // Get user data from localStorage
    const userDataString = localStorage.getItem("userData");
    let userData = null;

    if (userDataString) {
        try {
            userData = JSON.parse(userDataString);
        } catch (error) {
            console.error("Error parsing userData:", error);
        }
    }

    // Check authentication
    if (!token || role?.toLowerCase() !== "sales") {
        return <Navigate to="/login" />;
    }

    // // Check session timeout (5 hours)
    // const fiveHours = 5 * 60 * 60 * 1000;
    // if (Date.now() - Number(loginTime) > fiveHours) {
    //     localStorage.clear();
    //     return <Navigate to="/login" />;
    // }

    const currentPath = window.location.pathname;
    const isProfilePage = currentPath === "/sales/profile";

    if (!isProfilePage && !isSalesProfileComplete(userData)) {
        // Redirect to profile page if profile is incomplete
        return <Navigate to="/sales/profile" />;
    }

    return children;
}