import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Protecter({ children }) {
  const token = useSelector(({ auth }) => auth.token.payload);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
