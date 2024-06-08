import React, { useEffect } from "react";
import styles from "../Products/Product.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  changeQuantityOfProdduct,
  removeCart,
  removeProduct,
} from "../Redux/CartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const token = useSelector(({ auth }) => auth.token.payload);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCart(token));
  }, [dispatch]);

  const {
    cartItems: numOfCartItems,
    isLoading,
    totalPrice,
    cartProducts,
    isError,
  } = useSelector(({ cart }) => cart);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError || !cartProducts || !cartProducts.length) {
    return (
      <>
        <div className="container">
          <div className={`p-5 rounded-5 ${styles.cardBg}`}>
            <h2 className="fw-bold mb-4">Cart Shop</h2>
            <div className=" row align-items-center gy-4">
              <h3 className="mb-0 col-lg-9 lh-sm">
                Add Some Products To Your Cart
              </h3>
              <Link to="/home" className="text-decoration-none col-lg-3">
                <button className="btn btn-lg btn-primary">Back to home</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <div className="container">
        <div className={`p-5 rounded-5 ${styles.cardBg}`}>
          <div className="d-flex justify-content-between align-items-center mb-4 fw-bold">
            <h2 className="fw-bold mb-0">Cart Shop</h2>
            <Link to="/order" className="text-decoration-none">
              <button className=" btn btn-lg btn-primary">Payment</button>
            </Link>
          </div>
          <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center mb-5 fw-bold">
            <p className="mb-0 fs-5">
              Total price :
              <span className=" text-success"> {totalPrice} EGP</span>
            </p>
            <p className="mb-0 fs-5">
              total number of items :
              <span className=" text-success"> {numOfCartItems}</span>
            </p>
          </div>
          <ul className="list-unstyled">
            {cartProducts?.map((product, i) => {
              return (
                <li
                  className="row border-bottom align-items-center mb-4 pb-3"
                  key={i}
                  id={product.product.id}
                >
                  <picture className="col-md-3">
                    <img
                      src={product.product.imageCover}
                      alt={product.product.title}
                      className="w-100"
                    />
                  </picture>
                  <div className="col-md-9 d-flex justify-content-between mt-sm-4 mt-md-0">
                    <div className="d-flex flex-column">
                      <h4 className="fs-3">
                        {product.product.title.split(" ").slice(0, 2).join(" ")}
                      </h4>
                      <p className="text-success fw-bold fs-5">
                        {product.price} EGP
                      </p>
                      <p
                        className="text-danger cursor-pointer fs-5"
                        onClick={() => {
                          dispatch(removeProduct([product.product.id, token]));
                          setTimeout(() => {
                            dispatch(getCart(token));
                          }, 200);
                        }}
                      >
                        <i className=" fa-solid fa-trash"></i> Remove
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-md btn-outline-success"
                        onClick={() => {
                          dispatch(
                            changeQuantityOfProdduct([
                              product.product.id,
                              product.count,
                              1,
                              token,
                            ])
                          );
                        }}
                      >
                        +
                      </button>
                      <span className="d-flex fs-5">{product.count}</span>
                      <button
                        className="btn btn-md btn-outline-success"
                        onClick={() => {
                          if (product.count !== 1) {
                            dispatch(
                              changeQuantityOfProdduct([
                                product.product.id,
                                product.count,
                                -1,
                                token,
                              ])
                            );
                          }
                        }}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="w-100 d-flex justify-content-center">
            <button
              className="btn btn-lg btn-outline-danger "
              onClick={() => dispatch(removeCart(token))}
            >
              Clear Your Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
