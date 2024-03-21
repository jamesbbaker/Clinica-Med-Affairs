import React, { useState } from "react";
import ListItems from "../../components/ListItems";
import { users } from "./usersList";
import PrimaryBtn from "../../components/PrimaryBtn";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import InputForm from "../../components/InputForm";
import { useSelector } from "react-redux";

const Home = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const items = useSelector((state) => state.admin.users);

  return (
    <div className="px-8 py-4 h-full">
      <div className="flex w-full shadow-md px-8 py-4 justify-between rounded-2xl items-center">
        <div className="font-semibold">Dashboard</div>
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
    </div>
  );
};

export default Home;
