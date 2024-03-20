import React from "react";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  return (
    <div className="w-1/5 h-full bg-primary">
      <img src={logo} alt="logo" className="w-1/2 mx-auto mt-4" />
      <div className="flex flex-col mt-8">
        <div className="flex justify-center items-center gap-2 bg-slate-50 py-2">
          <svg
            class="feather feather-users"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div>USERS</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
