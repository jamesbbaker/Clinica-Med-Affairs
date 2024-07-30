import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

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

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition bg-white duration-300 ease-in-out ${
        !top ? " backdrop-blur-sm shadow-2xl" : ""
      }`}
    >
      <div className="max-w-[75%] mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4 flex items-center gap-2">
            <img
              onClick={handleHome}
              src={logo}
              alt="logo"
              className="w-[6rem] md:w-[150px] cursor-pointer  object-contain"
            />
            <p className="hidden md:block">AI & RWD for better patient care</p>
          </div>

          {/* Desktop navigation */}
          <nav className="md:flex md:grow">
            {/* Desktop sign in divs */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <div
                  onClick={() => handleNavigate("/contactus")}
                  className="cursor-pointer font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Solutions
                </div>
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
