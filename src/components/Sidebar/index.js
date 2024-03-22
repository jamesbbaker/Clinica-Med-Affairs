import React, { useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMenu } from "../../features/menu/menuSlice";
import {
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";

const menuList = [
  {
    name: "Users",
    id: "users",
  },
  {
    name: "Home",
    id: "home",
  },
  {
    name: "Outputs",
    id: "outputs",
    children: [
      {
        name: "Patient Opportunity Mapping and Strategy",
        id: "patient_opportunity_mapping_and_strategy",
        menuId: "outputs",
      },
      {
        name: "Eligible Patient Locator",
        id: "ligible_patient_locator",
        menuId: "outputs",
      },
      {
        name: "HCP Profiles",
        id: "hcp_profiles",
        menuId: "outputs",
      },
      {
        name: "Leading Indicators",
        id: "lead_indicators",
        menuId: "outputs",
      },
    ],
  },
];

const Sidebar = () => {
  const { currentMenu, subMenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (location.pathname == "/output") {
      dispatch(
        updateMenu({
          currentMenu: "outputs",
          subMenu: "patient_opportunity_mapping_and_strategy",
        })
      );
    }
  }, [location]);

  const handleClick = (item, isSubMenu) => {
    let route = isSubMenu || item.id == "outputs" ? "output" : "";
    navigate(`/${route}`, {
      replace: true,
    });
    dispatch(
      updateMenu({
        currentMenu: isSubMenu ? item.menuId : item.id,
        subMenu: isSubMenu ? item.id : item.children ? item.children[0].id : "",
      })
    );
  };

  return (
    <div className="w-1/5 h-full bg-primary border border-primary">
      <div className="w-full bg-slate-50 py-2">
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
      </div>
      <div className="flex flex-col mt-8">
        {menuList.map((item) => (
          <div
            className={`flex cursor-pointer text-left flex-col justify-center items-center`}
          >
            <div
              onClick={() => handleClick(item)}
              className={` ${currentMenu !== item.id && "text-slate-50 "} ${
                currentMenu == item.id && "bg-slate-50"
              } px-4 py-2 w-full text-left`}
            >
              {item.name}
            </div>
            {item.children && (
              <div className="flex bg-pri justify-center flex-col items-center gap-2 w-full">
                {item.children.map((subItem) => (
                  <div
                    onClick={() => handleClick(subItem, true)}
                    className={`${subMenu !== subItem.id && "text-slate-50"} ${
                      subMenu == subItem.id && "bg-slate-50"
                    } py-1 flex items-center gap-1 text-sm w-full text-left`}
                  >
                    <div className="w-6 h-6 object-contain">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414z"
                          className="fill-primary"
                          data-name="Right"
                        />
                      </svg>
                    </div>
                    <div className="w-3/4">{subItem.name}</div>
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
