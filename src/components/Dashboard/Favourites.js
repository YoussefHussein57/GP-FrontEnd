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
            <div className="gauge-chart-wrapper">
              <GaugeChart
                id={`gauge-chart-${favorite.id}`}
                nrOfLevels={10}
                arcsLength={[0.3, 0.3, 0.3, 0.3]}
                colors={[favorite.color, "#eee"]}
                arcPadding={0.02}
                arcWidth={0.2}
                hideText
              />
            </div>
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
