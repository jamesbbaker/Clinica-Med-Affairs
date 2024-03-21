import React from "react";
import PrimaryBtn from "../PrimaryBtn";

const DialogBox = ({ id, text, handleDelete, handleReject }) => {
  return (
    <div className="flex py-10 bg-slate-50 flex-col items-center justify-center gap-12">
      <div className="text-center text-xl w-full">{text}</div>
      <div className={"flex items-center gap-24 justify-between"}>
        <PrimaryBtn
          onClick={handleDelete}
          className={"w-40 bg-white text-primary border border-primary"}
          text={"Yes"}
        />
        <PrimaryBtn
          onClick={handleReject}
          className={"w-40 text-slate-50"}
          text={"No"}
        />
      </div>
    </div>
  );
};

export default DialogBox;
