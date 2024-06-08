import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { myLoadingSpinner } from "../LoadingPage/LoadingPage";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ForgetPassword() {
  const navigate = useNavigate();
  // User initial values
  const userInitialValues = {
    email: "",
  };

  // Yup Schema validation
  const mySchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("email pattern is inavalid"),
  });
  const [isLoading, setIsLoading] = useState(false);
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
      .post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        values
      )
      .then(({ data }) => {
        setIsLoading(false);
        toast.remove(loadingToast);
        toast.success(data.message, {
          position: "top-center",
          duration: 1500,
        });
        setTimeout(() => {
          navigate("/verifycode");
        }, 1200);
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

  return (
    <>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <form onSubmit={myFormik.handleSubmit} className="w-75 mx-auto py-5">
        <h2 className=" fw-bold mb-4">Enter your email </h2>

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

        <button
          className={
            myFormik.isValid
              ? "mt-3 d-block btn btn-lg btn-success text-center"
              : "mt-3 d-block btn btn-lg  btn-outline-secondary text-center"
          }
          disabled={!myFormik.isValid}
          type="submit"
        >
          {isLoading ? myLoadingSpinner : "Verify"}
        </button>
      </form>
    </>
  );
}
