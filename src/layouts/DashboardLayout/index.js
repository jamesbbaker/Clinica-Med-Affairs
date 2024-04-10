import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";

import TopBar from "../../components/TopBar";

const DashboardLayout = () => {
  const { accessToken, refreshToken, fetchUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    } else {
    fetchUserData(accessToken, refreshToken);
    }
  }, []);

  return (
    <div className="flex font-primary justify-center items-center w-screen h-screen">
      <Sidebar />
      <div className="w-4/5 h-screen overflow-hidden mh-screen">
        <TopBar />
        <div className="px-4 h-screen py-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
