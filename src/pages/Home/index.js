import React, { useContext, useState } from "react";
import ListItems from "../../components/ListItems";
import PrimaryBtn from "../../components/PrimaryBtn";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import InputForm from "../../components/InputForm";
import { useSelector } from "react-redux";
import {
  APP_ROUTES,
  APP_ROUTES_LABEL,
  sidebarRoutes,
} from "../../constants/appConstants.js";
import {
  AiOutlineFundProjectionScreen,
  AiOutlineGlobal,
  AiOutlineProject,
  AiOutlineQuestionCircle,
  AiOutlineRise,
  AiOutlineTable,
} from "react-icons/ai";
import { GiTriangleTarget } from "react-icons/gi";
import { AuthContext } from "../../context/AuthContext/index.js";

const NavigationMenu = [
  {
    name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
    icon: () => <AiOutlineGlobal />,
    color: "#800080",
    description: "Prioritize key areas of unmet need for Medical intervention",
  },
  {
    name: APP_ROUTES_LABEL.eligible_patient_locator,
    id: APP_ROUTES.eligible_patient_locator,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
    icon: () => <AiOutlineTable />,
    description: "Clinical profiles for top HCPs by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.target_lists,
    id: APP_ROUTES.target_lists,
    color: "#0000FF",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.target_lists}`,
    icon: () => <GiTriangleTarget />,
    description: "Your selected HCPs, hospitals / systems, and plans",
  },
  {
    name: APP_ROUTES_LABEL.patient_journey,
    id: APP_ROUTES.patient_journey,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
    icon: () => <AiOutlineRise />,
    color: "#c4c4c4",
    description: "Gain a deeper understanding of asthma care patterns",
  },
  {
    name: APP_ROUTES_LABEL.priority_engagement_opportunity_page,
    id: APP_ROUTES.priority_engagement_opportunity_page,
    color: "#800080",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.priority_engagement_opportunity_page}`,
    icon: () => <AiOutlineGlobal />,
    description:
      "Explore unmet need by HCP, hospital / clinic / system, and payer / plan to identify priority target",
  },

  {
    name: APP_ROUTES_LABEL.institutional_variation,
    id: APP_ROUTES.institutional_variation,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.institutional_variation}`,
    icon: () => <AiOutlineProject />,
    description:
      "Clinical profiles for top hospitals, clinics, IDNs, and systems by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.impact_tracking,
    id: APP_ROUTES.impact_tracking,
    color: "#0000FF",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
    icon: () => <AiOutlineFundProjectionScreen />,
    description:
      "Measure changes in patient care and the impact of initiatives",
  },
  {
    name: APP_ROUTES_LABEL.help,
    id: APP_ROUTES.help,
    route: APP_ROUTES.help,
    color: "#c4c4c4",
    icon: () => <AiOutlineQuestionCircle />,
    description: "Learn about the app or contact support",
  },
  {
    name: null,
  },
  {
    name: APP_ROUTES_LABEL.payer_variation,
    id: APP_ROUTES.payer_variation,
    color: "#FF6666",
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.payer_variation}`,
    icon: () => <AiOutlineProject />,
    description:
      "Clinical profiles for top plans and payers by priority unmet needs",
  },
  {
    name: null,
  },
  {
    name: APP_ROUTES_LABEL.testing,
    id: APP_ROUTES.testing,
    route: APP_ROUTES.testing,
    color: "#c4c4c4",
    icon: () => <AiOutlineQuestionCircle />,
    description: "Page for testing new features.",
  },
  {
    name: APP_ROUTES_LABEL.settings,
    id: APP_ROUTES.settings,
    route: APP_ROUTES.settings,
    color: "#c4c4c4",
    icon: () => <AiOutlineQuestionCircle />,
    description: "Adjust Settings for Medical AI Suite",
  },
];

const colorDescriptions = [
  {
    color: "#800080",
    description: "Prioritize unmet needs and refine engagement strategy",
  },
  {
    color: "#FF6666",
    description:
      "Explore care profiles ranked by priority unmet need opportunity",
  },
  {
    color: "#0000FF",
    description: "View saved lists and track patient impact of initiatives",
  },
  {
    color: "#c4c4c4",
    description: "Additional asthma insights and general support information",
  },
];

const Home = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const { user } = useContext(AuthContext);
  const { currentMenu } = useSelector((state) => state.menu);
  const items = useSelector((state) => state.admin.users);

  return (
    <div>
      <h2 className="font-[500] mb-6 text-lg md:text-2xl">Medical AI Suite Home</h2>
      {currentMenu === sidebarRoutes.USERS ? (
        <>
          <Popup
            onClose={closeModal}
            modal
            open={open}
            closeOnDocumentClick
            position="center center"
          >
            <InputForm handleClose={closeModal} />
          </Popup>
          <PrimaryBtn
            className={"w-40 absolute mt-4 z-10 top-16 right-6 text-slate-50"}
            onClick={() => setOpen((o) => !o)}
            text={"+ Add User"}
          />
          <ListItems items={items} />
        </>
      ) : (
        <>
          <div className="grid mb-8 min-w-[700px] overflow-x-auto gap-[1rem] grid-cols-4">
            {colorDescriptions.map((item) => {
              return (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex md:h-[4rem] h-[7rem] justify-center w-full my-4 px-4 items-center gap-3">
                    <div
                      style={{
                        background: item.color,
                      }}
                      className={`w-8 h-8 rounded-sm`}
                    ></div>
                    <p className="md:text-sm text-xs text-center">{item.description}</p>
                  </div>
                  {NavigationMenu
                  .filter(
                    (_item) =>
                      _item.color === item.color
                    //  &&
                    //   user.page_view &&
                    //   user.page_view.includes(_item.id)
                  )
                  .map((item) => {
                    return item.name ? (
                      <div
                        key={item.id}
                        style={{
                          borderColor: item.color,
                        }}
                        onClick={() => (window.location.href = item.route)}
                        className={`px-2 w-full md:h-[12rem] h-[15rem] border-[4px] hover:scale-105 gap-1 font-[600] md:text-lg text-md transition-all ease-in-out duration-200 shadow-md cursor-pointer rounded bg-slate-200 py-14 grid place-content-center text-center`}
                      >
                        {item.name}
                        <div className="md:text-sm text-xs font-[400]">
                          {item.description}
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
