import React, { useState } from "react";
import ListItems from "../../components/ListItems";
import PrimaryBtn from "../../components/PrimaryBtn";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import InputForm from "../../components/InputForm";
import { useSelector } from "react-redux";
import RealTimeBox from "../../components/RealTimeBox";
import HCPTable from "../../components/HCPTable";
import { APP_ROUTES, APP_ROUTES_LABEL, sidebarRoutes } from "../../constants/appConstants.js";
import { AiOutlineFundProjectionScreen, AiOutlineGlobal, AiOutlineProject, AiOutlineQuestionCircle, AiOutlineRise, AiOutlineTable } from "react-icons/ai";

const NavigationMenu = [
  {
    name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
    icon: () => <AiOutlineGlobal />,
    description: "Prioritize key areas of unmet need for Medical intervention",
  },
  {
    name: APP_ROUTES_LABEL.eligible_patient_locator,
    id: APP_ROUTES.eligible_patient_locator,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
    icon: () => <AiOutlineTable />,
    description: "Deep clinical profiles for top HCPs by priority unmet needs",
  },
  {
    name: APP_ROUTES_LABEL.institutional_variation,
    id: APP_ROUTES.institutional_variation,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.institutional_variation}`,
    icon: () => <AiOutlineProject />,
    description: "Deep clinical profiles for top hospitals, clinics, IDNs, and systems by priority unmet needs"
  },
  {
    name: APP_ROUTES_LABEL.payer_variation,
    id: APP_ROUTES.payer_variation,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.payer_variation}`,
    icon: () => <AiOutlineProject />,
    description: "Deep clinical profiles for top plans and payers by priority unmet needs"
  },
  {
    name: APP_ROUTES_LABEL.impact_tracking,
    id: APP_ROUTES.impact_tracking,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
    icon: () => <AiOutlineFundProjectionScreen/>,
    description: "Measure changes in patient care and the impact of initiatives",
  },
  {
    name: APP_ROUTES_LABEL.patient_journey,
    id: APP_ROUTES.patient_journey,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
    icon: () => <AiOutlineRise />,
    description: "Gain a deeper understanding of asthma care patterns",
  },
  {
    name: APP_ROUTES_LABEL.help,
    id: APP_ROUTES.help,
    route: APP_ROUTES.help,
    icon: () => <AiOutlineQuestionCircle />,
    description: "Learn about the app or contact support"
  },
]

const Home = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const { currentMenu } = useSelector((state) => state.menu);
  const items = useSelector((state) => state.admin.users);

  return (
    <div>
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
        <div className="grid mb-8 gap-[0.5rem] grid-cols-4">
          {NavigationMenu.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => window.location.href = item.route}
                className={`px-2 hover:shadow-lg gap-1 font-[600] transition-all ease-in-out duration-200 shadow-md cursor-pointer rounded bg-slate-200 py-4 grid place-content-center text-center`}
              >
                {item.name}
                <div className="text-xs font-[400]">{item.description}</div>
              </div>
            )
          })}
        </div>
          <RealTimeBox />
          <HCPTable />
        </>
      )}
    </div>
  );
};

export default Home;
