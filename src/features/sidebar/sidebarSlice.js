import { createSlice, current } from "@reduxjs/toolkit";
import { MENU } from "../../constants/appConstants";

export const menuSlice = createSlice({
  name: "sidebar",
  initialState: {
    currentMenu: MENU.USERS,
  },
  reducers: {
    updateMenu: (state) => {
      state.currentMenu = state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer;
