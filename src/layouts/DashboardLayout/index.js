import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";

import Header from "../../components/Header";

import "./index.css";

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
    <div id="app__layout" className="grid overflow-x-hidden overflow-y-scroll font-primary justify-center items-center w-screen h-screen relative">
      {/* <Sidebar />
      <div className="w-4/5 h-screen overflow-scroll md:overflow-hidden mh-screen">
        <div className="fixed w-4/5 z-20">
        <TopBar />
        </div>
        <div className="px-4 min-w-[800px] h-screen md:py-6 overflow-y-auto mt-32">
          <div className=" md:overflow-hidden">
          <Outlet />
          </div>
        </div>
      </div> */}
      <Header />
      <div className="page__content pt-8 pb-16 px-8"><Outlet /></div>
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;
