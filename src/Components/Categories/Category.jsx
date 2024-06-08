import React, { useEffect, useState } from "react";
import styles from "../Products/Product.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";

export default function Category() {
  function getAllCategories() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/categories");
  }
  const { data, isLoading } = useQuery("allCategories", getAllCategories);

  const [supCategories, setSupCategories] = useState(null);
  const [isThereSubCategories, setisThereSubCategories] = useState(false);
  const [categoryName, setCategoryName] = useState(null);

  async function getSpecificCategory(id) {
    const loadingToast = toast.loading("Loading", { position: "top-center" });
    await axios
      .get(
        `https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories/`
      )
      .then((res) => {
        toast.remove(loadingToast);
        setisThereSubCategories(true);
        setSupCategories(res.data.data);
      });
  }

  async function setNameOfSpecificCategory(id) {
    await axios
      .get(`https://ecommerce.routemisr.com/api/v1/categories/${id}`)
      .then((res) => setCategoryName(res.data.data.name));
  }

  const dispatch = useDispatch();

  if (isLoading) {
    return <LoadingPage />;
  }

  const categories = data.data.data;
  return (
    <>
      <Helmet>
        <title>Categories</title>
      </Helmet>
      <div className=" w-75 py-5 row mx-auto g-3">
        {categories.map((category, i) => {
          return (
            <div class="col-lg-4 col-sm-6" key={i}>
              <div
                className={`${styles.productBox} card cursor-pointer h-100`}
                onClick={() => {
                  getSpecificCategory(category._id);
                  setNameOfSpecificCategory(category._id);
                }}
              >
                <img
                  src={category.image}
                  className="w-100 card-img-top h-100"
                  alt={category.name}
                />
                <div class="card-body">
                  <h4 class="card-title">{category.name}</h4>
                </div>
              </div>
            </div>
          );
        })}

        {isThereSubCategories ? (
          <div className="mt-5">
            <h2 className="fw-bold text-success text-center mb-4">
              {categoryName} Sub Category
            </h2>
            <div className="row g-3">
              {supCategories.map((supCategory, i) => {
                return (
                  <>
                    <div className="col-lg-4 col-sm-6" key={i}>
                      <div
                        className={`${styles.productBox} card cursor-pointer h-100 p-2`}
                      >
                        <h2 className="text-center">{supCategory.name}</h2>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
