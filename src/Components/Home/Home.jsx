import React, { useEffect, useState } from "react";
import Products from "../Products/Products";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";

export default function Home() {
  // Slick carousel sittings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // This removes the control icons
  };

  return (
    <>
      {/*       
            <Slider {...settings}>
        {categories?.map((category) => {
          return (
            <div>
              <img src={category.image} alt={category.name} />
              <p>{category.name}</p>
            </div>
          );
        })}
      </Slider>
       */}

      <Products />
      <Helmet>
        <title>Home</title>
      </Helmet>
    </>
  );
}
