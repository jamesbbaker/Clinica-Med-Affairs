import React, { useContext, useEffect } from "react";
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
    <div id="app__layout" className="grid md:overflow-x-hidden overflow-x-auto overflow-y-scroll font-primary justify-center items-center w-screen h-screen relative">
      <Header />
      <div className="page__content md:relative absolute pt-[5rem] md:pt-8 md:px-8 pl-[6rem] pb-16 px-8"><Outlet /></div>
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;
