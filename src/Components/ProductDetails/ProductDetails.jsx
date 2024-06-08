import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../Products/Product.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishList,
  getAllwishlist,
  removeFromWishlist,
} from "../Redux/WishList";
import { addToCart, getCart } from "../Redux/CartSlice";

export default function ProductsDetails() {
  const token = useSelector(({ auth }) => auth.token.payload);
  const { id } = useParams();
  const { wishlistproducts } = useSelector(({ wishlist }) => wishlist);
  function getProductDetails() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }

  const { data, isLoading } = useQuery(
    `productDetails/${id}`,
    getProductDetails
  );

  const dispatch = useDispatch();

  function isOnWishlist(id) {
    if (wishlistproducts.map((product) => product.id == id).includes(true)) {
      return "text-danger";
    }
    return "";
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  const product = data.data.data;
  return (
    <>
      <Helmet>
        <title>{product.title}</title>
      </Helmet>
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-3">
            <picture>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-100"
              />
            </picture>
          </div>
          <div className="col-md-8">
            <h3 className="mb-3 fw-bold">{product.title}</h3>
            <p className="mb-3">{product.description}</p>
            <p className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-success fw-bold">{product.price} EGP</p>
              <p>
                {product.ratingsAverage}
                <i className={`fa-solid fa-star ${styles.rateStar}`}></i>
              </p>
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-lg btn-success w-75"
                onClick={() => {
                  dispatch(getCart(token));
                  dispatch(addToCart([product.id, token]));
                }}
              >
                + add to cart
              </button>
              <button
                className={`bg-transparent border-0 ms-auto d-block ${isOnWishlist(
                  product.id
                )}`}
                onClick={() => {
                  if (isOnWishlist(product.id)) {
                    dispatch(removeFromWishlist([product.id, token]));
                    setTimeout(() => {
                      dispatch(getAllwishlist(token));
                    }, 200);
                  } else {
                    dispatch(addToWishList([product.id, token]));
                    setTimeout(() => {
                      dispatch(getAllwishlist(token));
                    }, 200);
                  }
                }}
              >
                <i className="fa-solid fa-heart fs-3"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
