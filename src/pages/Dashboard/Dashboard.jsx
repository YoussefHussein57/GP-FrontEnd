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
import Card from "../../components/Card/Card";
import "../Login/Login.css";
import Button from "../../components/Buttons/Button";
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
  const [newAssetModel, setNewAssetModel] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [recentlyAddedAssets, setRecentlyAddedAssets] = useState([]);
  const [assetsInFactory, setAssetsInFactory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

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

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [email, password]); // Trigger useEffect when email or password changes

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
        max: sensor.max,
        min: sensor.min,
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
      const selectedFactoryObj = factories.find(
        (factory) => factory._id === selectedFactory
      );

      if (!selectedFactoryObj) {
        console.error("Selected factory not found.");
        alert("Selected factory not found. Please select a valid factory.");
        return;
      }

      const newAsset = {
        name: newAssetName,
        model: newAssetModel,
        factoryId: selectedFactory, // Assuming selectedFactory is already defined
        predictiveMaintenance: "none", // Adjust as per your API response structure
        sensors: [], // Adjust as per your API response structure
        created_by: "668abeb5d7b7bb547086b9ea", // Adjust as per your API response structure
        created_at: "2010-01-01T18:25:43.511+00:00", // Adjust as per your API response structure
        __v: 6, // Adjust as per your API response structure
      };

      if (!newAsset.name || !newAsset.model || !newAsset.factoryId) {
        alert("Please fill out all fields.");
        return;
      }

      await createAsset(newAsset);
      setIsAddAssetModalOpen(false);
      setNewAssetName("");
      setNewAssetModel("");
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
  console.log("KAK", dashboards);
  //#region  Render
  return (
    <main className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
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
          <Button
            className={"w-36"}
            onClick={() => setIsAddFactoryModalOpen(true)}
            text="Add Factory"
          />
        )}
      </div>
      <div className="gap-8 flex flex-col ">
        {isAdmin && (
          <div className="flex justify-between items-center">
            <Button
              className={"w-36"}
              onClick={() => setIsAddAssetModalOpen(true)}
              text="Add Asset"
            />
            <button
              className="justify-end bg-accent border border-red-900 w-8 rounded-full h-8 text-center text-white"
              onClick={() => openDeleteModal({ type: "asset" })}
            >
              X
            </button>
          </div>
        )}
        <div className="flex flex-col gap-6 ">
          {dashboards.map((dashboard) => (
            <Card className="w-[95%] self-center " key={dashboard.id}>
              <div className="">
                <h2 className="mb-4">{dashboard.title}</h2>

                <div className="flex-shrink flex gap-4 overflow-x-auto">
                  {dashboard.gauges.map((gauge) => (
                    <Card
                      className=" flex gap-2 w-fit justify-center items-center max-h-full"
                      key={gauge.id}
                      onClick={() => openModal(gauge)}
                    >
                      <div className="flex w-full justify-between items-baseline">
                        <button
                          className={`self-start w-fit text-yellow-500 ${
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

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal({ id: gauge.id, type: "sensor" });
                            }}
                            className="self-end w-fit "
                          >
                            X
                          </button>
                        )}
                      </div>

                      <h3 className="font-bold">{gauge.label}</h3>
                      <GaugeChart
                        id={gauge.id}
                        nrOfLevels={30}
                        percent={gauge.value / gauge.max}
                        colors={[gauge.color, "#FF5F6D"]}
                      />
                      <p>
                        {gauge.value} {gauge.unit}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {isAdmin && (
        <Button
          className={"w-36"}
          onClick={() =>
            openDeleteModal({ id: selectedFactory, type: "factory" })
          }
          text="Delete Factory"
        />
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
        <Button onClick={closeModal}>Close</Button>
      </Modal>
      <Modal
        isOpen={isAddFactoryModalOpen}
        onRequestClose={() => setIsAddFactoryModalOpen(false)}
        contentLabel="Add Factory Modal"
        className="modal"
        overlayClassName="overlay min-w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2>Add New Factory</h2>
        <form
          onSubmit={handleAddFactory}
          className="items-center justify-center flex flex-col gap-2"
        >
          <input
            type="text"
            value={newFactoryName}
            onChange={(e) => setNewFactoryName(e.target.value)}
            placeholder="Factory Name"
            required
            className="form-inputText border"
          />
          <Button type="submit">Add</Button>
          <Button onClick={() => setIsAddFactoryModalOpen(false)}>Close</Button>
        </form>
      </Modal>
      <Modal
        isOpen={isAddAssetModalOpen}
        onRequestClose={() => setIsAddAssetModalOpen(false)}
        contentLabel="Add Asset Modal"
        className="modal"
        overlayClassName="overlay min-w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2>Add New Asset</h2>
        <form
          onSubmit={handleAddAsset}
          className="flex flex-col justify-center items-center gap-3"
        >
          <label className="self-start">Factory Name :</label>
          <input
            type="text"
            value={
              factories.find((factory) => factory._id === selectedFactory)
                ?.name || ""
            }
            readOnly
            placeholder="Factory Name"
            required
            className="form-inputText border"
          />
          <label className="self-start">Asset Name :</label>
          <input
            type="text"
            value={newAssetName}
            onChange={(e) => setNewAssetName(e.target.value)}
            placeholder="Asset Name"
            required
            className="form-inputText border"
          />
          <label className="self-start">Asset Type :</label>
          <input
            type="text"
            value={newAssetModel}
            onChange={(e) => setNewAssetModel(e.target.value)}
            placeholder="Asset Type"
            required
            className="form-inputText border"
          />
          <Button type="submit">Add</Button>
          <Button onClick={() => setIsAddAssetModalOpen(false)}>Close</Button>
        </form>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Item Modal"
        className="modal  "
        overlayClassName="overlay min-w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {itemToDelete && itemToDelete.type === "factory" && (
          <>
            <h2>Confirm Factory Deletion:</h2>
            <p>Are you sure you want to delete this factory?</p>
            <Button onClick={handleDeleteItem}>Delete Factory</Button>
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
            <Button onClick={handleDeleteItem} text="Delete Asset"></Button>
          </>
        )}
        {itemToDelete && itemToDelete.type === "sensor" && (
          <>
            <h2>Confirm Sensor Deletion:</h2>
            <p>Are you sure you want to delete this sensor?</p>
            <Button onClick={handleDeleteItem}>Delete Sensor</Button>
          </>
        )}
        <Button onClick={closeDeleteModal} text="cancel"></Button>
      </Modal>
    </main>
  );
};

export default Dashboard;
