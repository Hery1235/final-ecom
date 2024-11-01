import React, { useContext, useEffect } from "react";
import "./Orders.css";
import { ShopContext } from "../../Context/ShopContext";

const Orders = () => {
  const { orders, allProducts, deleteOrder, fetchOrders } =
    useContext(ShopContext);
  console.log("Here is my orders array:", orders);
  console.log("All products are here ", allProducts);

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="main-container">
      {orders.map((item, i) => {
        return (
          <div className="card" key={i}>
            <div className="card-container">
              <div className="inside">
                <h2>Order Name: </h2>
                <h2>{item.oderName}</h2>

                <button onClick={() => deleteOrder(item._id)}>Done</button>
              </div>

              <div className="inside">
                {" "}
                <p>Phone Number: </p>
                <p>{item.orderPhoneNumber}</p>
              </div>
              <div className="inside">
                {" "}
                <p>Email : </p>
                <p>{item.orderEmail}</p>
              </div>
              <div className="inside">
                {" "}
                <p>Email Address: </p>
                <p>{item.orderAdress}</p>
              </div>
              <div className="inside">
                <p>Total Paid: </p>
                <p>${item.totalPaid}</p>
              </div>
              <div className="inside">
                {" "}
                <p>Date: </p>
                <p>{item.date}</p>
              </div>

              <div className="cart-data">
                <h4>Cart Details:</h4>
                <ul>
                  {item.cartData?.map((cartItem, index) => {
                    const { productId, S, M, L, XL, XXL } = cartItem;
                    const product = allProducts.find((p) => p._id == productId);
                    if (!product) {
                      console.log(
                        `Product not found for the product ", ${productId}`
                      );
                    }
                    const sizes = [
                      { size: "S", quantity: S },
                      { size: "M", quantity: M },
                      { size: "L", quantity: L },
                      { size: "XL", quantity: XL },
                      { size: "XXL", quantity: XXL },
                    ];
                    const availableSizes = sizes.filter(
                      (size) => size.quantity > 0
                    );
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

                              <button className="cartitems-quantity">
                                {quantity}
                              </button>
                              <p>
                                ${(product.new_price * quantity).toFixed(2)}
                              </p>
                            </div>
                            <hr />
                          </div>
                        );
                      }
                      return null;
                    });
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
