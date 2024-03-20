import React, { useState } from "react";
import ListItems from "../../components/ListItems";
import { users } from "./usersList";
import PrimaryBtn from "../../components/PrimaryBtn";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FormInput from "../../components/FormInput";

const Home = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div className="px-4 py-6">
      <div className="flex w-full justify-end">
        <PrimaryBtn
          className={"w-40"}
          onClick={() => setOpen((o) => !o)}
          text={"Add User"}
        />
        <Popup
          onClose={closeModal}
          modal
          open={open}
          closeOnDocumentClick
          position="center center"
        >
          <FormInput />
        </Popup>
      </div>
      <ListItems items={users} />
    </div>
  );
};

export default Home;
