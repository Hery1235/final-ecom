import React, { useState, useEffect } from "react";
import "./RelatedProduct.css";
import Item from "../Item/Item";
const RelatedProduct = () => {
  const [relatedProducts, setrelatedProducts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/popular`)
      .then((response) => response.json())
      .then((data) => {
        setrelatedProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error)); // Add error handling
  }, []);

  // This useEffect will run whenever `all_product` changes
  useEffect(() => {
    // Logs when the state changes
  }, [relatedProducts]);
  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-items">
        {relatedProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item._id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProduct;
