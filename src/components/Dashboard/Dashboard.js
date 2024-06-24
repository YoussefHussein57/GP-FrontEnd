// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import "./Dashboard.css";

const Dashboard = () => {
  const initialFavorites = [
    { name: "Refrigerator 1", status: true },
    { name: "Refrigerator 2", status: false },
    { name: "Refrigerator 3", status: true },
    { name: "Refrigerator 4", status: true },
  ];

  const getFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : initialFavorites;
  };

  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());
  const [moldTemperature, setMoldTemperature] = useState(2500);
  const [humidity, setHumidity] = useState(25);

  const toggleSwitch = (index) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites];
      updatedFavorites[index].status = !updatedFavorites[index].status;
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const savedFavorites = getFavoritesFromLocalStorage();
    setFavorites(savedFavorites);
  }, []);

  return (
    <div className="favorites-container">
      <h2>Favorites</h2>
      <div className="favorites">
        {favorites.map((favorite, index) => (
          <div className="switch-container" key={index}>
            <div className="switch" onClick={() => toggleSwitch(index)}>
              <label className="switch-label">
                {favorite.status ? "ON" : "OFF"}
              </label>
              <input type="checkbox" checked={favorite.status} readOnly />
              <span className="slider round"></span>
            </div>
            <p>{favorite.name}</p>
          </div>
        ))}
      </div>

      <div className="gauges">
        <div className="gauge-container">
          <h3>Mold Temperature</h3>
          <GaugeChart
            id="mold-temperature-gauge"
            nrOfLevels={30}
            percent={moldTemperature / 5000}
            textColor="#000"
            colors={["#FF4D4D", "#FF7D4D"]}
          />
          <p>
            Maximum Hours to Register <span>20</span>
          </p>
        </div>

        <div className="gauge-container">
          <h3>Humidity</h3>
          <GaugeChart
            id="humidity-gauge"
            nrOfLevels={30}
            percent={humidity / 100}
            textColor="#000"
            colors={["#8BC34A", "#C8E6C9"]}
          />
          <p>
            Maximum Hours to Register <span>20</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
