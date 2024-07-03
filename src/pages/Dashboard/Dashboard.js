import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import Modal from "react-modal";
import { Line } from "react-chartjs-2";
import {
  getFactoriesByUser,
  getLast10Readings,
  createFactory,
  createAsset,
  removeAsset,
  removeSensor,
  removeFactory,
  login, // Import login function from apiHelper
} from "../../Helpers/apiHelper";
import "./Dashboard.css";

Modal.setAppElement("#root");

const Dashboard = ({ email, password }) => {
  const [factories, setFactories] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [gaugeData, setGaugeData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isAddFactoryModalOpen, setIsAddFactoryModalOpen] = useState(false);
  const [newFactoryName, setNewFactoryName] = useState("");
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [recentlyAddedAssets, setRecentlyAddedAssets] = useState([]);
  const [assetsInFactory, setAssetsInFactory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true); // State to track if user is admin

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const userEmail = email || storedEmail;
    const userPassword = password || storedPassword;

    if (userEmail && userPassword) {
      const checkRole = async () => {
        try {
          const response = await login(userEmail, userPassword);
          console.log("Login response:", response);
          if (response && response.role === "ADMIN") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error logging in:", error);
          // Handle login error here
        }
      };

      checkRole();
    }
  }, [email, password]); // Trigger useEffect when email or password changes

  console.log("Is Admin :", isAdmin);

  const fetchFactories = async () => {
    try {
      const { factories: factoriesData } = await getFactoriesByUser();
      setFactories(factoriesData.data.factories);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  useEffect(() => {
    if (selectedFactory) {
      const factory = factories.find(
        (factory) => factory._id === selectedFactory
      );
      if (factory) {
        setAssetsInFactory(factory.assets);
      }
    }
  }, [selectedFactory, factories]);

  const handleFactoryChange = (e) => {
    const factoryId = e.target.value;
    setSelectedFactory(factoryId);

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
  };

  const handleAddFactory = async (e) => {
    e.preventDefault();
    try {
      const newFactory = { name: newFactoryName };
      await createFactory(newFactory);
      setIsAddFactoryModalOpen(false);
      setNewFactoryName("");
      fetchFactories();
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
      setNewAssetType("");
      fetchFactories();
      setRecentlyAddedAssets((prev) => [...prev, newAsset.name]);
    } catch (error) {
      console.error("Error adding asset:", error);
      alert(`Error adding asset: ${error.message}`);
    }
  };

  const openModal = async (gauge) => {
    setSelectedGauge(gauge);

    const readings = await getLast10Readings(gauge.id);
    setGaugeData(readings.data.readings || []);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGauge(null);
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
        } else if (itemToDelete.type === "factory") {
          await removeFactory(itemToDelete.id);
        }
        fetchFactories();
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
        {isAdmin && (
          <button
            onClick={() => setIsAddFactoryModalOpen(true)}
            className="add-factory-button"
          >
            Add Factory
          </button>
        )}
      </div>
      <div className="dashboard-container">
        {isAdmin && (
          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="asset-button"
          >
            Add Asset
          </button>
        )}

        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="dashboard-wrapper">
            <div className="dashboard">
              <h2>{dashboard.title}</h2>
              {isAdmin && (
                <button
                  className="delete-button"
                  onClick={() =>
                    openDeleteModal({ id: dashboard.id, type: "asset" })
                  }
                >
                  X
                </button>
              )}
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
                    {isAdmin && (
                      <button
                        className="delete-button-sensor"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: gauge.id, type: "sensor" });
                        }}
                      >
                        X
                      </button>
                    )}
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
                      {favorites.some((fav) => fav.id === gauge.id) ? "★" : "☆"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="recently-added-assets">
          {recentlyAddedAssets.map((assetName, index) => (
            <div key={index} className="recent-asset">
              <h2>{assetName}</h2>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <button
          className="delete-factory-button"
          onClick={() =>
            openDeleteModal({ id: selectedFactory, type: "factory" })
          }
        >
          Delete Factory
        </button>
      )}
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
        {itemToDelete && itemToDelete.type === "factory" && (
          <>
            <h2>Confirm Factory Deletion:</h2>
            <p>Are you sure you want to delete this factory?</p>
            <button onClick={handleDeleteItem}>Delete Factory</button>
          </>
        )}
        {itemToDelete && itemToDelete.type === "asset" && (
          <>
            <h2>Select Asset to Delete:</h2>
            <select
              className="dropdown"
              onChange={(e) => {
                const assetId = e.target.value;
                const selectedAsset = assetsInFactory.find(
                  (asset) => asset._id === assetId
                );
                setItemToDelete({
                  id: assetId,
                  type: "asset",
                  name: selectedAsset.name,
                });
              }}
            >
              <option value="">Select an asset to delete</option>
              {assetsInFactory.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name}
                </option>
              ))}
            </select>
            <button onClick={handleDeleteItem}>Delete Asset</button>
          </>
        )}
        {itemToDelete && itemToDelete.type === "sensor" && (
          <>
            <h2>Confirm Sensor Deletion:</h2>
            <p>Are you sure you want to delete this sensor?</p>
            <button onClick={handleDeleteItem}>Delete Sensor</button>
          </>
        )}
        <button onClick={closeDeleteModal}>Cancel</button>
      </Modal>
    </main>
  );
};

export default Dashboard;
