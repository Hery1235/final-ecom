import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

import CheckoutButton from "../../CheckoutButton"; // Import the PayPal button
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const CartItems = () => {
  const {
    getTototalAmount,
    all_product = [],
    cartItems = {},
    removeFromCart,
    loading,
  } = useContext(ShopContext);

  const [totalAmount, setTotalAmount] = useState(null); // State to store the total amount

  // Function to get total amount and update state
  const fetchTotalAmount = async () => {
    try {
      const amount = await getTototalAmount(); // Wait for the async function to resolve

      setTotalAmount(amount); // Update the state with the resolved value
    } catch (error) {
      console.error("Error fetching total amount:", error);
    }
  };

  // Use useEffect to fetch total amount when component mounts
  useEffect(() => {
    fetchTotalAmount();
  }, [cartItems]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(cartItems);

  // Convert cartItems to an array if it is an object
  const cartItemsArray = Array.isArray(cartItems)
    ? cartItems
    : Object.values(cartItems);
  //   console.log("Tranfered cart items are ", cartItemsArray);

  if (!cartItemsArray || cartItemsArray.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="cartitems">
      <div className="cartitem-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      <div>
        {cartItemsArray.map((cartItem, index) => {
          const { productId, S, M, L, XL, XXL } = cartItem;

          // Compare productId with _id (which is the MongoDB ObjectId)
          const product = all_product.find((p) => p._id === productId);

          if (!product) {
            console.log(`Product not found for productId: ${productId}`);
            return null; // Avoid rendering if product is not found
          }

          const sizes = [
            { size: "S", quantity: S },
            { size: "M", quantity: M },
            { size: "L", quantity: L },
            { size: "XL", quantity: XL },
            { size: "XXL", quantity: XXL },
          ];

          const availableSizes = sizes.filter((size) => size.quantity > 0);

          return availableSizes.map(({ size, quantity }) => {
            if (quantity > 0) {
              return (
                <div key={`${productId}-${size}-${index}`}>
                  <div className="cartitems-format cartitem-format-main">
                    <img
                      className="carticon-product-icon"
                      src={product.image}
                      alt={product.name}
                    />
                    <p>{product.name}</p>
                    <p>{size}</p>
                    <p>${product.new_price.toFixed(2)}</p>
                    <button className="cartitems-quantity">{quantity}</button>
                    <p>${(product.new_price * quantity).toFixed(2)}</p>
                    <img
                      className="carticon-remove-item"
                      src={remove_icon}
                      onClick={() => removeFromCart(productId, size)}
                      alt="Remove item"
                    />
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          });
        })}
      </div>

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${totalAmount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping free</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <p>${totalAmount}</p>
            </div>
          </div>
          {/* <Link to = {`/checkout`}> <button>Proceed to Checkout</button></Link> */}
          {/* <button>Proceed to Checkout</button> */}
          <PayPalScriptProvider
            options={{
              "client-id":
                "Aaei0zojyru90c49LxduL7vBe1VmGJaqF5DCUiqOzi_RH0TOfuyXX9Mwh_caFsTPzT_iAjUflyl1rKgl", // Your default PayPal Client ID
            }}
          >
            <CheckoutButton />
          </PayPalScriptProvider>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code enter it here</p>
          <div className="cartitems-promobox">
            <input placeholder="Promo Code" type="text" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
