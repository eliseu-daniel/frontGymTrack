import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <div className="min-h-screen w-full flex bg-sf-page">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div
        className={[
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-[220px]" : "ml-0",
        ].join(" ")}
      >
        <Topbar />
        <main className="px-10 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}