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

// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import Checkout from "./Components/Checkout/Checkout";

// const initialOptions = {
//   "client-id": "YOUR-CLIENT-ID-HERE",
//   currency: "USD",
//   intent: "capture",
// };

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* <PayPalScriptProvider options={initialOptions}> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route
            path="/men"
            element={<ShopCategory category="men" banner={mensBanner} />}
          />
          <Route
            path="/women"
            element={<ShopCategory category="women" banner={womenBanner} />}
          />
          <Route
            path="/kids"
            element={<ShopCategory category="kid" banner={kidsBanner} />}
          />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />

          {/* <Route path="/checkout" element={<Checkout />} /> */}
        </Routes>
        <Footer />
        {/* </PayPalScriptProvider> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
