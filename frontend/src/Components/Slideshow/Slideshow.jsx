import React, { useState, useEffect } from "react";
import "./Slideshow.css";

const Slideshow = (props) => {
  let image = [];
  image = props.image;

  console.log("These are the data from baackside ", props.image);
  console.log("And the length is ", image.length);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="slideshow-container">
      <img
        src={image[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="slide-image"
      />

      <button
        onClick={() =>
          setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + image.length) % image.length
          )
        }
        className="prev-slide-btn"
      >
        Previous
      </button>
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length)
        }
        className="next-slide-btn"
      >
        Next
      </button>
    </div>
  );
};

export default Slideshow;
