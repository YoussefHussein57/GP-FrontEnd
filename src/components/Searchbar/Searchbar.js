import React from "react";
import "./Searchbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEnvelope,
  faBell,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const Searchbar = () => {
  return (
    <div className="searchbar my-4 h-12 w-10/12 mx-auto px-4">
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      <input type="text" placeholder="Search anything" />
      <div className="icons">
        <FontAwesomeIcon icon={faEnvelope} className="search-shape" />
        <FontAwesomeIcon icon={faBell} className="search-shape" />
        <FontAwesomeIcon icon={faQuestionCircle} className="search-shape" />
      </div>
    </div>
  );
};

export default Searchbar;
