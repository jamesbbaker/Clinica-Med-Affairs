import React, { useContext, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMenu } from "../../features/menu/menuSlice";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineTable } from "react-icons/ai";
import { AiOutlineGlobal } from "react-icons/ai";
import { AiOutlineBarChart } from "react-icons/ai";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { AiOutlineRise } from "react-icons/ai";
import { AiOutlineProject } from "react-icons/ai";
import { APP_ROUTES, APP_ROUTES_LABEL } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";

export const menuList = [
  {
    name: "root",
    label: "",
    children: [
      {
        name: APP_ROUTES_LABEL.users,
        id: APP_ROUTES.users,
        route: "/",
        icon: () => <AiOutlineTeam />,
      },
      {
        name: APP_ROUTES_LABEL.home,
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
        name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
        id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
        icon: () => <AiOutlineGlobal />,
      },
      {
        name: APP_ROUTES_LABEL.hcp_segmentation,
        id: APP_ROUTES.hcp_segmentation,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.hcp_segmentation}`,
        icon: () => <AiOutlineBarChart />,
      },
      {
        name: APP_ROUTES_LABEL.eligible_patient_locator,
        id: APP_ROUTES.eligible_patient_locator,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
        icon: () => <AiOutlineTable />,
      },
      {
        name: APP_ROUTES_LABEL.insitutional_variation,
        id: APP_ROUTES.insitutional_variation,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.insitutional_variation}`,
        icon: () => <AiOutlineProject />,
      },
      {
        name: APP_ROUTES_LABEL.patient_journey,
        id: APP_ROUTES.patient_journey,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
        icon: () => <AiOutlineRise />,
      },
      {
        name: APP_ROUTES_LABEL.impact_tracking,
        id: APP_ROUTES.impact_tracking,
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
        icon: () => <AiOutlineFundProjectionScreen />,
      },
    ],
  },
];

const Sidebar = () => {
  const { currentMenu } = useSelector((state) => state.menu);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClick = (item) => {
    navigate(item.route, {
      replace: true,
    });
    dispatch(
      updateMenu({
        currentMenu: item.id,
        currentMenuLabel: APP_ROUTES_LABEL[item.id],
      })
    );
  };

  useEffect(() => {
    if (id) {
      dispatch(
        updateMenu({
          currentMenu: id,
          currentMenuLabel: APP_ROUTES_LABEL[id],
        })
      );
    }
  }, []);

  console.log(user);

  return (
    <div className="w-1/5 h-full bg-primary">
      <div className="w-full border h-14 grid place-content-center border-primary bg-slate-50 py-2">
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
      </div>
      <div className="flex flex-col mt-8">
        {user &&
          menuList.map((item) => (
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
                <div className="flex pl-4  justify-center px-2 flex-col items-center w-full">
                  {item.children.map((subItem) => {
                    if (
                      item.name === "outputs" &&
                      user.page_view &&
                      !user.page_view.includes(subItem.id)
                    ) {
                      return;
                    }
                    if (
                      item.name === "root" &&
                      subItem.id === APP_ROUTES.users &&
                      !user.admin
                    ) {
                      return;
                    }
                    return (
                      <div
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => handleClick(subItem)}
                        className={`${
                          currentMenu !== subItem.id && "text-slate-50"
                        } ${
                          currentMenu == subItem.id
                            ? "bg-slate-50"
                            : "hover:bg-slate-200 hover:bg-opacity-40 "
                        } flex cursor-pointer rounded-md transition-all ease-in-out duration-200 px-2 py-2 font-semibold items-center gap-2  w-full text-left`}
                      >
                        <subItem.icon />
                        <div className="w-full">{subItem.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
