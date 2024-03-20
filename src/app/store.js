import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import menuReducer from "../features/sidebar/sidebarSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    menu: menuReducer,
  },
});
