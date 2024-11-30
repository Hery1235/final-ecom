import React, { useEffect, useState } from "react";
import "./ProductList.css";
import cross_icon from "../../Assets/cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";

const ProductList = () => {
  const { allProducts, fetchAllProducts } = useContext(ShopContext);

  useEffect(() => {
    fetchAllProducts(); // Fetch cart items on component mount
  }, []);

  console.log("This is imported product list from context", allProducts);
  // const [allproducts, setAllProducts] = useState([]);

  // const fetchInfo = async () => {
  //   await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/allproducts`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAllProducts(data);
  //     });
  // };

  // useEffect(() => {
  //   fetchInfo();
  // }, []);

  const remove_product = async (id) => {
    await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/removeproduct`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old price</p>
        <p>New price</p>
        <p>Catrgory</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => {
          return (
            <>
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  className="listproduct-product-icon"
                  src={product.image}
                  alt=""
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  onClick={() => {
                    remove_product(product.id);
                  }}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
