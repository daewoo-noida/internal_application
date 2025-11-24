import React from "react";
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
import AddClient from "./pages/sales/booknow/BookNowForm.jsx";
import SalesmanDetails from "./pages/admin/SalesmanDetails.jsx";
import SalesTeam from "./pages/sales/SalesTeam.jsx";

// Wrapper for Sales Routes
const SalesLayout = () => (
  <SalesProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </SalesProtectedRoute>
);


const AdminLayouts = () => (
  <AdminProtectedRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminProtectedRoute>
);



export default function App() {
  return (
    <Routes>
      {/* Public Sales Pages */}
      <Route path="/login" element={<MainLayout><SalesLogin /></MainLayout>} />
      <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />

      {/* Protected Sales Routes */}
      <Route element={<SalesLayout />}>
        <Route path="/" element={<SalesIndex />} />
        <Route path="/sales/dashboard" element={<SalesDashboard />} />
        <Route path="/sales/addclients" element={<AddClient />} />
        <Route path="/sales/contact" element={<Contact_Us />} />
        <Route path="/sales/download" element={<Downloads />} />
        <Route path="/sales/booknow" element={<BookNow />} />
      </Route>

      {/* Admin Routes */}

      {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

      <Route element={<AdminLayouts />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/salesmen" element={<SalesTeam />} />
        <Route path="/admin/salesman/:id" element={<SalesmanDetails />} />
      </Route>

    </Routes>
  );
}
