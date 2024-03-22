import React, { useState } from "react";
import ListItems from "../../components/ListItems";
import PrimaryBtn from "../../components/PrimaryBtn";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import InputForm from "../../components/InputForm";
import { useSelector } from "react-redux";
import RealTimeBox from "../../components/RealTimeBox";
import HCPTable from "../../components/HCPTable";
import { HCP_DATA } from "./data.js";
import { sidebarRoutes } from "../../constants/appConstants.js";

const Home = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const { currentMenu, subMenu } = useSelector((state) => state.menu);
  const items = useSelector((state) => state.admin.users);

  return (
    <div className="px-4 py-6">
      {currentMenu == sidebarRoutes.USERS ? (
        <>
          <div className="flex w-full justify-end">
            <PrimaryBtn
              className={"w-40 text-slate-50"}
              onClick={() => setOpen((o) => !o)}
              text={"+ Add User"}
            />
            <Popup
              onClose={closeModal}
              modal
              open={open}
              closeOnDocumentClick
              position="center center"
            >
              <InputForm handleClose={closeModal} />
            </Popup>
          </div>
          <ListItems items={items} />
        </>
      ) : (
        <>
          <RealTimeBox />
          {/* <div className="grid grid-cols-2 gap-4 mt-4 w-full"> */}
          <HCPTable />;
        </>
      )}
    </div>
  );
};

export default Home;
