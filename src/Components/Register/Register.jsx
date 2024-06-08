import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { setToken } from "../Redux/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { myLoadingSpinner } from "../LoadingPage/LoadingPage";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function Rigester() {
  // User initial values
  const userInitialValues = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  };

  // Password regex
  const passwordRegex = /^[a-zA-Z][a-zA-Z0-9]{5,8}$/;
  // Phone Regex
  const phoneRegex = /^01[012][0-9]{8}$/;
  // Yup Schema validation
  const mySchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name min length is 3")
      .max(12, "Name max length is 12"),
    email: yup
      .string()
      .required("Email is required")
      .email("email pattern is inavalid"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        passwordRegex,
        <>
          <h5>must be</h5>
          <p>* Start with a letter (either uppercase or lowercase).</p>
          <p>* Be between 6 and 9 characters in total.</p>
          <p> * Can only contain letters (A-Z or a-z) and numbers (0-9)</p>
        </>
      ),
    rePassword: yup
      .string()
      .required("Re-password is required")
      .oneOf([yup.ref("password")], "Not matched"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(phoneRegex, "invalid phone number"),
  });

  // Set Token
  const dispatch = useDispatch();
  const token = useSelector(({ auth }) => auth.token.payload);
  if (token) {
    localStorage.setItem("tkn", token);
  }

  // IsLoading

  const [isLoading, setIsLoading] = useState(false);

  // Navigate
  const navigate = useNavigate();

  // On Submit
  function onSubmit(values) {
    // Toast message
    const loadingToast = toast.loading("Please wait...", {
      position: "top-center",
    });
    // IsLoading
    setIsLoading(true);
    // Get data
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signup", values)
      .then(({ data }) => {
        setIsLoading(false);

        dispatch(setToken(data.token));
        console.log("Token from submetion", token);
        toast.remove(loadingToast);
        toast.success("signed up successfully", {
          position: "top-center",
          duration: 1500,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);

        // console.log("error", err);
        toast.remove(loadingToast);

        toast.error(err.response.data.message, {
          position: "top-center",
          duration: 1500,
        });
      });
  }

  // MyFormic
  const myFormik = useFormik({
    initialValues: userInitialValues,
    onSubmit: onSubmit,
    validationSchema: mySchema,
  });

  // console.log(token);

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <form onSubmit={myFormik.handleSubmit} className="w-75 mx-auto py-5">
        <h2 className=" fw-bold mb-4">Register Now :</h2>
        <label htmlFor="name">Name :</label>
        <input
          type="text"
          id="name"
          value={myFormik.values.name}
          onChange={myFormik.handleChange}
          onBlur={myFormik.handleBlur}
          className=" form-control p-2 mb-2"
        />
        {myFormik.errors.name && myFormik.touched.name ? (
          <div className="alert alert-danger">{myFormik.errors.name}</div>
        ) : (
          ""
        )}

        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          value={myFormik.values.email}
          onChange={myFormik.handleChange}
          onBlur={myFormik.handleBlur}
          className=" form-control p-2 mb-2"
        />
        {myFormik.errors.email && myFormik.touched.email ? (
          <div className="alert alert-danger">{myFormik.errors.email}</div>
        ) : (
          ""
        )}

        <label htmlFor="password">Password :</label>
        <input
          type="password"
          id="password"
          value={myFormik.values.password}
          onChange={myFormik.handleChange}
          onBlur={myFormik.handleBlur}
          className=" form-control p-2 mb-2"
        />
        {myFormik.errors.password && myFormik.touched.password ? (
          <div className="alert alert-danger">{myFormik.errors.password}</div>
        ) : (
          ""
        )}

        <label htmlFor="rePassword">Re-password :</label>
        <input
          type="password"
          id="rePassword"
          value={myFormik.values.rePassword}
          onChange={myFormik.handleChange}
          onBlur={myFormik.handleBlur}
          className=" form-control p-2 mb-2"
        />
        {myFormik.errors.rePassword && myFormik.touched.rePassword ? (
          <div className="alert alert-danger">{myFormik.errors.rePassword}</div>
        ) : (
          ""
        )}

        <label htmlFor="phone">Phone :</label>
        <input
          type="text"
          id="phone"
          className=" form-control p-2"
          value={myFormik.values.phone}
          onChange={myFormik.handleChange}
          onBlur={myFormik.handleBlur}
        />
        {myFormik.errors.phone && myFormik.touched.phone ? (
          <div className="alert alert-danger">{myFormik.errors.phone}</div>
        ) : (
          ""
        )}

        <button
          className={
            myFormik.isValid && myFormik.dirty
              ? "mt-3 ms-auto d-block btn btn-lg btn-success text-center"
              : "mt-3 ms-auto d-block btn btn-lg  btn-outline-secondary text-center"
          }
          disabled={myFormik.dirty ? !myFormik.isValid : true}
          type="submit"
        >
          {isLoading ? myLoadingSpinner : "Register"}
        </button>
      </form>
    </>
  );
}
