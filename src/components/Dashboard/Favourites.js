import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import "./Favourites.css";

const FavBar = () => {
  const getFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  };

  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

  useEffect(() => {
    const savedFavorites = getFavoritesFromLocalStorage();
    setFavorites(savedFavorites);
  }, []);

  return (
    <div className="favorites-container">
      <h2>Favorites</h2>
      <div className="favorites">
        {favorites.map((favorite, index) => (
          <div className="gauge-container" key={index}>
            <h3>{favorite.label}</h3>
            <GaugeChart
              id={`gauge-chart-${favorite.id}`}
              nrOfLevels={10}
              colors={[favorite.color, "#eee"]}
              arcWidth={0.3}
              textColor="#000"
            />
            <div style={{ marginTop: "10px", fontSize: "20px", color: "#000" }}>
              {favorite.value} {favorite.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavBar;
