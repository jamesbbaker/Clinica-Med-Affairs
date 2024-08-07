import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    addMultipleUsers: (state, action) => {
      state.users = action.payload;
    },
    deleteUser: (state, action) => {
      console.log(action.payload, state)
      state.users = state.users.filter((user) => user.email !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addUser, deleteUser, addMultipleUsers } = adminSlice.actions;

export default adminSlice.reducer;
