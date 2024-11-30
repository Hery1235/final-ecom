import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [orders, setOrder] = useState([]);
  const [allProducts, setallProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchAllProducts();
  }, []);

  console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/allorders`,
        {
          method: "GET",
        }
      );
      const allOrders = await response.json();
      setOrder(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/allproducts`,
        {
          method: "GET",
        }
      );
      console.log("All images");
      console.log(response);
      const allProduct = await response.json();
      setallProducts(allProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      console.log("Trying to delete order with ID:", id);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/deletefromorder`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete order: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Delete response:", result);

      // Refresh the orders list after successful deletion
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const contextValue = {
    orders,
    allProducts,
    deleteOrder,
    fetchOrders,
    fetchAllProducts,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
