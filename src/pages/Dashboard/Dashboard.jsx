import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { Gauge } from '@mui/x-charts/Gauge';
import Slider from "../../components/SliderButton/Slider";


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
  getFactoriesByUser,
  getLast10Readings,
  createFactory,
  createAsset,
  removeAsset,
  removeSensor,
  removeFactory,
  toggleSensor,
  createSensor,
  login, // Import login function from apiHelper
} from "../../Helpers/apiHelper";
import "./Dashboard.css";
import Card from "../../components/Card/Card";
import "../Login/Login.css";
import Button from "../../components/Buttons/Button";

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

const Dashboard = ({ email, password }) => {
  const [factories, setFactories] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(factories.length > 0 ? factories[0]._id : null);
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
const [ledState, setLedState] = useState(localStorage.getItem("ledState") === "true");
//add new Sensor Variables 
const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);
const [selectedAssetForSensor, setSelectedAssetForSensor] = useState(null);
const [newSensorName, setNewSensorName] = useState("");
const [newSensorType, setNewSensorType] = useState(""); // State to store selected sensor type
const [newSensorUnit, setNewSensorUnit] = useState(""); // State to store selected unit for sensor


//#Favoruites Reigon
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const userEmail = email || storedEmail;
    const userPassword = password || storedPassword;

    if (userEmail && userPassword) {
      const checkRole = async () => {
        try {
          const response = await login(userEmail, userPassword);
          console.log("Login response in Dashboard:", response);
          if (response && response.role === "ADMIN") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      };
      checkRole();
    }

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [email, password]);

  useEffect(() => {
    fetchFactories();
  }, []);

  useEffect(() => {
    if (selectedFactory) {
      const factory = factories.find((factory) => factory._id === selectedFactory);
      if (factory) {
        setAssetsInFactory(factory.assets);
        const parsedDashboards = factory.assets.map((asset) => ({
          id: asset._id,
          title: asset.name,
          gauges: asset.sensors.map((sensor) => ({
            id: sensor._id,
            value: sensor.lastReading,
            label: sensor.name,
            type : sensor.gauge_type,
            unit: sensor.unit,
            max: sensor.max,
            min: sensor.min,
            color: "#8BC34A",
          })),
        }));
        setDashboards(parsedDashboards);
      }
    }
  }, [selectedFactory, factories]);

  const fetchFactories = async () => {
    try {
      const { factories: factoriesData } = await getFactoriesByUser();
      setFactories(factoriesData.data.factories);
      if (factoriesData.data.factories.length > 0) {
        setSelectedFactory(factoriesData.data.factories[0]._id);
      }
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  const handleFactoryChange = (e) => {
    const factoryId = e.target.value;
    setSelectedFactory(factoryId);
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

  const handleAddSensor = async () => {
    try {
      console.log("Creating new sensor for asset:", selectedAssetForSensor);
      
      // Call createSensor with the necessary parameters (update as needed)
      const sensorData = {
        assetId: selectedAssetForSensor,
        name: newSensorName,
        gauge_type: newSensorType, // Add selected sensor type
        unit: newSensorUnit, // Add selected unit for sensor 
        // Add other sensor properties as needed
      };
      await createSensor(sensorData);
  
      // Close the modal after creating the sensor
      setIsAddSensorModalOpen(false);
      setSelectedAssetForSensor(null);
      refreshData(); 
    } catch (error) {
      console.error("Error adding sensor:", error);
      alert(`Error adding sensor: ${error.message}`);
    }
  };
  
  const openAddSensorModal = (assetId) => {
    setSelectedAssetForSensor(assetId);
    setIsAddSensorModalOpen(true);
  };
    
  const refreshData = async () => {
    try {
      await fetchFactories();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

const openModal = async (gauge) => {
  setSelectedGauge(gauge);

  try {
    const response = await getLast10Readings(gauge.id);
    console.log("API Response:", response);

    // Adjusting the condition to match the actual response format
    if (response.data.readings) {
      const readings = response.data.readings;

      if (Array.isArray(readings) && readings.length > 0) {
        setGaugeData(readings || []);
        let times = gaugeData.map((reading) => new Date(reading.t))
        console.log("########################",times) ;
        setModalIsOpen(true);
      } else {
        console.error("No readings found in the API response:", readings);
      }
    } else {
      console.error("Invalid response format from API:", response);
    }
  } catch (error) {
    console.error("Error fetching last 10 readings:", error);
  }
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
    labels: Array.isArray(gaugeData)
      ? gaugeData.map((reading) => {
          const timestamp = reading.t;
          const date = new Date(timestamp * 1000); // multiply by 1000 if the timestamp is in seconds
          return date.toLocaleTimeString();
        })
      : Array.from({ length: 10 }, (_, i) => i + 1),
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
  const handleToggleLed = async (gaugeId) => {
    try {
      // Call API to toggle sensor based on the provided gaugeId
      const response = await toggleSensor(gaugeId);
      console.log("Toggle Sensor Response:", response);
  
      // Update status based on response
      if (response.status === "success") {
        const newReqStatus = response.data.sensor.req_status;
  
        // Update state or perform other actions based on newReqStatus
        // For example, update a specific sensor in the dashboards state
        const updatedDashboards = dashboards.map((dashboard) => ({
          ...dashboard,
          gauges: dashboard.gauges.map((gauge) =>
            gauge.id === gaugeId ? { ...gauge, req_status: newReqStatus } : gauge
          ),
        }));
  
        setDashboards(updatedDashboards);
  
        // Example: Show a success message to the user
        console.log(`Sensor toggled successfully. New req_status: ${newReqStatus}`);
      } else {
        // Handle error cases if needed
        console.error("Toggle Sensor API returned an error:", response.error);
        // Update state or show error message
      }
    } catch (error) {
      console.error("Error toggling sensor:", error);
      // Handle error gracefully, show error message, etc.
    }
  };
    
  
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
          {dashboards&&dashboards.map((dashboard) => (
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
                      <div  
                          className="flex w-full justify-between items-baseline place-items-center "
                           
                      >
                                {gauge.type === 'DO' && (          <Slider 
            id={gauge.id} 
         
            handleToggleLed={() => handleToggleLed(gauge.id)}
          />

                                )}
                                </div>
                                  <div  
                          className="flex w-full justify-between items-baseline place-items-center "
                          onClick={() => openModal(gauge)}
                           
                      >
                                {gauge.type === 'AI' && (
                                  // Render AI specific content or component
                                  <GaugeChart
                  
                                  id={gauge.id}
                                  nrOfLevels={25}
                                  percent={gauge.value / gauge.max}
                                  colors={[gauge.color, "#FF5F6D"]}
                                  
                                />
                                )}
                                {gauge.type === 'DI' && (
                                  // Render DI specific content or component
                                  <Gauge
                                    id={`${gauge.id}`}
                                    value={gauge.value}
                                    max={gauge.max}
                                    color={gauge.color}
                                  />
                                )}
                                </div>
                          
                              
                                                    <p>
                        {gauge.value} {gauge.unit}
                      </p>
                      
                    </Card>
                  ))}
                </div>
              </div>
              {isAdmin && (
              <Button
                onClick={() => openAddSensorModal(dashboard.id)}
                text="Add Sensor"
                className={"w-36 self-end "}
                
              />
            )}
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
  isOpen={isAddSensorModalOpen}
  onRequestClose={() => setIsAddSensorModalOpen(false)}
  contentLabel="Add Sensor Modal"
  className="modal"
  overlayClassName="overlay min-w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
>
  <h2>Add New Sensor</h2>
  <form
    onSubmit={handleAddSensor}
    className="items-center justify-center flex flex-col gap-2"
  >
    <input
      type="text"
      value={newSensorName}
      onChange={(e) => setNewSensorName(e.target.value)}
      placeholder="Sensor Name"
      required
      className="form-inputText border"
    />
     <input
      type="text"
      value={newSensorUnit}
      onChange={(e) => setNewSensorUnit(e.target.value)}
      placeholder="Sensor Unit"
      required
      className="form-inputText border"
    />
    <select
      value={newSensorType}
      onChange={(e) => setNewSensorType(e.target.value)}
      required
      className="form-inputText border bg-accent"
    >
      <option value="">Select Sensor Type</option>
      <option value="DO">DO (Digital Output)</option>
      <option value="DI">DI (Digital Input)</option>
      <option value="AI">AI (Analog Input)</option>
    </select>
    <Button type="submit">Add</Button>
    <Button onClick={() => setIsAddSensorModalOpen(false)}>Close</Button>
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
            <Button  onClick={handleDeleteItem}>Delete Factory</Button>
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
