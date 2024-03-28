import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    currentMenu: "users",
    subMenu: "",
  },
  reducers: {
    updateMenu: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer;
