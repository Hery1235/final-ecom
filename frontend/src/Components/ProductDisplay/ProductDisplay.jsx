import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  console.log("My products");
  console.log(product);
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.image.length - 1 : prevIndex - 1
    );
  };
  const handleClick = (Size) => {
    setSelectedSize(Size);
  };
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image[0]} alt="" />
          <img src={product.image[0]} alt="" />
          <img src={product.image[0]} alt="" />
          <img src={product.image[0]} alt="" />
        </div>
        <div className="productdisplay-image">
          <div className="productdisplay-main-img-container">
            <img
              className="productdisplay-main-img"
              src={product.image[currentImageIndex]} // Use the current image URL based on the index
              alt={`Product image ${currentImageIndex + 1}`}
            />
          </div>

          {/* Slideshow controls */}
          <div className="slideshow-controls">
            <button onClick={prevImage} className="next-btn">
              Previous
            </button>
            <button onClick={nextImage} className="next-btn">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="productdisplay--right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-prices-old">
            {product.old_price}
          </div>
          <div className="productdisplay-right-prices-new">
            ${product.new_price}
          </div>
        </div>

        <div className="productdisplay-right-description">
          {product.discription
            ? product.discription
            : "No description availible"}
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {selectedSize === "S" ? (
              <div
                style={{ background: "white", fontWeight: "bold" }}
                onClick={() => {
                  handleClick("S");
                }}
              >
                S
              </div>
            ) : (
              <div
                onClick={() => {
                  handleClick("S");
                }}
              >
                S
              </div>
            )}
            {selectedSize === "M" ? (
              <div
                style={{ background: "white", fontWeight: "bold" }}
                onClick={() => {
                  handleClick("M");
                }}
              >
                M
              </div>
            ) : (
              <div
                onClick={() => {
                  handleClick("M");
                }}
              >
                M
              </div>
            )}
            {selectedSize === "L" ? (
              <div
                style={{ background: "white", fontWeight: "bold" }}
                onClick={() => {
                  handleClick("L");
                }}
              >
                L
              </div>
            ) : (
              <div
                onClick={() => {
                  handleClick("L");
                }}
              >
                L
              </div>
            )}
            {selectedSize === "XL" ? (
              <div
                style={{ background: "white", fontWeight: "bold" }}
                onClick={() => {
                  handleClick("XL");
                }}
              >
                XL
              </div>
            ) : (
              <div
                onClick={() => {
                  handleClick("XL");
                }}
              >
                XL
              </div>
            )}
            {selectedSize === "XXL" ? (
              <div
                style={{ background: "white", fontWeight: "bold" }}
                onClick={() => {
                  handleClick("XXL");
                }}
              >
                XXL
              </div>
            ) : (
              <div
                onClick={() => {
                  handleClick("XXL");
                }}
              >
                XXL
              </div>
            )}
          </div>
        </div>
        <br></br>
        <div className="note">
          <span>Note :</span> Online ordering will be available on our website
          soon. In the meantime, please take a screenshot of the desired dress
          and click the WhatsApp icon under the 'Contact Us' section to share it
          with us for placing your order.
        </div>

        {/* <button
          onClick={() => {
            addToCart(product._id, selectedSize);
          }}
        >
          ADD TO CART
        </button> */}
        {/* <p className="productdisplay-right-category">
          <span>Category :</span>Women , T-Shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span>Modern , Latest
        </p> */}
      </div>
    </div>
  );
};

export default ProductDisplay;
