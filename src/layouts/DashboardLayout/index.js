import React from "react";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <div className="w-4/5">{children}</div>
    </div>
  );
};

export default DashboardLayout;
