import React, { useContext, useState } from 'react'
import  './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {

    const {product} = props;
    const {addToCart} = useContext(ShopContext)
    const [selectedSize, setSelectedSize] = useState("");

    const handleClick = (Size)=>{
     setSelectedSize(Size);
    }
  return (
    
    <div className='productdisplay'>

        <div className='productdisplay-left'>
          <div className="productdisplay-img-list">
            
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
             </div>
         <div className="productdisplay-image">
             <img className='productdisplay-main-img' src={product.image} alt="" />
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
            <div className="productdisplay-right-prices-old">{product.old_price}</div>
            <div className="productdisplay-right-prices-new">${product.new_price}</div>
           </div>

           <div className="productdisplay-right-description">
           A product description is a form of marketing copy used to describe and explain the benefits of your product. In other words, it provides all the information and details of your product on your ecommerce site. These product details can be one sentence, a short paragraph or bulleted. They can be serious, funny or quirky           </div>

           <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-sizes">
                
            { selectedSize==="S"?<div style={{ background: 'white', fontWeight: 'bold' }} onClick={()=>{handleClick("S")}}>S</div>:<div onClick={()=>{handleClick("S")}}>S</div>}
            { selectedSize==="M"?<div style={{ background: 'white', fontWeight: 'bold' }} onClick={()=>{handleClick("M")}}>M</div>:<div onClick={()=>{handleClick("M")}}>M</div>}
            { selectedSize==="L"?<div style={{ background: 'white', fontWeight: 'bold' }} onClick={()=>{handleClick("L")}}>L</div>:<div onClick={()=>{handleClick("L")}}>L</div>}
            { selectedSize==="XL"?<div style={{ background: 'white', fontWeight: 'bold' }} onClick={()=>{handleClick("XL")}}>XL</div>:<div onClick={()=>{handleClick("XL")}}>XL</div>}
            { selectedSize==="XXL"?<div style={{ background: 'white', fontWeight: 'bold' }} onClick={()=>{handleClick("XXL")}}>XXL</div>:<div onClick={()=>{handleClick("XXL")}}>XXL</div>}
            </div>
           </div>

            
           <button  onClick={()=>{addToCart(product._id,selectedSize)}}>ADD TO CART</button>
           <p className="productdisplay-right-category"><span>Category :</span>Women , T-Shirt, Crop Top</p>
           <p className="productdisplay-right-category"><span>Tags :</span>Modern , Latest</p>

        </div>
      
    </div>
  )
}

export default ProductDisplay
