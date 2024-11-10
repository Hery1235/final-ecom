import React, { useEffect, useState } from "react";
import "./newcollections.css";
import new_collection from "../Assets/new_collections";
import Item from "../Item/Item";

const Newcollections = () => {
  const [newcollection, setNewCollection] = useState([]);
  useEffect(() => {
    fetch("process.env.REACT_APP_API_BASE_URL/newcollection")
      .then((response) => response.json())
      .then((data) => {
        setNewCollection(data);
      })
      .catch((error) => console.error("Error fetching products:", error)); // Add error handling
  }, []);

  // This useEffect will run whenever `all_product` changes
  useEffect(() => {
    // Logs when the state changes
  }, [newcollection]); // Run this effect only when `all_product` is updated

  return (
    <div className="new-collections">
      <h1>New collections</h1>
      <hr className="line" />
      <div className="collections">
        {newcollection.map((item, i) => {
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

export default Newcollections;
