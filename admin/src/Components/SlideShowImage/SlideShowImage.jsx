import React, { useState } from "react";
import "./SlideShowImage.css";
import upload_area from "../../Assets/upload_area.svg";

const SlideShowImage = () => {
  const [slideShow, setSlideShow] = useState({
    slideShowCategory: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(false);

  const changeHandler = (e) => {
    setSlideShow({
      ...slideShow,
      slideShowCategory: e.target.value, // Update category
    });
    console.log(slideShow.slideShowCategory);
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]); // Update image
  };

  const Add_SlideShow = async () => {
    let responceData;
    let s = slideShow;
    let formData = new FormData();
    formData.append("product", image);
    console.log(formData);
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
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
      // Handle success response

      console.log("Image uploaded successfully");

      s.imageUrl = responceData.image_url;

      console.log(responceData.image_url);

      await fetch(`${process.env.REACT_APP_API_BASE_URL}/addslideshow`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(s),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success
            ? alert("SlideSHow successfully added")
            : alert("Failed");
        });
    }
  };

  return (
    <div className="main-container">
      <div>
        <p>Category</p>
        <select
          value={slideShow.slideShowCategory}
          onChange={changeHandler}
          name="category"
          className="addproduct-selector"
        >
          <option value="pak">Pak</option>
          <option value="afg">Afg</option>
          <option value="bridal">Bridal</option>
          <option value="jewelry">Jewelry</option>
        </select>
      </div>
      <div>
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
      <button className="addproduct-btn" onClick={Add_SlideShow}>
        Add
      </button>
    </div>
  );
};

export default SlideShowImage;
