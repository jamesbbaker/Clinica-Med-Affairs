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
import { AiOutlineBarChart, AiOutlineDotChart, AiOutlineFundProjectionScreen, AiOutlineGlobal, AiOutlineInfo, AiOutlineProject, AiOutlineQuestionCircle, AiOutlineRise, AiOutlineTable } from "react-icons/ai";

const NavigationMenu = [
  {
    name: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_opportunity_mapping_and_strategy}`,
    icon: () => <AiOutlineGlobal />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.eligible_patient_locator,
    id: APP_ROUTES.eligible_patient_locator,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.eligible_patient_locator}`,
    icon: () => <AiOutlineTable />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.institutional_variation,
    id: APP_ROUTES.institutional_variation,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.institutional_variation}`,
    icon: () => <AiOutlineProject />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu."
  },
  {
    name: APP_ROUTES_LABEL.payer_variation,
    id: APP_ROUTES.payer_variation,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.payer_variation}`,
    icon: () => <AiOutlineProject />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu."
  },
  {
    name: APP_ROUTES_LABEL.medical_affair_toolbox,
    id: APP_ROUTES.medical_affair_toolbox,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.medical_affair_toolbox}`,
      icon: () => <AiOutlineDotChart />,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu."
  },
  {
    name: APP_ROUTES_LABEL.impact_tracking,
    id: APP_ROUTES.impact_tracking,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.impact_tracking}`,
    icon: () => <AiOutlineFundProjectionScreen/>,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.patient_journey,
    id: APP_ROUTES.patient_journey,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.patient_journey}`,
    icon: () => <AiOutlineRise />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.data_quality,
    id: APP_ROUTES.data_quality,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.data_quality}`,
    icon: () => <AiOutlineBarChart />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.unmet_need_definition,
    id: APP_ROUTES.unmet_need_definition,
    route: `${APP_ROUTES.outputs}/${APP_ROUTES.unmet_need_definition}`,
    icon: () => <AiOutlineInfo />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu.",
  },
  {
    name: APP_ROUTES_LABEL.help,
    id: APP_ROUTES.help,
    route: APP_ROUTES.help,
    icon: () => <AiOutlineQuestionCircle />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu."
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
