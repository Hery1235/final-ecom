import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [orders, setOrder] = useState([]);
  const [allProducts, setallProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchAllProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/allorders`,
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
      const responce = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/allproducts`,
        {
          method: "GET",
        }
      );
      const all_product = await responce.json();
      setallProducts(all_product);
    } catch (error) {}
  };
  const deleteOrder = async (id) => {
    console.log("Trying to delete ", id);
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/deletefromorder`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    fetchOrders();
  };

  const contextValue = {
    orders,
    allProducts,
    deleteOrder,
    fetchOrders,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
