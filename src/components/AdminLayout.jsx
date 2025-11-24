import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const SIDEBAR_WIDTH = 260; // px
  const HEADER_HEIGHT = 60;  // px

  return (
    <div className="bg-gray-100 min-h-screen w-full">

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full bg-white border-r shadow-sm"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <AdminSidebar />
      </div>

      {/* Header */}
      <div
        className="fixed top-0 right-0 left-0 bg-white border-b shadow-sm"
        style={{ height: HEADER_HEIGHT, marginLeft: SIDEBAR_WIDTH }}
      >
        <AdminHeader />
      </div>

      {/* MAIN CONTENT — Now Visible & Scrollable */}
      <main
        className="p-6 overflow-y-auto"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          paddingTop: HEADER_HEIGHT + 20,
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
