import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    isAuth: false,
  },
  reducers: {
    setToken: (x, action) => {
      x.token = action;
      // console.log("hello from setToken", action);
    },
    setIsAuth: (x, action) => {
      x.isAuth = action;
    },
    setTokenByLoacaleStorage: (x) => {
      x.token = localStorage?.getItem("tkn");
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setToken, setTokenByLoacaleStorage, setIsAuth } =
  authSlice.actions;
