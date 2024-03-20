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
      console.log(action.payload);
      state.users.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUsers } = adminSlice.actions;

export default adminSlice.reducer;
