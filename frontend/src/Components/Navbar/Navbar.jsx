import React, { useState, useContext, useRef } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";
import dropDownIcon from "../Assets/downloaded_dropdown.png";
import ronalogo from "../Assets/ronalogo.jpeg";
const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const [menu, setMenu] = useState("shop");
  const menuRef = useRef();
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={ronalogo} alt="" />
        <p>Rona Design</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={dropDownIcon}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("men");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/men">
            Pak
          </Link>
          {menu === "men" ? <hr /> : <></>}{" "}
        </li>
        <li
          onClick={() => {
            setMenu("women");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/women">
            Afg
          </Link>
          {menu === "women" ? <hr /> : <></>}{" "}
        </li>

        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Bridal
          </Link>
          {menu === "kids" ? <hr /> : <></>}{" "}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            logout
          </button>
        ) : (
          <button>
            <Link to="/login">login</Link>
          </button>
        )}
        {/* 
        <Link to="/cart">
          <img className="cart-icon-btn" src={cart_icon} alt="" />
        </Link> */}
        <div className="nav-cart-counter">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
