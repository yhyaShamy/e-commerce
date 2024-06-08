import React from "react";
import { Helmet } from "react-helmet";
import "./CashPayment.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import { format } from "date-fns";

export default function CashPayment() {
  const { cartOwner } = useSelector(({ cart }) => cart);

  const getUserOrders = async function () {
    return await axios.get(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${cartOwner}`
    );
  };

  const formateDate = function (date) {
    const orderDate = new Date(date);
    return format(orderDate, "yyyy-MM-dd HH:mm:ss");
  };

  const convertTimeStampTOSecondes = function (timestamp) {
    const date = new Date(timestamp);
    return Math.floor(date.getTime() / 1000);
  };

  const { data, isLoading } = useQuery("getUserOrders", getUserOrders);

  if (isLoading) {
    return <LoadingPage />;
  }

  const orders = data.data;
  const ordersSortByTime = orders.sort((a, b) => {
    return (
      convertTimeStampTOSecondes(b.createdAt) -
      convertTimeStampTOSecondes(a.createdAt)
    );
  });

  return (
    <>
      <Helmet>
        <title>Cash Payment</title>
      </Helmet>
      <div className={`myContainer py-5`}>
        <h2 className="fw-bold mb-5">Cash Payment Orders</h2>

        {ordersSortByTime.map((order, i) => {
          return (
            <div className="row py-3 gx-5 border-bottom" key={i}>
              <div className="col-md-6">
                <ul className="shadow-lg p-4 list-unstyled rounded-3 gap-3 d-flex flex-column ">
                  <li>Name : {order.user.name}</li>
                  <li>Phone : {order.shippingAddress.phone}</li>
                  <li>City : {order.shippingAddress.city}</li>
                  <li>Details : {order.shippingAddress.details}</li>
                  <li>Total price : {order.totalOrderPrice} EGP</li>
                  <li className="text-success fw-bold">
                    {formateDate(order.createdAt)}
                  </li>

                  <li
                    className={`${
                      order.isPaid ? "text-success" : "text-danger"
                    } fw-bold`}
                  >
                    {order.isPaid ? "Paid Successfully" : "Not paid yet"}
                  </li>
                </ul>
              </div>
              <ul className="list-unstyled col-md-6">
                {order.cartItems.map((item) => {
                  return (
                    <li
                      className="d-flex row align-items-center mb-1"
                      key={item._id}
                    >
                      <picture className="col-3">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-100"
                        />
                      </picture>
                      <div className="d-flex flex-column col-9 px-0">
                        <h4>
                          {item.product.title?.split(" ").slice(0, 2).join(" ")}
                        </h4>
                        <h4>Quantity : {item.count}</h4>
                        <div className="d-flex align-items-center justify-content-between ">
                          <span>{item.price} EGP</span>
                          <span>
                            <span>{item.product.ratingsAverage} </span>
                            <i className={`fa-solid fa-star rateStar`}></i>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
