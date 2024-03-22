import { createSlice } from "@reduxjs/toolkit";
import { users } from "../../pages/Home/usersList";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [...users],
  },
  reducers: {
    updateUsers: (state, action) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUsers, deleteUser } = adminSlice.actions;

export default adminSlice.reducer;
