import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styles from "../Products/Product.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../LoadingPage/LoadingPage";
import toast from "react-hot-toast";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

export default function Brands() {
  function getAllBrands() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/brands");
  }
  const { data, isLoading } = useQuery("getAllBrands", getAllBrands);

  const [specificBrand, setSpecificBrand] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  async function getSpecificBrand(id) {
    const laodingToast = toast.loading("Loading", { position: "top-center" });
    await axios
      .get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`)
      .then((res) => {
        setShow(true);
        toast.remove(laodingToast);
        setSpecificBrand(res.data.data);
      });
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  const brands = data.data.data;
  return (
    <>
      <Helmet>
        <title>Brands</title>
      </Helmet>
      <div className="container py-5">
        <h1 className="text-center text-success fw-bold">All Brands</h1>
        <div className="row mt-5 g-4">
          {brands.map((brand, i) => {
            return (
              <div className="col-md-3 h-100 col-xxl-2 col-6" key={i}>
                <div
                  className={`${styles.productBox} card cursor-pointer`}
                  onClick={() => {
                    getSpecificBrand(brand._id);
                  }}
                >
                  <img
                    src={brand.image}
                    className="w-100 card-img-top h-100"
                    alt={brand.name}
                  />
                  <div class="card-body">
                    <h5 class="card-title text-center">{brand.name}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-between">
          <h2 className="fw-bold text-success mb-0">{specificBrand?.name}</h2>
          <img
            src={specificBrand?.image}
            alt={specificBrand?.name}
            className="w-50"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
