import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    currentMenu: "users",
    currentMenuLabel: "Users",
    subMenu: "",
    isProfileOpen: false,
  },
  reducers: {
    updateMenu: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfile: (state, action) => {
      return { ...state, isProfileOpen: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMenu, updateProfile } = menuSlice.actions;

export default menuSlice.reducer;
