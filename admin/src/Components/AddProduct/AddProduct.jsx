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

  const Add_Product = async () => {
    let responceData;
    let product = producDetails;
    let formData = new FormData();
    formData.append("product", image);
    console.log(formData);

    await fetch("http://localhost:4000/upload", {
      // Fixed URL here
      method: "POST",
      headers: {
        Accept: "application/json",
        // Do not set 'Content-Type' when using FormData; the browser will set it automatically
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responceData = data;
      });

    if (responceData.success) {
      product.image = responceData.image_url;

      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success ? alert("Product successfully added") : alert("Failed");
        });
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
