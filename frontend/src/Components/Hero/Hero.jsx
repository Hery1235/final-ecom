import React from "react";
import "./Hero.css";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero.jpg";
const Hero = ({ scrollToFooter }) => {
  // Function to handle scroll

  return (
    <div className="hero">
      <div className="hero-left">
        <h2>New Arrival only</h2>
        <div>
          <div className="hand-hand-icon">
            <p>New</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collection</p>
          <p>for everyone</p>
        </div>
        <div onClick={scrollToFooter} className="hero-latest-btn">
          <div>Contact Us</div>
          <img className="arrowicon" src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;
