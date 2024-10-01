import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrums from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProducts/RelatedProduct';

const Product = () => {
  const [productData, setProductData] = useState(null);
  const { productId } = useParams(); // Get productId from URL params

  // Fetch the product data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:4000/allproducts/${productId}`)
      .then((response) => response.json()) // Parse the response to JSON
      .then((data) => setProductData(data)) // Update the state with product data
      .catch((error) => console.error('Error fetching product:', error)); // Handle any errors
  }, [productId]);

  // If product data is not yet loaded, show a placeholder or nothing
  if (!productData) {
    return <p>Loading...</p>; // You can return a loading spinner or message here
  }

  // Render the product data once it's loaded
  return (
    <div>
      <Breadcrums product={productData} />
      <ProductDisplay product={productData} />
      <DescriptionBox product={productData} />
      <RelatedProduct product={productData} />
    </div>
  );
};

export default Product;


