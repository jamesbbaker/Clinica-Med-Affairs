import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import Logo from "../../assets/images/logo.png";

const Header = () => {
  const { logOut, user } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);
  const { currentMenuLabel } = useSelector((state) => state.menu);


  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white shadow-md">
      <div className="w-full h-14 px-6 py-4 flex justify-between items-center">
        <span>
          <Link href="/" className="app__logo">
            <img
              src={Logo}
              alt="Clinica AI"
              className="w-full"
            />
          </Link>
        </span>
        <span className="flex items-center gap-2">
          <div className="capitalize text-xs">
            <span>Welcome,</span> <span className="font-semibold">{user && user.name && user.name.split(" ")[0]}</span>
          </div>
          <div
            onClick={toggleDialog}
            className="w-6  h-6 text-slate-50 cursor-pointer hover:scale-110  shadow-box-2 transition-scale duration-200 ease-in-out bg-primary rounded-full grid place-content-center"
          >
            {user && user.name && user.name.split(" ")[0].charAt(0).toUpperCase()}
          </div>
          {openDialog && (
            <>
              <div
                onClick={toggleDialog}
                className="fixed z-20 left-0 right-0 top-0 bottom-0"
              ></div>
              <div className="absolute right-6 top-10 bg-slate-50 z-20  flex flex-col gap-2 py-2 border border-primary rounded-sm border-opacity-50">
                <div
                  onClick={logOut}
                  className="hover:bg-slate-200 px-4 cursor-pointer"
                >
                  Sign Out
                </div>
              </div>
            </>
          )}
        </span>
      </div>
      {/* <div className="bg-white border-t-2 border-opacity-50">
        <div className="px-4  text-sm py-2 opacity-70 font-medium">
          {currentMenuLabel}
        </div>
      </div> */}
    </header>
  );
};

export default Header;
