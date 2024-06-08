import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Layout() {
  const isAuth = useSelector(({ auth }) => auth.isAuth.payload);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("Home");
    } else {
      navigate("register");
    }
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
