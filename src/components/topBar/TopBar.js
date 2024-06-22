import React from "react"
import { NavLink } from 'react-router-dom';
import "./topBar.css"

const TopBar = () => {
  

    return (

        <div className="TopBar">

            <NavLink to="/stock" className="tab" activeClassName="active">Stock</NavLink>
            <NavLink to="/recent-orders" className="tab" activeClassName="active">Recent Orders</NavLink>
            <NavLink to="/new-orders" className="tab" activeClassName="active">New Orders</NavLink>



         </div>
    )
}

export default TopBar;