import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js"; // Ensure you're using PayPal components correctly
import "../../frontend/src/CheckoutButton.css";

const CheckoutButton = () => {
  const [showPayPal, setShowPayPal] = useState(false);

  const handleProceedToCheckout = () => {
    console.log("Button clicked ");
    setShowPayPal(true); // Show the PayPal button when "Proceed to Checkout" is clicked
  };

  // Create the order on the backend
  const createOrder = async () => {
    const response = await fetch("http://localhost:4000/create-order", {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const orderData = await response.json();
    console.log("This is the order id ", orderData.id);
    return orderData.id; // Return the order ID to PayPal
  };

  const onApprove = async (data, actions) => {
    try {
      // Capture the order on the backend
      const response = await fetch("http://localhost:4000/capture-order", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const captureData = await response.json();

      if (captureData.status === "success") {
        console.log("Payment successful:", captureData);

        alert("Payment successful!");
      } else {
        console.log("Payment failed:", captureData);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div className="checkout">
      {/* Proceed to Checkout button */}
      <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>

      {/* Show PayPal button after Proceed to Checkout */}
      {showPayPal && (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          fundingSource="paypal"
          style={{ layout: "vertical" }}
        />
      )}
    </div>
  );
};

export default CheckoutButton;
