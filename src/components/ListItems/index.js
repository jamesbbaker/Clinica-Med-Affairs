import React, { useContext, useState } from "react";
import Popup from "reactjs-popup";
import DialogBox from "../DialogBox";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../features/admin/adminSlice";
import Table from "../Table";
import { USERS_TABLE_COLUMNS } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";

const ListItems = ({ items }) => {
  const [itemId, setItemId] = useState(null);
  const closeModal = () => setItemId(null);
  const dispatch = useDispatch();
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinica-server.replit.app/remove/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();
      if (res) {
        setLoading(false);
        dispatch(deleteUser(itemId));
        closeModal();
      }
    } catch (err) {
      console.log(err);
      throw new Error();
    }
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
          loading={loading}
          handleDelete={handleDelete}
          handleReject={closeModal}
          text={"Do you want to delete this user?"}
        />
      </Popup>
      <Table
        marginTop="3rem"
        setItemId={setItemId}
        TableData={items}
        TableColummns={USERS_TABLE_COLUMNS}
        UserTable={true}
      />
    </div>
  );
};

export default ListItems;
