import React from "react";
import "./Footer.css";
import ronalogo from "../Assets/ronalogo.jpeg";

import ShoppinImage from "../Assets/logo_big.png";
import instagram_icon from "../Assets/instagram_icon.png";
import pintester_icon from "../Assets/pintester_icon.png";
import whatsapp_icon from "../Assets/whatsapp_icon.png";
const Footer = () => {
  const phoneNumber = "+447908238907";
  const instagramUsername = "rona.designs";
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={ronalogo} alt="" />
        <p>RONA DESIGN</p>
      </div>

      <div className="contactdetails">
        <p>+447908238907</p>
        <p> RONA.DESIGN122@gmail.com </p>
        <p>London, UK</p>
      </div>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a
            href={`https://www.instagram.com/${instagramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Instagram icon (replace the src with your actual Instagram icon) */}
            <img
              src={instagram_icon} // Replace with your icon's path
              alt="Instagram"
              // Adjust the size as needed
            />
          </a>
        </div>

        <div className="footer-icons-container">
          {/* Clicking the WhatsApp icon will open a chat with the given number */}
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Assuming you have your WhatsApp icon as an image */}
            <img
              src={whatsapp_icon} // Replace with the correct path to your icon
              alt="WhatsApp"
              // Adjust icon size as needed
            />
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Right Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
