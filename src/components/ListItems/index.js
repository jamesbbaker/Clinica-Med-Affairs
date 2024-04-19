import React, { useState } from "react";
import Popup from "reactjs-popup";
import DialogBox from "../DialogBox";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../features/admin/adminSlice";
import Table from "../Table";
import { USERS_TABLE_COLUMNS } from "../../constants/appConstants";

const ListItems = ({ items }) => {
  const [itemId, setItemId] = useState(null);
  const closeModal = () => setItemId(null);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser(itemId));
    closeModal();
  };

  return (
    <div className="flex flex-col w-full flex-wrap gap-2 ">
      <Popup
        onClose={closeModal}
        modal
        open={itemId != null}
        position="center center"
      >
        <DialogBox
        id={itemId}
          handleDelete={handleDelete}
          handleReject={closeModal}
          text={"Do you want to delete this user?"}
        />
      </Popup>
      <Table
      setItemId={setItemId}
        TableData={items}
        TableColummns={USERS_TABLE_COLUMNS}
        UserTable={true}
      />
    </div>
  );
};

export default ListItems;
