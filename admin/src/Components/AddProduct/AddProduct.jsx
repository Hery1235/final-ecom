import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../Assets/upload_area.svg";
import imageCompression from "browser-image-compression";

const AddProduct = () => {
  const [images, setImages] = useState([]); // Changed to handle an array of images
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    discription: "",
    image: "",
    category: "men",
    new_price: "",
    old_price: "",
  });

  const imageHandler = async (e) => {
    setLoading(true); // Set loading to true when starting the image upload
    const files = Array.from(e.target.files); // Convert FileList to an array
    const compressedImages = [];

    const options = {
      maxSizeMB: 1, // Target max size (adjust as needed)
      maxWidthOrHeight: 1024, // Resize dimensions (optional)
      useWebWorker: true, // Use Web Workers for better performance
    };

    // Compress each image file selected
    for (let file of files) {
      try {
        const compressedFile = await imageCompression(file, options);
        compressedImages.push(compressedFile); // Add compressed file to the array
      } catch (err) {
        console.error("Compression error:", err);
        compressedImages.push(file); // If compression fails, use the original file
      }
    }

    // Update state with the compressed (or original) images
    setImages(compressedImages);
    setLoading(false); // Set loading to false after processing the images
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (
      productDetails.name === "" ||
      productDetails.discription === "" ||
      productDetails.category === "" ||
      productDetails.new_price === "" ||
      productDetails.old_price === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      let response;
      let product = productDetails;

      // Prepare FormData
      let formData = new FormData();
      images.forEach((image) => {
        console.log(image); // log the image object to see if it's valid
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
        setLoading(false);
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
          setLoading(false);
          throw new Error(`Add product failed with status: ${response.status}`);
        }

        const addProductData = await response.json();

        if (addProductData.success) {
          setProductDetails({
            name: "",
            discription: "",
            image: "",
            category: "men", // or your default category
            new_price: "",
            old_price: "",
          });

          setImages([]); // if you're using a separate `images` state

          setLoading(false);
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

  return loading ? (
    <div className="spinner"></div>
  ) : (
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
