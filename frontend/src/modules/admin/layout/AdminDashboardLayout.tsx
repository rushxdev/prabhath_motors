import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar username="Admin User" />
      <main className="flex-1">
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
};

export default AdminLayout;
