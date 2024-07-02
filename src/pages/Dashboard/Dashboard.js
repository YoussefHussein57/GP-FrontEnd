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
  createAsset,
  removeAsset,
  removeSensor,
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
  const [isAddFactoryModalOpen, setIsAddFactoryModalOpen] = useState(false);
  const [newFactoryName, setNewFactoryName] = useState("");
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState(""); // New state for asset type
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [recentlyAddedAssets, setRecentlyAddedAssets] = useState([]);

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

  const fetchAndUpdateFactories = async () => {
    try {
      const { factories: factoriesData } = await getFactroiesByUser();
      setFactories(factoriesData.data.factories);
      localStorage.setItem(
        "factories",
        JSON.stringify(factoriesData.data.factories)
      );
      handleFactoryChange({ target: { value: selectedFactory } });
    } catch (error) {
      console.error("Error fetching and updating factories:", error);
    }
  };

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
      fetchAndUpdateFactories(); // Refresh factories list
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

      if (!newAsset.name || !newAsset.type || !newAsset.factoryId) {
        alert("Please fill out all fields.");
        return;
      }

      await createAsset(newAsset);
      setIsAddAssetModalOpen(false);
      setNewAssetName("");
      setNewAssetType(""); // Reset the asset type state
      fetchAndUpdateFactories(); // Refresh factories list to reflect the new asset
      setRecentlyAddedAssets((prev) => [...prev, newAsset.name]);
    } catch (error) {
      console.error("Error adding asset:", error);
      alert(
        `Error adding asset: ${
          error.response ? error.response.data.message : error.message
        }`
      );
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

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        if (itemToDelete.type === "asset") {
          await removeAsset(itemToDelete.id);
        } else if (itemToDelete.type === "sensor") {
          await removeSensor(itemToDelete.id);
        }
        fetchAndUpdateFactories(); // Refresh factories list to reflect the removal
        closeDeleteModal();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
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
                <h2>{dashboard.title}</h2>
                <button
                  className="delete-button"
                  onClick={() =>
                    openDeleteModal({ id: dashboard.id, type: "asset" })
                  }
                >
                  X
                </button>
                <div className="gauges">
                  {dashboard.gauges.map((gauge) => (
                    <div
                      className="gauge-container"
                      key={gauge.id}
                      onClick={() => openModal(gauge)}
                    >
                      <h3>{gauge.label}</h3>
                      <GaugeChart
                        id={gauge.id}
                        nrOfLevels={30}
                        percent={gauge.value / gauge.max}
                        colors={[gauge.color, "#FF5F6D"]}
                      />
                      <p>
                        {gauge.value} {gauge.unit}
                      </p>
                      <button
                        className="delete-button-sensor"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: gauge.id, type: "sensor" });
                        }}
                      >
                        X
                      </button>
                      <button
                        className={`star-button ${
                          favorites.some((fav) => fav.id === gauge.id)
                            ? "favorited"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(gauge);
                        }}
                      >
                        {favorites.some((fav) => fav.id === gauge.id)
                          ? "★"
                          : "☆"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        <div className="recently-added-assets">
          {recentlyAddedAssets.map((assetName, index) => (
            <div key={index} className="recent-asset">
              <h2>{assetName}</h2>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gauge Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{selectedGauge ? selectedGauge.label : ""}</h2>
        <Line data={data} />
        <button onClick={closeModal}>Close</button>
      </Modal>
      <Modal
        isOpen={isAddFactoryModalOpen}
        onRequestClose={() => setIsAddFactoryModalOpen(false)}
        contentLabel="Add Factory Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Factory</h2>
        <form onSubmit={handleAddFactory}>
          <input
            type="text"
            value={newFactoryName}
            onChange={(e) => setNewFactoryName(e.target.value)}
            placeholder="Factory Name"
            required
            className="form-inputText"
          />
          <button type="submit">Add</button>
        </form>
        <button onClick={() => setIsAddFactoryModalOpen(false)}>Close</button>
      </Modal>
      <Modal
        isOpen={isAddAssetModalOpen}
        onRequestClose={() => setIsAddAssetModalOpen(false)}
        contentLabel="Add Asset Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Asset</h2>
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
          <label>Asset Type :</label>
          <input
            type="text"
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value)}
            placeholder="Asset Type"
            required
            className="form-inputText"
          />
          <button type="submit">Add</button>
        </form>
        <button onClick={() => setIsAddAssetModalOpen(false)}>Close</button>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Item Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure you want to delete this item?</h2>
        <button onClick={handleDeleteItem}>Yes, delete it</button>
        <button onClick={closeDeleteModal}>Cancel</button>
      </Modal>
    </main>
  );
};

export default Dashboard;
