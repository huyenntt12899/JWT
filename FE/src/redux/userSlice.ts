import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {
      allUsers: null,
      isLoading: false,
      error: false,
    },
    mgs: "",
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isLoading = true;
    },
    getUsersSuccess: (state, action) => {
      state.users.isLoading = false;
      state.users.allUsers = action.payload;
    },
    getUsersFailed: (state) => {
      state.users.isLoading = false;
      state.users.error = true;
    },
    deleteUserStart: (state) => {
      state.users.isLoading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.users.isLoading = false;
      state.mgs = action.payload;
    },
    deleteUserFailed: (state, action) => {
      state.users.isLoading = false;
      state.users.error = true;
      state.mgs = action.payload;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
