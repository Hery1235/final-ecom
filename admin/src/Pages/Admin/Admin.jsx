import React from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ProductList from "../../Components/ProductList/ProductList";
import SlideShowImage from "../../Components/SlideShowImage/SlideShowImage";
import AllSlideShowImages from "../../Components/AllSlideShowImages/AllSlideShowImages";
import Orders from "../../Components/Orders/Orders";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/addslideshowimage" element={<SlideShowImage />} />
        <Route path="allslideshowimages" element={<AllSlideShowImages />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default Admin;
