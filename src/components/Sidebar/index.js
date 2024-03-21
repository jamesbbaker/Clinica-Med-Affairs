import React from "react";
import logo from "../../assets/images/logo.png";

const sidebarRoutes = [
  {
    name: "Users",
    active: true,
    logo: () => {
      return (
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
      );
    },
  },
  {
    name: "Users",
    active: false,
    logo: () => {
      return (
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
      );
    },
  },
];

const Sidebar = () => {
  return (
    <div className="w-full h-full  rounded-xl bg-primary">
      <div className=" w-full h-22  rounded-tr-xl rounded-tl-xl  shadow-slate-400 shadow border py-2 border-primary bg-slate-50">
        <img src={logo} alt="logo" className="w-1/2 mx-auto " />
      </div>
      <div className="flex flex-col mt-8">
        {sidebarRoutes.map((route) => (
          <div
            className={`flex cursor-pointer justify-left  px-4 mx-8 rounded-full border-2 border-primary items-start gap-2 ${
              route.active && "bg-slate-50"
            } ${route.active ? "text-black" : "text-slate-50"}  py-2`}
          >
            <route.logo />
            <div className="font-medium">{route.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
