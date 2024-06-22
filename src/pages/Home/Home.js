// src/pages/Home/Home.js
import React from "react";
import "./Home.css";
import Notifications from "../../components/Notifications/Notifications";
import Dashboard from "../../components/Dashboard/Dashboard";
import Searchbar from "../../components/Searchbar/Searchbar"; // Assuming you have a Searchbar component

function Home() {
  return (
    <div className="home">
      <main>
        <Searchbar />
        <div className="column">
          <Notifications />
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default Home;
