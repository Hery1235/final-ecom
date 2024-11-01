import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = (productData) => {
  return (
    <div className="description">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          {productData.description
            ? productData.description
            : "No description found"}
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
