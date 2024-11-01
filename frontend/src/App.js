import React, { useRef } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import LoginSignup from "./Pages/LoginSignup";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Shop from "./Pages/Shop";
import Footer from "./Components/Footer/Footer";
import mensBanner from "./Components/Assets/banner_mens.png";
import womenBanner from "./Components/Assets/banner_women.png";
import kidsBanner from "./Components/Assets/banner_kids.png";

function App() {
  const footerRef = useRef(null); // Create a ref for the footer

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop footerRef={footerRef} />} />
          <Route
            path="/men"
            element={
              <ShopCategory
                slideshowcategory="pak"
                category="men"
                banner={mensBanner}
              />
            }
          />
          <Route
            path="/women"
            element={
              <ShopCategory
                slideshowcategory="afg"
                category="women"
                banner={womenBanner}
              />
            }
          />
          <Route
            path="/kids"
            element={
              <ShopCategory
                slideshowcategory="bridal"
                category="kid"
                banner={kidsBanner}
              />
            }
          />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
        <div ref={footerRef}></div> {/* Reference for scrolling */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
