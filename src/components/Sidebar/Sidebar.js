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
import LogoImg from "../../Images/Helwan_Logo.png";

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
  console.log("From Sidebar ", password);
  return (
    <div
      className={`bg-primary  p-4 flex flex-col items-center justify-evenly overflow-y-auto overflow-x-clip min-w-15  sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <Logo collapsed={collapsed} />
      <nav className="w-full">
        <ul className="flex flex-col gap-8">
          <NavigationButton
            buttonName="Home"
            navigatePath={"/home"}
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
            collapsed={collapsed}
            icon={faHouse}
          />
          <NavigationButton
            buttonName="Dashboard"
            navigatePath={"/dashboard"}
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
            collapsed={collapsed}
            icon={faChartLine}
          />

          <NavigationButton
            buttonName="Inventory"
            navigatePath={"/inventory"}
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
            collapsed={collapsed}
            icon={faBox}
          />

          <NavigationButton
            buttonName="Notifications"
            navigatePath={"/notification"}
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
            collapsed={collapsed}
            icon={faBell}
          />

          <NavigationButton
            buttonName="Settings"
            navigatePath={"/settings"}
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
            collapsed={collapsed}
            icon={faGear}
          />

          {isAdmin && (
            <NavigationButton
              buttonName="Admin Panel"
              navigatePath={"/admin"}
              activeButton={activeButton}
              handleButtonClick={handleButtonClick}
              collapsed={collapsed}
              icon={faUserShield}
            />
          )}
          <li>
            <button
              className={`Buttons flex gap-2 px-1 ${
                activeButton === "Logout" ? "active" : ""
              }`}
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

      {/*Toggle Side Bar Button*/}
      <div
        className="bg-accent rounded-full flex items-center justify-center w-8 h-8 m-16 text-white"
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        ) : (
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        )}
      </div>
    </div>
  );
};

function NavigationButton({
  buttonName,
  activeButton,
  handleButtonClick,
  collapsed,
  navigatePath,
  icon,
}) {
  return (
    <li>
      <NavLink
        to={navigatePath}
        activeClassName="active"
        onClick={() => handleButtonClick(buttonName)}
      >
        <button
          className={`Buttons gap-2 px-1 ${
            activeButton === buttonName ? "active" : ""
          }`}
        >
          <span className="Shape">
            <FontAwesomeIcon icon={icon} />
          </span>
          {!collapsed && <span className=" text-sm">{buttonName}</span>}
        </button>
      </NavLink>
    </li>
  );
}

function Logo({ collapsed }) {
  return (
    <div className="mb-8 flex flex-col items-center justify-center">
      <img
        src={LogoImg}
        alt="Helwan Logo"
        className={`aspect-square w-full `}
      />
      {!collapsed && (
        <>
          <h1 className="text-xl font-bold text-center">Factory</h1>
          <h3 className="text-lg font-bold text-center w-full">
            Monitoring System
          </h3>
        </>
      )}
    </div>
  );
}

export default Sidebar;
