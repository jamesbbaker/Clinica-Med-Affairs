import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex font-primary justify-center items-center w-screen h-screen">
      <Sidebar />
      <div className="w-4/5 h-full overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
