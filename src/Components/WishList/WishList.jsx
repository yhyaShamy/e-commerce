import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import styles from "./WishList.module.css";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../Redux/CartSlice";
import { getAllwishlist, removeFromWishlist } from "../Redux/WishList";

export default function WishList() {
  const dispatch = useDispatch();
  const token = useSelector(({ auth }) => auth.token.payload);

  const { isLoading, wishlistproducts } = useSelector(
    ({ wishlist }) => wishlist
  );

  useEffect(() => {
    dispatch(getAllwishlist(token));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!wishlistproducts?.length) {
    return (
      <>
        <Helmet>
          <title>Wish List</title>
        </Helmet>
        <div className="container">
          <div className={`p-5 rounded-5 ${styles.cardBg}`}>
            <h3 className="fw-bold mb-4">My Wish List</h3>
            <h4 className=" text-capitalize">
              add some products to your wishlist
            </h4>
          </div>
        </div>
      </>
    );
  }

  // {
  //   data.data.data.length ?  : "";
  // }

  return (
    <>
      <div className="container py-5">
        <div className={`p-5 rounded-5 ${styles.cardBg}`}>
          <h3 className="fw-bold mb-4">My Wish List</h3>
          <ul className="mb-0 list-unstyled">
            {wishlistproducts?.map((product, i) => {
              return (
                <li
                  className="row border-bottom align-items-center mb-4 pb-3"
                  key={i}
                >
                  <picture className="col-md-3">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="w-100"
                    />
                  </picture>
                  <div className="col-md-9 d-flex justify-content-between mt-sm-4 mt-md-0">
                    <div className="d-flex flex-column">
                      <h4>{product.title.split(" ").slice(0, 2).join(" ")}</h4>
                      <p className="text-success fw-bold">
                        {product.price} EGP
                      </p>
                      <p
                        className="text-danger cursor-pointer"
                        onClick={() => {
                          dispatch(removeFromWishlist([product.id, token]));
                          setTimeout(() => {
                            dispatch(getAllwishlist(token));
                          }, 200);
                        }}
                      >
                        <i className=" fa-solid fa-trash"></i> Remove
                      </p>
                    </div>
                    <button
                      className="btn btn-lg btn-outline-success h-50"
                      onClick={() => {
                        dispatch(addToCart([product.id, token]));
                        dispatch(getCart(token));
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
