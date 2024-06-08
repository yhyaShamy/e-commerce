import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import $ from "jquery";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const dispatch = useDispatch();
  const token = useSelector(({ auth }) => auth.token.payload);
  const navigate = useNavigate();
  const { cartId } = useSelector(({ cart }) => cart);
  useEffect(() => {
    if (!cartId) {
      dispatch(getCart(token));
    }
  }, []);
  const [phoneValue, setPhoneValue] = useState(null);
  const [detailsValue, setDetailsValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);

  const makeCashPayment = async function () {
    await axios
      .post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          shippingAddress: {
            details: detailsValue,
            phone: phoneValue,
            city: cityValue,
          },
        },
        {
          headers: { token },
        }
      )
      .then(() => {
        dispatch(getCart(token));
        setPhoneValue($("#phone").val(""));
        setDetailsValue($("#details").val(""));
        setCityValue($("#city").val(""));
        navigate("/cashPayment");
        dispatch(removeCart(token));
      })
      .catch((err) => {
        toast.error("there's no cart ", {
          position: "top-center",
          duration: 1500,
        });
        console.log("ERROR : ", err.message);
      });
  };

  const makeOnlinePayment = async function () {
    await axios
      .post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`,
        {
          shippingAddress: {
            details: detailsValue,
            phone: phoneValue,
            city: cityValue,
          },
        },
        {
          headers: { token },
          params: {
            url: window.location.origin,
          },
        }
      )
      .then((res) => {
        window.open(res.data.session.url, "_self");
        setPhoneValue($("#phone").val(""));
        setDetailsValue($("#details").val(""));
        setCityValue($("#city").val(""));
      })
      .catch((err) => {
        toast.error("there's no cart ", {
          position: "top-center",
          duration: 1500,
        });
        console.log("ERROR : ", err.message);
      });
  };

  const onChange = () => {
    setPhoneValue($("#phone").val());
    setDetailsValue($("#details").val());
    setCityValue($("#city").val());
  };

  const phoneRgx = /[0-9]/;

  const isvalid = function () {
    if (phoneRgx.test(phoneValue) && detailsValue && cityValue) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <div className="container py-5">
        <h2 className="fw-bold mb-0">Payment</h2>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="details">Details</label>
          <input
            type="text"
            id="details"
            onChange={onChange}
            className="form-control w-100 p-2 mt-1 mb-3"
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            onChange={onChange}
            className="form-control w-100 p-2 mt-1 mb-3"
          />

          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            onChange={onChange}
            className="form-control w-100 p-2 mt-1 mb-5"
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-lg btn-primary"
              type="button"
              onClick={() => {
                if (isvalid()) {
                  makeCashPayment();
                }
              }}
              disabled={!isvalid()}
            >
              Confirm Cach Payment
            </button>
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={() => {
                if (isvalid()) {
                  makeOnlinePayment();
                }
              }}
              disabled={!isvalid()}
            >
              Confirm Online Payment
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
