import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { authReducer, setIsAuth, setToken } from "./AuthReducer";
import logger from "redux-logger";
import { wishlistReducer } from "./WishList";
import { cartReducer } from "./CartSlice";

export const myStore = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
  middleware: (defaulMiddleware) => defaulMiddleware([applyMiddleware(logger)]),
});

// console.log("Intial state", myStore.getState().auth.token);

export const token = localStorage.getItem("tkn");
if (token) {
  myStore.dispatch(setToken(token));
  myStore.dispatch(setIsAuth(true));
}

// const store = createStore();
