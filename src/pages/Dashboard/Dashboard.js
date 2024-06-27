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

// Set the app element for react-modal
Modal.setAppElement("#root"); // Replace with the ID of your main app element

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dashboards = [
  {
    id: 1,
    title: "Production Line 1",
    gauges: [
      {
        id: 1,
        value: 0.5,
        label: "Temperature",
        unit: "°C",
        max: 5000,
        color: "#FF4D4D",
      },
      {
        id: 2,
        value: 0.25,
        label: "Humidity",
        unit: "%",
        max: 100,
        color: "#8BC34A",
      },
    ],
  },
  {
    id: 2,
    title: "Production Line 2",
    gauges: [
      {
        id: 3,
        value: 0.75,
        label: "Pressure",
        unit: "kPa",
        max: 100,
        color: "#FFD700",
      },
      {
        id: 4,
        value: 0.4,
        label: "Voltage",
        unit: "V",
        max: 50,
        color: "#0000FF",
      },
    ],
  },
  {
    id: 3,
    title: "Production Line 3",
    gauges: [
      {
        id: 5,
        value: 0.6,
        label: "Flow Rate",
        unit: "L/min",
        max: 100,
        color: "#FFC107",
      },
      {
        id: 6,
        value: 0.3,
        label: "Level",
        unit: "%",
        max: 100,
        color: "#8BC34A",
      },
    ],
  },
];

const Dashboard = () => {
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false); // State to track LED status
  const [gaugeData, setGaugeData] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchFactories = async () => {
      const factoriesData = await getFactroiesByUser();
      setFactories(factoriesData || []);
    };

    fetchFactories();
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
    setGaugeData(readings || []); // Ensure readings is an array
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
        >
          <option value="">Select a factory</option>
          {factories.map((factory) => (
            <option key={factory.id} value={factory.id}>
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
