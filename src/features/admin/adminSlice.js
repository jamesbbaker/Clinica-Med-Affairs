import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [
      { id: 1, email: "John.Doe@gmail.com", code: 1234 },
      { id: 2, email: "John.Doe@gmail.com", code: 2333 },
      { id: 3, email: "John.Doe@gmail.com", code: 8998 },
    ],
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
