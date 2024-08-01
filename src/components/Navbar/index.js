import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { CiMenuBurger } from "react-icons/ci";


const Navbar = () => {
  const navigate = useNavigate();

  const [top, setTop] = useState(true);

  const handleNavigate = (route) => {
    navigate(route);
  };

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  const handleHome = () => {
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/auth");
    return;
  };

  const [showList, setShowList] = useState(false)
  const handleShowNav = () => {
    console.log("first")
  }

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition bg-white duration-300 ease-in-out ${
        !top ? " backdrop-blur-sm shadow-2xl" : ""
      }`}
    >
      <div className="custom:max-w-[90%] max-w-[95%] mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4 flex items-center gap-2">
            <img
              onClick={handleHome}
              src={logo}
              alt="logo"
              className="w-[6rem] md:w-[150px] cursor-pointer  object-contain"
            />
            <p className="hidden custom:block">AI & RWD for better patient care</p>
          </div>

          {/* Desktop navigation */}
          <nav className="md:flex md:grow hidden ">
            {/* Desktop sign in divs */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li onMouseOver={() => setShowList(true)} onMouseLeave={() => setShowList(false)} className="relative">
                <div
                
                  className="cursor-pointer font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Solutions
                </div>
                {showList &&<li  className="absolute text-[0.85rem] gap-2 bg-slate-200 text-center top-10 left-0">
                  <ul   onClick={() => handleNavigate("/medicalAffairs")} className="hover:bg-slate-100 px-2 py-2 text-gray-600 cursor-pointer font-[500]">Medical Affairs</ul>
                  <ul   onClick={() => handleNavigate("/rnd")} className="hover:bg-slate-100 px-2 py-2 text-gray-600 cursor-pointer font-[500]">R&D</ul>
                  <ul   onClick={() => handleNavigate("/nonprofit")} className="hover:bg-slate-100 px-2 py-2 text-gray-600 cursor-pointer font-[500]">Non-Profits</ul>
                </li>}
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/about")}
                  className="cursor-pointer font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  About
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/contactus")}
                  className="cursor-pointer font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Research
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/contactus")}
                  className="cursor-pointer font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Contact
                </div>
              </li>
              <li>
                <div
                  onClick={handleSignIn}
                  className="cursor-pointer btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3"
                >
                  <span>{"Sign in"}</span>
                  <svg
                    className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </div>
              </li>
            </ul>
          </nav>
          <div onClick={handleShowNav} className="flex md:hidden">
            <CiMenuBurger />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
