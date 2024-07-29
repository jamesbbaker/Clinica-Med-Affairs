import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenu } from "../../features/menu/menuSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  AiOutlineTeam,
  AiOutlineHome,
  AiOutlineTable,
  AiOutlineGlobal,
  AiOutlineFundProjectionScreen,
  AiOutlineRise,
  AiOutlineProject,
  AiOutlineQuestionCircle,
  AiOutlineDotChart,
} from "react-icons/ai";
import { GiTriangleTarget } from "react-icons/gi";
import { APP_ROUTES, APP_ROUTES_LABEL } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { MdOutlineLocalHospital } from "react-icons/md";

export const menuList = [
  {
    name: "dashboard",
    label: "",
    children: [
      {
        name: APP_ROUTES_LABEL.users,
        id: APP_ROUTES.users,
        route: "/dashboard",
        icon: () => <AiOutlineTeam />,
      },
      {
        name: APP_ROUTES_LABEL.home,
        id: "home",
        route: "/dashboard",
        icon: () => <AiOutlineHome />,
      },
    ],
  },
  {
    name: "outputs",
    label: "",
    children: [
      {
        name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
        id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
        color: "#800080",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
        icon: () => <AiOutlineGlobal color={"#800080"} />,
      },
      {
        name: APP_ROUTES_LABEL.priority_engagement_opportunity_page,
        id: APP_ROUTES.priority_engagement_opportunity_page,
        color: "#800080",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.priority_engagement_opportunity_page}`,
        icon: () => <AiOutlineDotChart color={"#800080"} />,
      },
      {
        name: APP_ROUTES_LABEL.eligible_patient_locator,
        id: APP_ROUTES.eligible_patient_locator,
        color: "#FF6666",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
        icon: () => <AiOutlineTable color="#FF6666" />,
      },
      {
        name: APP_ROUTES_LABEL.institutional_variation,
        id: APP_ROUTES.institutional_variation,
        color: "#FF6666",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.institutional_variation}`,
        icon: () => <MdOutlineLocalHospital color="#FF6666" />,
      },
      {
        name: APP_ROUTES_LABEL.payer_variation,
        id: APP_ROUTES.payer_variation,
        color: "#FF6666",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.payer_variation}`,
        icon: () => <AiOutlineProject color="#FF6666" />,
      },

      {
        name: APP_ROUTES_LABEL.target_lists,
        id: APP_ROUTES.target_lists,
        color: "#0000FF",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.target_lists}`,
        icon: () => <GiTriangleTarget color="#0000FF" />,
      },
      {
        name: APP_ROUTES_LABEL.impact_tracking,
        id: APP_ROUTES.impact_tracking,
        color: "#0000FF",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
        icon: () => <AiOutlineFundProjectionScreen color="#0000FF" />,
      },
      {
        name: APP_ROUTES_LABEL.patient_journey,
        id: APP_ROUTES.patient_journey,
        color: "#c4c4c4",
        route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
        icon: () => <AiOutlineRise color="#c4c4c4" />,
      },
      // {
      //   name: APP_ROUTES_LABEL.data_quality,
      //   id: APP_ROUTES.data_quality,
      //   route: `${APP_ROUTES.outputs}/${APP_ROUTES.data_quality}`,
      //   icon: () => <AiOutlineBarChart />,
      // },
      // {
      //   name: APP_ROUTES_LABEL.unmet_need_definition,
      //   id: APP_ROUTES.unmet_need_definition,
      //   route: `${APP_ROUTES.outputs}/${APP_ROUTES.unmet_need_definition}`,
      //   icon: () => <AiOutlineInfo />,
      // },
      {
        name: APP_ROUTES_LABEL.help,
        id: APP_ROUTES.help,
        route: APP_ROUTES.help,
        color: "#c4c4c4",
        icon: () => <AiOutlineQuestionCircle color="#c4c4c4" />,
      },
      {
        name: APP_ROUTES_LABEL.testing,
        id: APP_ROUTES.testing,
        route: APP_ROUTES.testing,
        color: "#c4c4c4",
        icon: () => <AiOutlineQuestionCircle color="#c4c4c4" />,
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

  useEffect(() => {
    if (user && !id) {
      dispatch(
        updateMenu({
          currentMenu: user.admin ? "users" : "home",
          currentMenuLabel: user.admin ? "Users" : "Home",
        })
      );
    }
  }, [user]);

  return (
    <aside className="md:w-full w-[5rem] z-50 min-w-[5rem] bg-primary fixed left-0 top-0  md:sticky overflow-y-auto">
      <div className="flex flex-col py-4">
        {user &&
          menuList.map((item, index) => (
            <div
              key={`menu-item-${index}`}
              className={`flex text-left flex-col justify-center items-center`}
            >
              {item.label && (
                <div
                  style={{ fontSize: "0.6rem" }}
                  className={`text-slate-50 hidden md:block mt-3 px-4 py-2 w-full text-left`}
                >
                  {item.label}
                </div>
              )}
              {item.children && (
                <div className="flex pl-4  justify-center px-2 flex-col items-center w-full">
                  {item.children.map((subItem, index) => {
                    // if (
                    //   item.name === "outputs" &&
                    //   user.page_view &&
                    //   // subItem.id !== APP_ROUTES.hcp_insights &&
                    //   // subItem.id !== APP_ROUTES.medical_affair_toolbox &&
                    //   // subItem.id !== APP_ROUTES.payer_variation &&
                    //   // subItem.id !== APP_ROUTES.help &&
                    //   // subItem.id !== APP_ROUTES.testing &&
                    //   // subItem.id !==
                    //   //   APP_ROUTES.priority_engagement_opportunity_page &&
                    //   // subItem.id !== APP_ROUTES.target_lists &&
                    //   !user.page_view.includes(subItem.id)
                    // ) {
                    //   return false;
                    // }
                    if (
                      item.name === "dashboard" &&
                      subItem.id === APP_ROUTES.users &&
                      !user.admin
                    ) {
                      return false;
                    }
                    return (
                      <div
                        key={`menu-subitem-${index}`}
                        style={{
                          fontSize: "0.75rem",
                          marginTop:
                            subItem.id === APP_ROUTES.patient_journey ||
                            subItem.id === APP_ROUTES.target_lists ||
                            subItem.id === APP_ROUTES.eligible_patient_locator ||
                            subItem.id ===
                              APP_ROUTES.patient_opportunity_mapping_and_strategy
                              ? "0.75rem"
                              : 0,
                        }}
                        onClick={() => handleClick(subItem)}
                        className={`${
                          currentMenu !== subItem.id && "text-slate-50"
                        } ${
                          currentMenu === subItem.id
                            ? "bg-slate-50"
                            : "hover:bg-slate-200 hover:bg-opacity-40 "
                        } flex cursor-pointer relative rounded-md transition-all ease-in-out duration-200 justify-center custom:justify-between px-2 py-2 font-semibold items-center gap-2  w-full text-left`}
                      >
                        <div className="w-full md:w-auto grid place-content-center">
                          <subItem.icon color={item.color} />
                        </div>
                        {(subItem.id === APP_ROUTES.patient_journey ||
                          subItem.id === APP_ROUTES.target_lists ||
                          subItem.id === APP_ROUTES.eligible_patient_locator ||
                          subItem.id ===
                            APP_ROUTES.patient_opportunity_mapping_and_strategy) && (
                          <div className="absolute rounded-[20px] left-0 h-[0.25rem] w-[100%] -top-[0.5rem] bg-[#c4c4c4]"></div>
                        )}
                        <div className="w-full hidden custom:block">
                          {subItem.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
