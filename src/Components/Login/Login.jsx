import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
import { setIsAuth, setToken } from "../Redux/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { myLoadingSpinner } from "../LoadingPage/LoadingPage";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getCart } from "../Redux/CartSlice";
import { getAllwishlist } from "../Redux/WishList";

export default function Login() {
  // User initial values
  const userInitialValues = {
    email: "",
    password: "",
  };

  // Password regex
  const passwordRegex = /^[a-zA-Z][a-zA-Z0-9]{5,8}$/;
  // Yup Schema validation
  const mySchema = yup.object({
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
  });

  // Set Token
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  // On Submit
  const navigate = useNavigate();
  function onSubmit(values) {
    setIsLoading(true);
    const loadingToast = toast.loading("Please wait...", {
      position: "top-center",
    });
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signin", values)
      .then((res) => {
        setIsLoading(false);
        console.log(" Submition : ", res.data.token);
        localStorage.setItem("tkn", res.data.token);
        dispatch(getCart(res.data.token));
        dispatch(getAllwishlist(res.data.token));
        dispatch(setToken(res.data.token));
        toast.remove(loadingToast);
        toast.success("Welcome back", {
          position: "top-center",
          duration: 1500,
        });
        setTimeout(() => {
          dispatch(setIsAuth(true));
          navigate("/products");
        }, 1300);
        return res.status;
      })
      .catch((err) => {
        setIsLoading(false);

        console.log("error", err);
        toast.remove(loadingToast);

        toast.error("error", {
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
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <form onSubmit={myFormik.handleSubmit} className="w-75 mx-auto py-5">
        <h2 className=" fw-bold mb-4">Login :</h2>

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
        <div className="d-flex align-items-center justify-content-between mt-3">
          <Link
            className={`mb-0 fw-bold fs-5 ${styles.forgetPassword}`}
            to="/forgetPassword"
          >
            Forget your password ?
          </Link>
          <button
            className={
              myFormik.dirty && myFormik.isValid
                ? "btn btn-lg btn-success text-center"
                : "btn btn-lg btn-outline-secondary text-center"
            }
            disabled={myFormik.dirty ? !myFormik.isValid : true}
            type="submit"
          >
            {isLoading ? myLoadingSpinner : "Login"}
          </button>
        </div>
      </form>
    </>
  );
}
