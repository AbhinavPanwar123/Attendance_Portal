import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    signIn: (state, { payload }) => {
      console.log(payload);
      state.students = [payload];
    },
    logout: (state) => {
      state.students = [];
    },
  },
});

export const { signIn,logout } = loginSlice.actions;
export default loginSlice.reducer;
