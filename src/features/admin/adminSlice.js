import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
  },
  reducers: {
    updateUsers: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUsers } = adminSlice.actions;

export default adminSlice.reducer;
