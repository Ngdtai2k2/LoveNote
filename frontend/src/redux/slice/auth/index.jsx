import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
  name: "auth",
  initialState: {
    isFetching: false,
    token: null,
    device_id: null,
    error: false,
  },
  reducers: {
    signInStart(state) {
      state.isFetching = true;
    },
    signInSuccess(state, action) {
      state.isFetching = false;
      state.token = action.payload.token;
      state.device_id = action.payload.device_id;
    },
    signInError(state) {
      state.isFetching = false;
      state.error = true;
    },
    signOutStart(state) {
      state.isFetching = true;
    },
    signOutSuccess(state) {
      state.isFetching = false;
      state.token = null;
      state.device_id = null;
      state.error = false;
    },
    signOutError(state) {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInError,
  signOutStart,
  signOutSuccess,
  signOutError,
} = auth.actions;

export default auth.reducer;
