import React from "react";
import "./Offer.css";
import exclusive_image from "../Assets/exclusive_image.png";
import banner from "../Assets/banner-2.png";
import Sizechart from "../Assets/sizechart.png";

const Offer = () => {
  return (
    <div className="offers">
      {/* <div className="offers-left">
            <h1 >Exclusive</h1>
            <h1 >Offers for you</h1>
            <p>ONLY ON BEST SELLERS PRODUCT</p>
         <button className="btn-check-now">Check now</button>
        </div>
        <div className="offers-right"> */}
      <img src={Sizechart} alt="" />
    </div>
    // </div>
  );
};

export default Offer;
