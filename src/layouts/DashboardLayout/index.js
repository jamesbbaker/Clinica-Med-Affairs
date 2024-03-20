import React from "react";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Sidebar />
      <div className="w-4/5 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
