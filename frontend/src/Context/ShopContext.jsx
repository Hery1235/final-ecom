import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};

  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const token = localStorage.getItem("auth-token");

      // Fetch products
      const productResponse = await fetch("http://localhost:4000/allproducts");
      const productData = await productResponse.json();
      setAllProduct(productData);

      if (token) {
        const cartResponse = await fetch("http://localhost:4000/getcart", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-type": "application/json",
          },
          body: "",
        });

        const cartData = await cartResponse.json();
        getTotalCartItems();
        getTototalAmount();
        setCartItems(cartData.cartData || {});
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const addToCart = (itemID, selectedSize) => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const authToken = localStorage.getItem("auth-token");
    debugger;
    if (authToken) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: itemID, size: selectedSize }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          fetchCartItems();
          return response.json();
        })
        .then((data) => {
          console.log("Item added to cart successfully:", data);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    } else {
      alert("Please log in to add items to the cart.");
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) => {
      // Create a shallow copy of the previous cart state
      const updatedCart = { ...prev };

      // Iterate over the keys of the updatedCart object
      Object.keys(updatedCart).forEach((index) => {
        const cartItem = updatedCart[index];

        // Check if the productId matches the item you want to update
        if (cartItem.productId === productId) {
          // Decrease the quantity of the specific size by 1
          cartItem[size] = Math.max(0, cartItem[size] - 1);

          console.log(
            `Decreased ${size} size of product ${productId} to:`,
            cartItem[size]
          );

          // Optionally remove the item if all sizes are 0
          const allSizesZero = ["S", "M", "L", "XL", "XXL"].every(
            (sz) => cartItem[sz] === 0
          );

          if (allSizesZero) {
            delete updatedCart[index]; // Remove the item from the cart if all sizes are zero
            console.log(`Removed product ${productId} from cart.`);
          }
        }
      });

      console.log("Updated Cart:", updatedCart);
      return updatedCart; // Return the updated cart
    });

    // Backend code to remove from cart if authenticated
    if (localStorage.getItem("auth-token")) {
      const body = JSON.stringify({ productId, size });
      console.log("Request body:", body);

      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: body, // Send productId and size to the backend
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          fetchCartItems();
          return response.json();
        })
        .then((data) => {
          console.log("Removed from cart:", data);
        })
        .catch((error) => {
          console.error("Error removing from cart:", error);
        });
    }
  };

  const getTototalAmount = async () => {
    if (!cartItems?.length) {
      return 0;
    }

    let totalAmount = 0;
    let totalItems = 0;

    for (let index = 0; index < cartItems.length; index++) {
      const productId = await cartItems[index].productId;

      totalItems =
        totalItems +
        cartItems[index].S +
        cartItems[index].M +
        cartItems[index].L +
        cartItems[index].XL +
        cartItems[index].XXL;

      try {
        const response = await fetch(
          `http://localhost:4000/allproducts/${productId}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const productData = await response.json();
        let price = totalItems * productData.new_price;
        totalAmount = totalAmount + price;

        // return productData;
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    return totalAmount;
  };

  const getTotalCartItems = () => {
    if (!cartItems?.length) {
      return 0;
    }

    let totalItems = 0;

    for (let index = 0; index < cartItems.length; index++) {
      totalItems =
        totalItems +
        cartItems[index].S +
        cartItems[index].M +
        cartItems[index].L +
        cartItems[index].XL +
        cartItems[index].XXL;
    }

    console.log("Total Items:", totalItems);
    return totalItems;
  };

  const contextValue = {
    getTotalCartItems,
    getTototalAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    fetchCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
