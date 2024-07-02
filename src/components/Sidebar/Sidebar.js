import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBox,
  faChartLine,
  faGear,
  faHouse,
  faUserShield,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import { login } from "../../Helpers/apiHelper";

const Sidebar = ({ email, password }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // State for sidebar collapse/expand
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const userEmail = email || storedEmail;
    const userPassword = password || storedPassword;

    if (userEmail && userPassword) {
      const checkRole = async () => {
        const response = await login(userEmail, userPassword);
        console.log("Login response in Sidebar:", response);
        if (response && response.role === "ADMIN") {
          setIsAdmin(true);
        }
      };
      checkRole();
    }
  }, [email, password]); // Trigger useEffect when email or password changes

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-Container">
        <div className="logo-text">
          {!collapsed && (
            <>
              <h2>Factory</h2>
              <h3>Monitoring System</h3>
            </>
          )}
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
                {!collapsed && <span className="ButtonText">Home</span>}
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
                {!collapsed && <span className="ButtonText">Dashboard</span>}
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
                {!collapsed && <span className="ButtonText">Inventory</span>}
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
                {!collapsed && (
                  <span className="ButtonText">Notifications</span>
                )}
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
                {!collapsed && <span className="ButtonText">Settings</span>}
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
                  {!collapsed && (
                    <span className="ButtonText">Admin Panel</span>
                  )}
                </button>
              </NavLink>
            </li>
          )}
          <li>
            <button
              className={`Buttons ${activeButton === "Logout" ? "active" : ""}`}
              onClick={handleLogout}
            >
              <span className="Shape">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              {!collapsed && <span className="ButtonText">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
      <div className="toggle-sidebar" onClick={toggleSidebar}>
        {collapsed ? (
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        ) : (
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
