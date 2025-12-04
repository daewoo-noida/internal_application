import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// Sales Pages
import SalesIndex from "./pages/sales/Index.jsx";
import SalesDashboard from "./pages/sales/Dashboard.jsx";
import SalesLogin from "./pages/sales/Login.jsx";
import BookNow from "./pages/sales/booknow/BookNow.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLogin from "./pages/admin/Login.jsx";

// Protected Routes
import SalesProtectedRoute from "./routes/SalesProtectedRoute.jsx";
import AdminProtectedRoute from "./routes/AdminProtectedRoute.jsx";
import SignupPage from "./task/SignupPage.jsx";
import Contact_Us from "./pages/sales/Contact_Us.jsx";
import Downloads from "./pages/sales/Downloads.jsx";
import SalesmanDetails from "./pages/admin/SalesmanDetails.jsx";
import SalesTeam from "./pages/sales/SalesTeam.jsx";
import BookNowMultiStepForm from "./components/multistepform/BookNowMultiStepForm.jsx";
import Reimbursement from "./pages/sales/Reimbursement.jsx";
import UserProfile from "./pages/sales/Profile.jsx";
import VerifyOtp from "./components/VerifyOtp.jsx";
import PdfManager from "./pages/admin/PdfManager.jsx";
import ClientDetails from "./pages/admin/ClientDetails.jsx";
import SalesClientDetails from "./pages/sales/SalesClientDetails.jsx";
import EditClient from "./pages/admin/EditClient.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Wrapper for Sales Routes
const SalesLayout = () => (
  <SalesProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </SalesProtectedRoute>
);

// Wrapper for Admin Routes
const AdminLayouts = () => (
  <AdminProtectedRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminProtectedRoute>
);

export default function App() {

  // ✅ AUTO LOGOUT (MUST BE INSIDE APP FUNCTION!)
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      const token = localStorage.getItem("authToken");

      if (token && loginTime) {
        const fiveHours = 5 * 60 * 60 * 1000;

        if (Date.now() - Number(loginTime) > fiveHours) {
          // Clear user session
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          localStorage.removeItem("userRole");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("loginTime");

          window.location.href = "/login";
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Sales Pages */}
        <Route path="/login" element={<MainLayout><SalesLogin /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Protected Sales Routes */}
        <Route element={<SalesLayout />}>
          <Route path="/" element={<SalesIndex />} />
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/addclients" element={<BookNowMultiStepForm />} />
          <Route path="/sales/contact" element={<Contact_Us />} />
          <Route path="/sales/download" element={<Downloads />} />
          <Route path="/sales/booknow" element={<BookNow />} />
          <Route path="/sales/reimbursement" element={<Reimbursement />} />
          <Route path="/sales/profile" element={<UserProfile />} />
          <Route path="/sales/client/:id" element={<SalesClientDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayouts />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/salesmen" element={<SalesTeam />} />
          <Route path="/admin/salesman/:id" element={<SalesmanDetails />} />
          <Route path="/admin/pdf-manager" element={<PdfManager />} />
          <Route path="/admin/client/:id" element={<ClientDetails />} />
          <Route path="/admin/client/edit/:id" element={<EditClient />} />
        </Route>

      </Routes>
    </>
  );
}
