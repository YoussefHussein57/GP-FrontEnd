import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBox,
  faChartLine,
  faGear,
  faHouse,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import { login } from "../../Helpers/apiHelper"; // Assume you have a helper to get current user's role

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);

  // useEffect(() => {
  //   const role = login();
  //   if (role === "admin") {
  //     setIsAdmin(true);
  //   }
  // }, []);

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
              onClick={() => handleButtonClick("Home")}
            >
              <button
                className={`Buttons ${activeButton === "Home" ? "active" : ""}`}
              >
                <span className="Shape">
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
              onClick={() => handleButtonClick("Dashboard")}
            >
              <button
                className={`Buttons ${
                  activeButton === "Dashboard" ? "active" : ""
                }`}
              >
                <span className="Shape">
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
              onClick={() => handleButtonClick("Inventory")}
            >
              <button
                className={`Buttons ${
                  activeButton === "Inventory" ? "active" : ""
                }`}
              >
                <span className="Shape">
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
              onClick={() => handleButtonClick("Notifications")}
            >
              <button
                className={`Buttons ${
                  activeButton === "Notifications" ? "active" : ""
                }`}
              >
                <span className="Shape">
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
              onClick={() => handleButtonClick("Settings")}
            >
              <button
                className={`Buttons ${
                  activeButton === "Settings" ? "active" : ""
                }`}
              >
                <span className="Shape">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                Settings
              </button>
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                activeClassName="active"
                onClick={() => handleButtonClick("Admin")}
              >
                <button
                  className={`Buttons ${
                    activeButton === "Admin" ? "active" : ""
                  }`}
                >
                  <span className="Shape">
                    <FontAwesomeIcon icon={faUserShield} />
                  </span>
                  Admin Panel
                </button>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
