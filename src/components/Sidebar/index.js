import React from "react";
import logo from "../../assets/images/logo.png";

const sidebarOptions = [
  {
    name: "Users",
    id: "users",
    icon: () => {
      return (
        <>
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
        </>
      );
    },
  },
];

const Sidebar = () => {
  return (
    <div className="w-1/5 bg-primary text-primary">
      <div className="shadow-2xl left-0 top-0 flex h-16 w-full items-center justify-center border-b-2 border-white">
        <img
          src={logo}
          className={"w-48  rounded-full bg-slate-50 object-contain px-10"}
          alt="logo"
        />
      </div>

      <div className="flex flex-row  items-start gap-4 ">
        {sidebarOptions.map((option) => (
          <div className="font-meduum text-l flex w-full cursor-pointer items-center gap-2 bg-slate-50 px-10 py-2">
            <option.icon />
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
