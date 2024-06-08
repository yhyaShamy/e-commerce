import React from "react";
import { Triangle } from "react-loader-spinner";

export const myLoadingSpinner = (
  <Triangle
    visible={true}
    height="20"
    width="20"
    color="#fff"
    ariaLabel="triangle-loading"
    wrapperStyle={{}}
    wrapperClass=""
  />
);

export default function LoadingPage() {
  return (
    <>
      <div className=" h-100 w-100 position-absolute d-flex justify-content-center align-items-center bg-secondary bg-opacity-50">
        <Triangle
          visible={true}
          height="120"
          width="120"
          color="#fff"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
}
