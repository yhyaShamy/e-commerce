import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { myLoadingSpinner } from "../LoadingPage/LoadingPage";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function VerifyCode() {
  const navigate = useNavigate();
  // User initial values
  const userInitialValues = {
    resetCode: "",
  };

  // Yup Schema validation
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
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        values
      )
      .then(() => {
        setIsLoading(false);
        toast.remove(loadingToast);
        toast.success("Password changed successfully", {
          position: "top-center",
          duration: 1500,
        });
        // console.log(data);
        setTimeout(() => {
          navigate("/Login");
        }, 1200);
      })
      .catch((err) => {
        setIsLoading(false);

        // console.log("error", err);
        toast.remove(loadingToast);

        toast.error("Wrong code", {
          position: "top-center",
          duration: 1500,
        });
      });
  }

  // MyFormic
  const myFormik = useFormik({
    initialValues: userInitialValues,
    onSubmit: onSubmit,
  });

  return (
    <>
      <Helmet>
        <title>Verify Code</title>
      </Helmet>
      <form onSubmit={myFormik.handleSubmit} className="w-75 mx-auto py-5">
        <h2 className=" fw-bold mb-4">Enter your Code </h2>

        <input
          type="text"
          value={myFormik.values.resetCode}
          onChange={myFormik.handleChange}
          id="resetCode"
          onBlur={myFormik.handleBlur}
          placeholder="Code"
          className=" form-control p-2 mb-2"
        />

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
