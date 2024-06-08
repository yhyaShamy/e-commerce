import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingPage, { myLoadingSpinner } from "../LoadingPage/LoadingPage";
import { useMutation, useQuery } from "react-query";
import { myQueryClient } from "../../App";
import styles from "./Product.module.css";
import { Helmet } from "react-helmet";
import {
  addToWishList,
  getAllwishlist,
  removeFromWishlist,
} from "../Redux/WishList";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart, setMyCartItems } from "../Redux/CartSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);
  console.log();
  useEffect(() => {
    dispatch(getAllwishlist());
    if (wishlistproducts) {
      dispatch(getAllwishlist());
    }
  }, [dispatch]);

  const { wishlistproducts } = useSelector(({ wishlist }) => wishlist);

  function getAllProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  // const isWishlistLoading = useSelector(
  //   ({ wishlist }) => wishlist.wishListIsLoading.payload
  // );
  const [searchedProducts, setSearchedProducts] = useState(null);

  const { isLoading, data } = useQuery("products", getAllProducts);

  function onSearch(e) {
    const mySearchedProducts = data.data.data.filter((product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setSearchedProducts(mySearchedProducts);
  }

  function isOnWishlist(id) {
    if (wishlistproducts?.map((product) => product.id == id).includes(true)) {
      return "text-danger";
    }
    return "";
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  let myProducts;
  if (searchedProducts) {
    myProducts = searchedProducts;
  }
  if (!searchedProducts) {
    myProducts = data?.data.data;
  }

  return (
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <div className="container py-5">
        <input
          type="text"
          className=" form-control w-100 p-2 my-5"
          placeholder="Search"
          onChange={onSearch}
          // onBlur={onSearch}
        />
        <div className="row g-4">
          {myProducts?.map((product, idx) => {
            return (
              <div
                className="col-lg-3 col-sm-6 col-md-4"
                key={idx}
                id={product.id}
              >
                <Link
                  className={`border h-100 p-2 rounded-3 text-black text-decoration-none ${styles.productBox} box d-block position-relative overflow-hidden`}
                  to={`/productdetails/${product.id}`}
                >
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-100 mb-2"
                  />
                  <h5 className="text-main mb-3">{product.category.name}</h5>
                  <h5 className="fw-bold">
                    {product.title.split(" ").slice(0, 2).join(" ")}
                  </h5>
                  <div className="d-flex productBox align-items-center justify-content-between my-3">
                    <span>{product.price} EGP</span>
                    <span>
                      <span>{product.ratingsAverage} </span>
                      <i className={`fa-solid fa-star ${styles.rateStar}`}></i>
                    </span>
                  </div>

                  <button
                    className={`bg-transparent border-0 ms-auto d-block ${
                      wishlistproducts && wishlistproducts?.length
                        ? isOnWishlist(product.id)
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (isOnWishlist(product.id)) {
                        dispatch(
                          removeFromWishlist([product.id, token.payload])
                        );
                        dispatch(getAllwishlist(token.payload));
                      } else {
                        dispatch(addToWishList([product.id, token.payload]));
                        dispatch(getAllwishlist(token.payload));
                      }
                      dispatch(getAllwishlist(token.payload));
                    }}
                  >
                    <i className={`fa-solid fa-heart fs-3`}></i>
                  </button>

                  <button
                    className={`${styles.addToCartBtn} position-absolute btn btn-md btn-success addToCart`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      dispatch(addToCart([product.id, token.payload]));
                      // dispatch(getCart());
                    }}
                  >
                    + add
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
