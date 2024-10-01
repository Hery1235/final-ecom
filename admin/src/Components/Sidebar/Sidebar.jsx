import React from 'react'
import './Sidebar.css'
import add_product from '../../Assets/Product_cart.svg'
import {Link} from 'react-router-dom'
import list_product_icon from '../../Assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
       <Link to={'/addproduct'} style={{textDecoration:"none"}}> 
         <div className="sidebar-item">
            <img src={add_product} alt="" />
            <p>Add Product</p>
         </div>
       </Link>
       <Link to={'/productlist'} style={{textDecoration:"none"}}> 
         <div className="sidebar-item">
            <img src={list_product_icon} alt="" />
            <p>Product List</p>
         </div>
       </Link>
    </div>
  )
}

export default Sidebar
