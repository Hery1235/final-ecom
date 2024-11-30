import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../Assets/upload_area.svg";
const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [producDetails, setProductDetails] = useState({
    name: "",
    discription: "",
    image: "",
    category: "",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...producDetails, [e.target.name]: e.target.value });
    console.log(producDetails);
  };
  console.log("API Base URL:", import.meta.env.VITE_APP_API_BASE_URL);

  const Add_Product = async () => {
    try {
      let response;
      let product = producDetails;

      // Prepare FormData
      let formData = new FormData();
      formData.append("product", image);
      console.log("Form Data:", formData);

      // Upload the image
      response = await fetch(`https://backend-blue-seven.vercel.app/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Do not set 'Content-Type' when using FormData; browser handles it automatically
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }

      const uploadData = await response.json();
      console.log("Upload Response:", uploadData);

      // If upload successful, proceed to add product
      if (uploadData.success) {
        product.image = uploadData.image_url;

        // Add the product
        response = await fetch(
          `https://backend-blue-seven.vercel.app/addproduct`,
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
        console.log("Add Product Response:", addProductData);

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
          value={producDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          id=""
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Discription</p>
        <input
          value={producDetails.discription}
          onChange={changeHandler}
          type="text"
          name="discription"
          id=""
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={producDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            id=""
            placeholder="type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={producDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            id=""
            placeholder="type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Category</p>
        <select
          value={producDetails.category}
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
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        Add{" "}
      </button>
    </div>
  );
};

export default AddProduct;
