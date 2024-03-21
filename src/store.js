import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./features/menu/menuSlice";
import adminReducer from "./features/admin/adminSlice";

export default configureStore({
  reducer: {
    menu: menuReducer,
    admin: adminReducer,
  },
});
