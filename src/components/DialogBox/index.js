import React from "react";
import PrimaryBtn from "../PrimaryBtn";

const DialogBox = ({ id, text, handleDelete, handleReject }) => {
  return (
    <div className="flex py-10 bg-white flex-col items-center justify-center gap-12">
      <div className="flex flex-col gap-2">
      {id && <div className="text-center text-lg w-full">{id}</div>}
      <div className="text-center font-semibold text-xl w-full">{text}</div>
      </div>
      <div className={"flex items-center gap-24 justify-between"}>
        
        <PrimaryBtn
          onClick={handleReject}
          className={"w-40 bg-white text-primary border border-primary"}
          text={"No"}
        />
        <PrimaryBtn
          onClick={handleDelete}
          className={"w-40 text-slate-50"}
          text={"Yes"}
        />
      </div>
    </div>
  );
};

export default DialogBox;
