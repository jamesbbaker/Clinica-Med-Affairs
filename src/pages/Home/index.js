import React from "react";
import ListItems from "../../components/ListItems";
import { PrimaryBtn } from "../../components/PrimaryBtn";
import { users } from "./userList";

const Home = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <PrimaryBtn className="self-end" text={"Add User"} />
      </div>
      <ListItems list={users} />
    </>
  );
};

export default Home;
