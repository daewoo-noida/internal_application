import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import ImpersonationBanner from "../components/ImpersonationBanner";

export default function MainLayout({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  // If admin → don't show header/footer
  const isAdmin = isAuthenticated && userRole === "admin";

  return (
    <div className="main-layout">

      {/* Show header only if NOT admin */}
      {!isAdmin && <Header />}
      <ImpersonationBanner />
      <main>{children}</main>

      {/* Show footer only if NOT admin */}
      {!isAdmin && <Footer />}
    </div>
  );
}
