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
  createFactory,
  createAsset, // Import the createAsset function
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

const Dashboard = () => {
  const [factories, setFactories] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false);
  const [gaugeData, setGaugeData] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAddFactoryModalOpen, setIsAddFactoryModalOpen] = useState(false); // State to manage add factory modal visibility
  const [newFactoryName, setNewFactoryName] = useState(""); // State to manage new factory name input
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false); // State to manage add asset modal visibility
  const [newAssetName, setNewAssetName] = useState(""); // State to manage new asset name input
  const [newAssetType, setNewAssetType] = useState(""); // State to manage new asset type input

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const { factories: factoriesData } = await getFactroiesByUser();

        console.log("Fetched factories data:", factoriesData.data.factories);

        if (!Array.isArray(factoriesData.data.factories)) {
          console.error(
            "Factories data is not an array:",
            factoriesData.data.factories
          );
          return;
        }
        localStorage.setItem(
          "factories",
          JSON.stringify(factoriesData.data.factories)
        );
        setFactories(factoriesData.data.factories);
      } catch (error) {
        console.error("Error fetching factories:", error);
      }
    };

    const savedFactories = JSON.parse(localStorage.getItem("factories")) || [];
    if (savedFactories.length > 0) {
      setFactories(savedFactories);
    } else {
      fetchFactories();
    }

    const savedDashboards =
      JSON.parse(localStorage.getItem("dashboards")) || [];
    setDashboards(savedDashboards);

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    const savedSelectedFactory = localStorage.getItem("selectedFactory") || "";
    setSelectedFactory(savedSelectedFactory);
  }, []);

  const handleFactoryChange = (e) => {
    const factoryId = e.target.value;
    setSelectedFactory(factoryId);
    localStorage.setItem("selectedFactory", factoryId);

    const selectedFactory = factories.find(
      (factory) => factory._id === factoryId
    );

    const parsedDashboards = selectedFactory.assets.map((asset) => ({
      id: asset._id,
      title: asset.name,
      gauges: asset.sensors.map((sensor) => ({
        id: sensor._id,
        value: sensor.lastReading,
        label: sensor.name,
        unit: sensor.unit,
        max: 100,
        color: "#8BC34A",
      })),
    }));

    setDashboards(parsedDashboards);
    localStorage.setItem("dashboards", JSON.stringify(parsedDashboards));
  };

  const handleAddFactory = async (e) => {
    e.preventDefault();
    try {
      const newFactory = { name: newFactoryName };
      await createFactory(newFactory);
      setIsAddFactoryModalOpen(false);
      setNewFactoryName("");
      // Refresh factories list
      const { factories: updatedFactories } = await getFactroiesByUser();
      setFactories(updatedFactories.data.factories);
    } catch (error) {
      console.error("Error adding factory:", error);
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const newAsset = {
        name: newAssetName,
        type: newAssetType,
        factoryId: selectedFactory,
      };
      await createAsset(newAsset);
      setIsAddAssetModalOpen(false);
      setNewAssetName("");
      setNewAssetType("");
      // Refresh factories list to reflect the new asset
      const { factories: updatedFactories } = await getFactroiesByUser();
      setFactories(updatedFactories.data.factories);
      // Optionally, update dashboards if needed
      handleFactoryChange({ target: { value: selectedFactory } });
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const openModal = async (gauge) => {
    setSelectedGauge(gauge);

    const readings = await getLast10Readings(gauge.id);
    setGaugeData(readings.data.readings || []);
    console.log("readings:", readings.data.readings);
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
          ? gaugeData.map((reading) => reading.v)
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
          {factories.map((factory) => (
            <option key={factory._id} value={factory._id}>
              {factory.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsAddFactoryModalOpen(true)}
          className="add-factory-button"
        >
          Add Factory
        </button>
      </div>
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <button
          onClick={() => setIsAddAssetModalOpen(true)}
          className="Asset-button"
        >
          Add Asset
        </button>

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
                        {gauge.value} {gauge.unit}
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
        <Modal
          isOpen={isAddFactoryModalOpen}
          onRequestClose={() => setIsAddFactoryModalOpen(false)}
          contentLabel="Add Factory"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>Add Factory</h2>
          <form onSubmit={handleAddFactory}>
            <input
              type="text"
              value={newFactoryName}
              onChange={(e) => setNewFactoryName(e.target.value)}
              placeholder="Factory Name"
              required
              className="form-inputText"
            />
            <button type="submit" className="control-button">
              Add Factory
            </button>
          </form>
          <button
            onClick={() => setIsAddFactoryModalOpen(false)}
            className="close-button"
          >
            Close
          </button>
        </Modal>
        <Modal
          isOpen={isAddAssetModalOpen}
          onRequestClose={() => setIsAddAssetModalOpen(false)}
          contentLabel="Add Asset"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>Add Asset</h2>
          <form onSubmit={handleAddAsset}>
            <label>Factory Name :</label>
            <input
              type="text"
              value={
                factories.find((factory) => factory._id === selectedFactory)
                  ?.name || ""
              }
              readOnly
              placeholder="Factory Name"
              required
              className="form-inputText"
            />
            <label>Asset Name :</label>
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Asset Name"
              required
              className="form-inputText"
            />
            <button type="submit" className="control-button">
              Add Asset
            </button>
          </form>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className="close-button"
          >
            Close
          </button>
        </Modal>
      </div>
    </main>
  );
};

export default Dashboard;
