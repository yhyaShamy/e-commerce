import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Rigester from "./Components/Register/Register";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { myStore } from "./Components/Redux/store";
import Login from "./Components/Login/Login";
import Products from "./Components/Products/Products";
import Protecter from "./Components/Protecter/Protecter";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import VerifyCode from "./Components/VerifeCode/VerifyCode";
import Layout from "./Components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import WishList from "./Components/WishList/WishList";
import Categories from "./Components/Categories/Category";
import Cart from "./Components/Cart/Cart";
import Brands from "./Components/Brands/Brands";
import Home from "./Components/Home/Home";
import Order from "./Components/Order/Order";
import CashPayment from "./Components/CashPayment/CashPayment";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "register", element: <Rigester /> },
      {
        path: "Products",
        element: (
          <Protecter>
            <Products />
          </Protecter>
        ),
      },
      {
        path: "Productdetails/:id",
        element: (
          <Protecter>
            <ProductDetails />
          </Protecter>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Protecter>
            <WishList />
          </Protecter>
        ),
      },
      {
        path: "Categories",
        element: (
          <Protecter>
            <Categories />
          </Protecter>
        ),
      },
      {
        path: "Cart",
        element: (
          <Protecter>
            <Cart />
          </Protecter>
        ),
      },
      {
        path: "Brands",
        element: (
          <Protecter>
            <Brands />
          </Protecter>
        ),
      },
      {
        path: "Home",
        element: (
          <Protecter>
            <Home />
          </Protecter>
        ),
      },
      {
        path: "/Order",
        element: (
          <Protecter>
            <Order />
          </Protecter>
        ),
      },
      {
        path: "/Cashpayment",
        element: (
          <Protecter>
            <CashPayment />
          </Protecter>
        ),
      },
      { path: "Login", element: <Login /> },
      { path: "ForgetPassword", element: <ForgetPassword /> },
      { path: "VerifyCode", element: <VerifyCode /> },
      { path: "/*", element: <h2>404 not found</h2> },
    ],
  },
]);

export const myQueryClient = new QueryClient({});

export default function App() {
  return (
    <>
      <QueryClientProvider client={myQueryClient}>
        <Provider store={myStore}>
          <RouterProvider router={myRouter} />
          <Toaster />
        </Provider>
      </QueryClientProvider>
    </>
  );
}
