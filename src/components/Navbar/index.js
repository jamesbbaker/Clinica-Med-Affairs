import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import darkLogo from "../../assets/images/logoDark.svg";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import Popup from "reactjs-popup";
import ContactUs from "../../pages/ContactUs";

const Navbar = ({ darkMode = false }) => {
  const navigate = useNavigate();

  const [top, setTop] = useState(true);
  const [dark, setDarkMode] = useState(darkMode);

  const handleNavigate = (route) => {
    navigate(route);
  };

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
    if (darkMode) {
      window.pageYOffset + 100 > window.innerHeight
        ? setDarkMode(false)
        : setDarkMode(true);
    }
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

  const [showList, setShowList] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [contact, setContact] = useState(false);
  const handleShowNav = () => {
    setShowNav(true);
  };

  const closeContact = () => {
    setContact(false);
  };

  return (
    <header
      className={`fixed w-full z-30  transition ${
        dark ? "bg-transparent opacity-100" : "bg-white md:bg-opacity-90 "
      } duration-300 ease-in-out ${!top ? " md:backdrop-blur-sm backdrop-blur-none shadow-2xl" : ""}`}
    >
      <Popup
        onClose={closeContact}
        modal
        open={contact}
        className="rounded-xl"
        position="center center"
      >
        <ContactUs closeContact={closeContact} />
      </Popup>
      <div className="custom:max-w-[90%] max-w-[95%] mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4 flex items-center gap-2">
            <img
              onClick={handleHome}
              src={dark ? darkLogo : logo}
              alt="logo"
              className="w-[10rem] md:w-[200px] bg-transparent cursor-pointer  object-contain"
            />
            <p
              className={`hidden custom:block ${
                dark ? "text-[#fff]" : "text-[#000]"
              } `}
            >
              AI & RWD for better patient care
            </p>
          </div>

          {/* Desktop navigation */}
          <nav className="md:flex md:grow hidden ">
            {/* Desktop sign in divs */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li
                onMouseOver={() => setShowList(true)}
                onMouseLeave={() => setShowList(false)}
                className="relative"
              >
                <div
                  className={`cursor-pointer  font-medium ${
                    dark
                      ? "text-gray-200 before:bg-[#fff]"
                      : "text-black before:bg-[#000] hover:text-gray-900"
                  } px-5 py-3 flex items-center before:left-0 before:w-0 before:h-[0.15rem] hover:before:w-full before:absolute relative before:bottom-2 before:transition-all before:ease-in-out text-xl hover:font-[700] before:duration-200 transition duration-150 ease-in-out`}
                >
                  Solutions
                </div>
                {showList && (
                  <li className="absolute  text-[0.85rem] gap-2 bg-slate-200 w-[12rem] text-center top-12 left-0">
                    <ul
                      onClick={() => handleNavigate("/rnd")}
                      className="hover:bg-slate-100 px-2 py-2 text-xl hover:font-[700] text-black cursor-pointer font-[500]  before:left-0 before:w-0 before:h-[0.15rem] hover:before:w-full before:bg-[#000] before:absolute relative before:bottom-0 before:transition-all before:ease-in-out before:duration-200 transition duration-150 ease-in-out"
                    >
                      R&D
                    </ul>
                    <ul
                      onClick={() => handleNavigate("/medicalAffairs")}
                      className="hover:bg-slate-100 px-2 text-xl hover:font-[700]  before:left-0 before:w-0 before:h-[0.15rem] hover:before:w-full before:bg-[#000] before:absolute relative before:bottom-0 before:transition-all before:ease-in-out before:duration-200 transition duration-150 ease-in-out py-2 text-black cursor-pointer font-[500]"
                    >
                      Medical Affairs
                    </ul>

                    {/* <ul
                      onClick={() => handleNavigate("/nonprofit")}
                      className="hover:bg-slate-100 px-2 py-2 text-black cursor-pointer font-[500]"
                    >
                      Non-Profits
                    </ul> */}
                  </li>
                )}
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/about")}
                  className={`cursor-pointer before:left-0 text-xl hover:font-[700] before:w-0 before:h-[0.15rem] hover:before:w-full before:absolute relative before:bottom-2 before:transition-all before:ease-in-out before:duration-200  font-medium ${
                    dark
                      ? "text-gray-200 before:bg-[#fff]"
                      : "text-black before:bg-[#000] hover:text-gray-900"
                  } px-5 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  About
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/research")}
                  className={`cursor-pointer before:left-0 text-xl hover:font-[700] before:w-0 before:h-[0.15rem] hover:before:w-full before:absolute relative before:bottom-2 before:transition-all before:ease-in-out before:duration-200 font-medium ${
                    dark
                      ? "text-gray-200 before:bg-[#fff]"
                      : "text-black before:bg-[#000] hover:text-gray-900"
                  } px-5 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  Research
                </div>
              </li>
              <li>
                <div
                  onClick={() => setContact(true)}
                  className={`cursor-pointer text-xl hover:font-[700] before:left-0 before:w-0 before:h-[0.15rem] hover:before:w-full before:absolute relative before:bottom-2 before:transition-all before:ease-in-out before:duration-200 font-medium ${
                    dark
                      ? "text-gray-200 before:bg-[#fff]"
                      : "text-black before:bg-[#000] hover:text-gray-900"
                  } px-5 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  Contact
                </div>
              </li>
              <li>
                <div
                  onClick={handleSignIn}
                  className={` ${
                    dark
                      ? "text-[#000] bg-[#fff]  hover:bg-gray-200"
                      : "text-[#fff] bg-[#000] hover:bg-gray-800"
                  } cursor-pointer text-xl hover:font-[700] btn-sm  ml-3`}
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
            <CiMenuBurger color={dark ? "#fff" : "#000"} />
          </div>
          {showNav && (
            <div
              onClick={() => setShowNav(false)}
              className="fixed z-[100] top-2 right-2"
            >
              <IoCloseCircle size={40} color={dark ? "#fff" : "#000"} />
            </div>
          )}
        </div>
      </div>
      {showNav && (
        <div className="fixed bg-[#c4c4c4] left-0 right-0 top-0 bottom-0">
          <div className="flex justify-center w-full h-full  items-center flex-col md:hidden  ">
            {/* Desktop sign in divs */}
            <ul className="items-center text-center">
              <li
                onMouseOver={() => setShowList(true)}
                onMouseLeave={() => setShowList(false)}
                className="relative"
              >
                <div
                  className={`cursor-pointer font-medium  text-gray-[#000] text-center hover:text-gray-900 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  Solutions
                </div>
                {showList && (
                  <li className="absolute text-[0.85rem] gap-2 bg-slate-200 text-center top-10 left-0">
                    <ul
                      onClick={() => handleNavigate("/medicalAffairs")}
                      className="hover:bg-slate-100 px-2 py-2 text-black cursor-pointer font-[500]"
                    >
                      Medical Affairs
                    </ul>
                    <ul
                      onClick={() => handleNavigate("/rnd")}
                      className="hover:bg-slate-100 px-2 py-2 text-black cursor-pointer font-[500]"
                    >
                      R&D
                    </ul>
                    {/* <ul
                      onClick={() => handleNavigate("/nonprofit")}
                      className="hover:bg-slate-100 px-2 py-2 text-black cursor-pointer font-[500]"
                    >
                      Non-Profits
                    </ul> */}
                  </li>
                )}
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/about")}
                  className={`cursor-pointer font-medium  text-gray-[#000] text-center hover:text-gray-900 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  About
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/contactus")}
                  className={`cursor-pointer font-medium  text-gray-[#000] text-center hover:text-gray-900 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  Research
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigate("/contactus")}
                  className={`cursor-pointer font-medium text-gray-[#000] text-center  hover:text-gray-905 py-3 flex items-center transition duration-150 ease-in-out`}
                >
                  Contact
                </div>
              </li>
              <li>
                <div
                  onClick={handleSignIn}
                  className={`cursor-pointer btn-sm mt-4 md:mt-0 text-gray-200 bg-gray-900 hover:bg-gray-800 `}
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
