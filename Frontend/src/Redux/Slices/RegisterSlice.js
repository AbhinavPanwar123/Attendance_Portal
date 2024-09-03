import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: []
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    Register: (state, { payload }) => {
      const existingStudentIndex = state.students.findIndex(student => student.rollno === payload.rollno);
      if (existingStudentIndex === -1) {
        state.students.push(payload);
      } else {
        state.students[existingStudentIndex] = { ...state.students[existingStudentIndex], ...payload };
      }
    },
    UpdateProfile: (state, { payload }) => {
      const studentIndex = state.students.findIndex(student => student.rollno === payload.rollno);
      if (studentIndex !== -1) {
        state.students[studentIndex] = { ...state.students[studentIndex], ...payload };
      } else {
        console.warn(`Student with roll number ${payload.rollno} not found`);
      }
    }
  }
});

export const { Register, UpdateProfile } = registerSlice.actions;
export default registerSlice.reducer;
