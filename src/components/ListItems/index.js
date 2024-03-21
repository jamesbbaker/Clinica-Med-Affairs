import React, { useState } from "react";
import Popup from "reactjs-popup";
import DialogBox from "../DialogBox";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../features/admin/adminSlice";

const ListItems = ({ items }) => {
  const [itemId, setItemId] = useState(null);
  const closeModal = () => setItemId(null);
  const dispatch = useDispatch();

  const handleAffirm = () => {
    dispatch(deleteUser(itemId));
    closeModal();
  };

  return (
    <div className="flex flex-wrap items-center gap-10 mt-8">
      <Popup
        onClose={closeModal}
        modal
        open={itemId != null}
        position="center center"
      >
        <DialogBox
          handleAffirm={handleAffirm}
          handleReject={closeModal}
          text={"Do you want to delete this user?"}
        />
      </Popup>
      {items.map((item, index) => (
        <div
          className={`relative w-1/4 opacity-0 shadow-box animate-fade-in rounded-lg hover:bg-slate-300 transition-all linear cursor-pointer flex flex-col gap-2 px-4 py-6`}
        >
          <div>
            Name: <span className="font-medium">{item.email}</span>
          </div>
          <div>
            Code: <span className="font-medium">{item.code}</span>
          </div>
          <svg
            onClick={() => setItemId(item.id)}
            className="absolute bottom-2 hover:stroke-black right-2 w-4 h-4 object-contain cursor-pointer hover:scale-105 transition-all"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default ListItems;
