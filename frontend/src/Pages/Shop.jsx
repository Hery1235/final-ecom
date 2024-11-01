import React from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offer from "../Components/Offer/Offer";
import Newcollection from "../Components/NewCollections/newcollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";

const Shop = ({ footerRef }) => {
  // Function to scroll to the footer
  const scrollToFooter = () => {
    if (footerRef.current) {
      // Ensure the ref exists
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Hero scrollToFooter={scrollToFooter} />
      <Popular />
      <Offer />
      <Newcollection />
      {/* <NewsLetter /> */}
      <div ref={footerRef}></div>
      {/* No need for a footer reference div here since it's already in App.js */}
    </div>
  );
};

export default Shop;
