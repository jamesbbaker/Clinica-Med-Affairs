import React from "react";
import PrimaryBtn from "../PrimaryBtn";

const DialogBox = ({ text, handleAffirm, handleReject }) => {
  return (
    <div className="flex py-10 bg-slate-50 flex-col items-center justify-center gap-12">
      <div className="text-center text-xl w-full">{text}</div>
      <div className={"flex items-center gap-24 justify-between"}>
        <PrimaryBtn
          onClick={handleAffirm}
          className={"w-40 bg-white border text-primary border-primary"}
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
