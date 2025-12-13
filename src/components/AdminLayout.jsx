import { useState, useEffect } from "react";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const SIDEBAR_WIDTH = 260; // px
  const HEADER_HEIGHT = 60; // px
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full relative">

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 left-0 h-full bg-white border-r shadow-sm z-40 transition-transform duration-300 ease-in-out
          ${isMobile
            ? (sidebarOpen ? "translate-x-0" : "-translate-x-full")
            : "translate-x-0"
          }`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <AdminSidebar />
      </div>

      {/* Header */}
      <div
        className="fixed bg-white border-b shadow-sm z-30"
        style={{
          height: HEADER_HEIGHT,
          top: 0,
          left: isMobile ? 0 : SIDEBAR_WIDTH,
          width: isMobile ? "100%" : `calc(100% - ${SIDEBAR_WIDTH}px)`,
          transition: "left 0.3s ease-in-out, width 0.3s ease-in-out"
        }}
      >
        <AdminHeader toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <main
        className="p-6 overflow-y-auto transition-all duration-300 ease-in-out"
        style={{
          paddingTop: HEADER_HEIGHT + 20,
          minHeight: "100vh",
          marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
          width: isMobile ? "100%" : `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        {children}
      </main>
    </div>
  );
}