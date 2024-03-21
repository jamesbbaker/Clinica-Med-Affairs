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
    <div className="px-4 py-6">
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
    </div>
  );
};

export default Home;
