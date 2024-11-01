import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import "./CSS/ShopCategory.css";
import Slideshow from "../Components/Slideshow/Slideshow";

const ShopCategory = (props) => {
  const { all_product, slideshow } = useContext(ShopContext);
  // const pakslideimages = slideshow.filter(
  //   (item) => item.category === props.slideshowcategory
  // );

  const pakImages = slideshow.map((item) => item.image);

  return (
    <div className="shop-catogory">
      {/* <img className="shopcategory-banner" src={props.banner} alt="" /> */}
      <Slideshow image={pakImages} />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12 </span>out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item._id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default ShopCategory;
