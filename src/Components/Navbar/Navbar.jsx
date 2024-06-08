import React, { useEffect } from "react";
import logo from "../../images/freshcart-logo.svg";
import { Link, useParams } from "react-router-dom";
import $ from "jquery";
import { setIsAuth, setToken } from "../Redux/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../Redux/CartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const isAuth = useSelector(({ auth }) => auth.isAuth.payload);
  const token = useSelector(({ auth }) => auth.token.payload);
  const { cartItems } = useSelector(({ cart }) => cart);
  function signingOut() {
    localStorage.removeItem("tkn");
    dispatch(setToken(""));
    dispatch(setIsAuth(false));
  }
  useEffect(() => {
    dispatch(getCart(token));
    $(".nav-link").on("click", (e) => {
      $(".nav-link").removeClass("active");
      $(e.target).addClass("active");
    });
  }, [dispatch]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            <img src={logo} alt="freshcart" classNameName="w-100" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isAuth ? (
              <>
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                  <li className="nav-item me-1">
                    <Link className="nav-link active" to="/home" id="home">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item me-1">
                    <Link className="nav-link" to="/Cart" id="cart">
                      Cart
                    </Link>
                  </li>
                  <li className="nav-item me-1">
                    <Link className="nav-link" to="/wishlist" id="wishlist">
                      Wish list
                    </Link>
                  </li>
                  <li className="nav-item me-1">
                    <Link className="nav-link" to="/Categories" id="categories">
                      Categories
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Brands" id="brands">
                      Brands
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item me-1">
                    <Link className="nav-link position-relative" to="/cart">
                      <i className="fa-solid fa-shopping-cart fs-3"></i>
                      {cartItems ? (
                        <span class="badge text-bg-success position-absolute top-0 start-100 translate-middle">
                          {cartItems}
                        </span>
                      ) : (
                        ""
                      )}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login" onClick={signingOut}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                  <li className="nav-item me-1">
                    <Link className="nav-link" to="/Register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">
                      Login
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
