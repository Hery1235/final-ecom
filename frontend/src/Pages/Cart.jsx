import React, { useEffect, useContext } from "react";
import CartItems from "../Components/CartItems/CartItems";
import { ShopContext } from "../../src/Context/ShopContext";

const Cart = () => {
  const { fetchCartItems } = useContext(ShopContext);

  useEffect(() => {
    fetchCartItems(); // Fetch cart items on component mount
  }, []); // Only run once on mount

  return (
    <div>
      <CartItems />
    </div>
  );
};

export default Cart;
