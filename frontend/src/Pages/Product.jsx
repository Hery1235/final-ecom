import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProduct from "../Components/RelatedProducts/RelatedProduct";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const { productId } = useParams(); // Get productId from URL params

  // Fetch the product data when the component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `process.env.REACT_APP_API_BASE_URL/allproducts/${productId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductData(); // Call the function
  }, [productId]);

  // If product data is not yet loaded, show a placeholder or nothing
  if (!productData) {
    return <p>Loading...</p>;
  }

  // Render the product data once it's loaded
  console.log("ppppp data ", productData);
  return (
    <div>
      <Breadcrums product={productData} />
      <ProductDisplay product={productData} />
      <DescriptionBox product={productData} />
      {/* <RelatedProduct product={productData} /> */}
    </div>
  );
};

export default Product;
