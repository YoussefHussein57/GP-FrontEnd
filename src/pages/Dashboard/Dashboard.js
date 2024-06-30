import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import Modal from "react-modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getFactroiesByUser,
  getLast10Readings,
  appendNewReading,
} from "../../Helpers/apiHelper";
import "./Dashboard.css";

Modal.setAppElement("#root");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dashboards = [];

const Dashboard = () => {
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false);
  const [gaugeData, setGaugeData] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const { factories: factoriesData } = await getFactroiesByUser();

        // Log fetched data for debugging
        console.log("Fetched factories data:", factoriesData.data.factories);

        if (!Array.isArray(factoriesData.data.factories)) {
          console.error(
            "Factories data is not an array:",
            factoriesData.data.factories
          );
          return;
        }

        setFactories(factoriesData.data.factories);

        // Log factory names
        console.log(
          "Fetched factories:",
          factoriesData.data.factories.map((factory) => factory.name)
        );
        factoriesData.data.factories[0].assets.forEach((asset) => {
          const parsedDashboard = {
            id: asset._id,
            title: asset.name,
            gauges: asset.sensors.map((sensor) => ({
              id: sensor._id,
              value: sensor.lastReading,
              label: sensor.name,
              unit: "%",
              max: 100,
              color: "#8BC34A",
            })),
          };
          console.log(parsedDashboard);
          dashboards.push(parsedDashboard);
        });
      } catch (error) {
        console.error("Error fetching factories:", error);
      }
    };

    fetchFactories();
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFactoryChange = async (e) => {
    const factoryId = e.target.value;
    setSelectedFactory(factoryId);

    const readingData = {
      bn: "temperature",
      bv: 293,
      n: "nozzle temperature",
      u: "C",
      v: 292,
      s: "s_value",
      t: "1718879726",
    };
    await appendNewReading(factoryId, readingData);
  };

  const openModal = async (gauge) => {
    setSelectedGauge(gauge);
    const readings = await getLast10Readings("66757c879087f55851cfe033");
    setGaugeData(readings || []);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGauge(null);
  };

  const toggleLed = () => {
    setIsLedOn((prevStatus) => !prevStatus);
    console.log(`LED is now ${!isLedOn ? "ON" : "OFF"}`);
  };

  const toggleFavorite = (gauge) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === gauge.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== gauge.id);
    } else {
      if (favorites.length >= 4) {
        alert("You can only add up to 4 favorites.");
        return;
      }
      updatedFavorites = [...favorites, gauge];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const data = {
    labels: Array.from({ length: 10 }, (_, i) => i + 1),
    datasets: [
      {
        label: selectedGauge ? `${selectedGauge.label} Over Time` : "",
        data: Array.isArray(gaugeData)
          ? gaugeData.map((reading) => reading.value)
          : [],
        fill: false,
        backgroundColor: selectedGauge ? selectedGauge.color : "#000",
        borderColor: selectedGauge ? selectedGauge.color : "#000",
      },
    ],
  };

  return (
    <main>
      <div className="dropdown-container">
        <select
          id="factories"
          onChange={handleFactoryChange}
          className="dropdown"
          value={selectedFactory || ""}
        >
          <option value="">Select a factory</option>
          {factories.map((factory) => (
            <option key={factory._id} value={factory._id}>
              {factory.name}
            </option>
          ))}
        </select>
      </div>
      <div className="dashboard-container">
        <h2>Dashboard</h2>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          dashboards.map((dashboard) => (
            <div key={dashboard.id} className="dashboard-wrapper">
              <div className="dashboard">
                <h3>{dashboard.title}</h3>
                <div className="gauges">
                  {dashboard.gauges.map((gauge) => (
                    <div
                      className="gauge-container"
                      key={gauge.id}
                      onClick={() => openModal(gauge)}
                    >
                      <h3>{gauge.label}</h3>
                      <GaugeChart
                        id={`gauge-chart-${gauge.id}`}
                        nrOfLevels={10}
                        percent={gauge.value}
                        colors={[gauge.color, "#eee"]}
                        arcWidth={0.3}
                        textColor="#000"
                      />
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "20px",
                          color: "#000",
                        }}
                      >
                        {gauge.value * gauge.max} {gauge.unit}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(gauge);
                        }}
                        className={`star-button ${
                          favorites.some((fav) => fav.id === gauge.id)
                            ? "favorite"
                            : ""
                        }`}
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Gauge Details"
          className="modal"
          overlayClassName="modal-overlay"
        >
          {selectedGauge && (
            <>
              <h2>{selectedGauge.label} Details</h2>
              <Line data={data} />
              <button onClick={toggleLed} className="control-button">
                Toggle LED ({isLedOn ? "ON" : "OFF"})
              </button>
              <button onClick={closeModal} className="close-button">
                Close
              </button>
            </>
          )}
        </Modal>
      </div>
    </main>
  );
};

export default Dashboard;
