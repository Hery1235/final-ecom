import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";
const Popular = () => {
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/popular`)
      .then((response) => response.json())
      .then((data) => {
        setPopular(data);
      })
      .catch((error) => console.error("Error fetching products:", error)); // Add error handling
  }, []);

  // This useEffect will run whenever `all_product` changes
  useEffect(() => {
    // Logs when the state changes
  }, [popular]); // Run this effect only when `all_product` is updated
  console.log(popular);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popular.map((item, i) => {
          return (
            <Item
              key={i}
              id={item._id}
              name={item.name}
              image={item.image[0]}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
