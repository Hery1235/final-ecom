import React from "react";
import "./Sidebar.css";
import add_product from "../../Assets/Product_Cart.svg";
import { Link } from "react-router-dom";
import list_product_icon from "../../Assets/Product_list_icon.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/productlist"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={"/addslideshowimage"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product} alt="" />
          <p>Add Slide Images</p>
        </div>
      </Link>
      <Link to={"/allslideshowimages"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>ALl Slide Images</p>
        </div>
      </Link>

      <Link to={"/orders"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item orderbtn">
          <img src={list_product_icon} alt="" />
          <p>My Orders </p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
