import React, { useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMenu } from "../../features/menu/menuSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineTable } from "react-icons/ai";
import { AiOutlineGlobal } from "react-icons/ai";
import { AiOutlineIdcard } from "react-icons/ai";
import { AiOutlineBarChart } from "react-icons/ai";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { AiOutlineRise } from "react-icons/ai";
import { APP_ROUTES } from "../../constants/appConstants";

const menuList = [
  {
    name: "root",
    label: "",
    children: [
      {
        name: "Users",
        id: "users",
        route: "/",
        icon: () => <AiOutlineTeam />,
      },
      {
        name: "Home",
        id: "home",
        route: "/",
        icon: () => <AiOutlineHome />,
      },
    ],
  },
  {
    name: "outputs",
    label: "Outputs",
    children: [
      {
        name: "Patient Opportunity Mapping and Strategy",
        id: "patient_opportunity_mapping_and_strategy",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
        icon: () => <AiOutlineGlobal />,
      },
      {
        name: "HCP Segmentation",
        id: "hcp_segmentation",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.hcp_segmentation}`,
        icon: () => <AiOutlineBarChart />,
      },
      {
        name: "Eligible Patient Locator",
        id: "eligible_patient_locator",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
        icon: () => <AiOutlineTable />,
      },
      {
        name: "Patient Journey",
        id: "patient_journey",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
        icon: () => <AiOutlineRise />,
      },
      {
        name: "HCP Profiles",
        id: "hcp_profiles",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.hcp_profiles}`,
        icon: () => <AiOutlineIdcard />,
      },
      {
        name: "Leading Indicators",
        id: "lead_indicators",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.lead_indicators}`,
        icon: () => <AiOutlineFundProjectionScreen />,
      },
    ],
  },
];

const Sidebar = () => {
  const { currentMenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate(item.route, {
      replace: true,
    });
    dispatch(
      updateMenu({
        currentMenu: item.id,
      })
    );
  };

  return (
    <div className="w-1/5 h-full bg-primary">
      <div className="w-full border border-primary bg-slate-50 py-2">
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
      </div>
      <div className="flex flex-col mt-8">
        {menuList.map((item) => (
          <div
            className={`flex text-left flex-col justify-center items-center`}
          >
            {item.label && (
              <div
                style={{ fontSize: "0.6rem" }}
                className={`text-slate-50 mt-3 px-4 py-2 w-full text-left`}
              >
                {item.label}
              </div>
            )}
            {item.children && (
              <div className="flex pl-4 justify-center px-2 flex-col items-center w-full">
                {item.children.map((subItem) => (
                  <div
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => handleClick(subItem)}
                    className={`${
                      currentMenu !== subItem.id && "text-slate-50"
                    } ${
                      currentMenu == subItem.id
                        ? "bg-slate-50"
                        : "hover:bg-slate-200 hover:bg-opacity-40 "
                    } flex cursor-pointer transition-all ease-in-out duration-200 px-2 py-2 font-semibold items-center gap-2  w-full text-left`}
                  >
                    {subItem.icon()}
                    <div className="w-full">{subItem.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
