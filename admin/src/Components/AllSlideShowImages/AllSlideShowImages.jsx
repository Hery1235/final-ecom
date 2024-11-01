import React, { useEffect, useState } from "react";
import "./AllSlideShowImages.css";
import cross_icon from "../../Assets/cross_icon.png";
const AllSlideShowImages = () => {
  const [slideShowList, setslideShowList] = useState([]);
  const fetchslideShowList = async () => {
    await fetch("http://localhost:4000/allslideshow")
      .then((res) => res.json())
      .then((data) => {
        setslideShowList(data);
      });
  };
  const removeSlideSHow = async (id) => {
    await fetch("http://localhost:4000/removeslideshow", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchslideShowList();
  };
  useEffect(() => {
    fetchslideShowList();
  }, []);

  return (
    <div className="list-product">
      <h1>All SlideShow images List</h1>
      <div className="listproduct-format-main">
        <p>Slide</p>
        <p>Catrgory</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {slideShowList.map((slide, index) => {
          return (
            <>
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  className="listproduct-product-icon"
                  src={slide.image}
                  alt=""
                />

                <p>{slide.category}</p>
                <img
                  onClick={() => {
                    removeSlideSHow(slide.id);
                  }}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default AllSlideShowImages;
