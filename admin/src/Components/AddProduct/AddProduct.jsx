import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../Assets/upload_area.svg";

const AddProduct = () => {
  const [images, setImages] = useState([]); // Changed to handle an array of images
  const [productDetails, setProductDetails] = useState({
    name: "",
    discription: "",
    image: "",
    category: "Men",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setImages(files); // Update to handle multiple files (store them as an array)
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (
      productDetails.name === "" ||
      productDetails.description === "" ||
      productDetails.category === "" ||
      productDetails.new_price === "" ||
      productDetails.old_price === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    try {
      let response;
      let product = productDetails;

      // Prepare FormData
      let formData = new FormData();
      images.forEach((image) => {
        formData.append("productImages", image); // Append all selected images to FormData
      });

      // Upload the images
      response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/upload`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }

      const uploadData = await response.json();

      if (uploadData.success) {
        product.image = uploadData.image_urls; // Assuming the response returns an array of image URLs

        // Add the product
        response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/addproduct`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        if (!response.ok) {
          throw new Error(`Add product failed with status: ${response.status}`);
        }

        const addProductData = await response.json();

        if (addProductData.success) {
          alert("Product successfully added");
        } else {
          alert("Failed to add product");
        }
      } else {
        alert("Image upload failed. Cannot add product.");
      }
    } catch (error) {
      console.error("Error in Add_Product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Description</p>
        <input
          value={productDetails.discription}
          onChange={changeHandler}
          type="text"
          name="discription"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="addproduct-selector"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kid">Bridal</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={
              images.length > 0 ? URL.createObjectURL(images[0]) : upload_area
            }
            className="addproduct-thumbnail-img"
            alt="Upload"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
          multiple // Added this to allow multiple files
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
