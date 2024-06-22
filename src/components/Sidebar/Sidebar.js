// src/components/Sidebar/Sidebar.js
import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBox,
  faChartLine,
  faGear,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [activeButton, setActiveButton] = React.useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="sidebar">
      <div className="logo-Container">
        <div className="logo-text">
          <h2>Factory</h2>
          <h3>Monitoring System</h3>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/home"
              activeClassName="active"
              onClick={() => handleButtonClick("Home")}>
              <button
                className={`Buttons ${
                  activeButton === "Home" ? "active" : ""
                }`}>
                <span className="icon">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                Home
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              activeClassName="active"
              onClick={() => handleButtonClick("Dashboard")}>
              <button
                className={`Buttons ${
                  activeButton === "Dashboard" ? "active" : ""
                }`}>
                <span className="icon">
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                Dashboard
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inventory"
              activeClassName="active"
              onClick={() => handleButtonClick("Inventory")}>
              <button
                className={`Buttons ${
                  activeButton === "Inventory" ? "active" : ""
                }`}>
                <span className="icon">
                  <FontAwesomeIcon icon={faBox} />
                </span>
                Inventory
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notification"
              activeClassName="active"
              onClick={() => handleButtonClick("Notifications")}>
              <button
                className={`Buttons ${
                  activeButton === "Notifications" ? "active" : ""
                }`}>
                <span className="icon">
                  <FontAwesomeIcon icon={faBell} />
                </span>
                Notifications
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              activeClassName="active"
              onClick={() => handleButtonClick("Settings")}>
              <button
                className={`Buttons ${
                  activeButton === "Settings" ? "active" : ""
                }`}>
                <span className="icon">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                Settings
              </button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
