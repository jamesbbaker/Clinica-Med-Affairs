import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className="flex fixed top-0 left-0 right-0 z-10 items-center bg-primary text-slate-50 justify-between px-12 py-4">
      <div className="text-md font-semibold">Clinica AI</div>
      <div className="flex items-center gap-8 ">
        <div onClick={() => navigate("/auth")} className="text-md relative before:absolute before:-bottom-2 before:left-0 hover:before:scale-100 before:transition-all duration-300 ease-in-out before:scale-0 before:w-full before:bg-slate-50 before:h-0.5 cursor-pointer">
          Login
        </div>
        <div onClick={() => navigate("/about")} className="text-md relative before:absolute before:-bottom-2 before:left-0 hover:before:scale-100 before:transition-all duration-300 ease-in-out before:scale-0 before:w-full before:bg-slate-50 before:h-0.5 cursor-pointer">
          About
        </div>
      </div>
    </div>
  );
};

export default Navbar;
