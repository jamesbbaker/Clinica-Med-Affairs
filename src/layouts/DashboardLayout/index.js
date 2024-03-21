import React from "react";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-1/5 h-full p-2">
        <Sidebar />
      </div>
      <div className="w-4/5 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
