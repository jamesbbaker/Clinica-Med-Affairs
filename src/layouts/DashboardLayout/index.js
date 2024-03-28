import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { addMultipleUsers } from "../../features/admin/adminSlice";
import { updateMenu } from "../../features/menu/menuSlice";

const DashboardLayout = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { logOut, accessToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(
        updateMenu({
          currentMenu: id,
        })
      );
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://clinica-server.replit.app/get_all_users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const userData = await response.json();

          dispatch(addMultipleUsers(userData));
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  return (
    <div className="flex font-primary justify-center items-center w-screen h-screen">
      <Sidebar />
      <div className="w-4/5 px-4 py-6 h-full overflow-y-scroll">
        <div className="border px-4  mb-4 py-2 border-slate-300 rounded-md w-full items-center flex justify-between">
          <div className="relative font-semibold">Vishal</div>
          <div
            onClick={toggleDialog}
            className="w-6  h-6 text-slate-50 cursor-pointer hover:scale-105 transition-scale ease-in-out bg-primary rounded-full grid place-content-center"
          >
            V
          </div>
          {openDialog && (
            <>
              <div
                onClick={toggleDialog}
                className="fixed z-10 left-0 right-0 top-0 bottom-0"
              ></div>
              <div className="absolute right-6 top-14 bg-slate-50 z-20  flex flex-col gap-2 py-2 border">
                <div
                  onClick={logOut}
                  className="hover:bg-slate-200 px-4 cursor-pointer"
                >
                  Sign Out
                </div>
              </div>
            </>
          )}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
