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
import "./Dashboard.css";

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
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false); // State to track LED status

  const openModal = (gauge) => {
    setSelectedGauge(gauge);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGauge(null);
  };

  const toggleLed = () => {
    setIsLedOn((prevStatus) => !prevStatus);
    // Implement the logic to actually toggle the LED here (e.g., API call)
    console.log(`LED is now ${!isLedOn ? "ON" : "OFF"}`);
  };

  const data = {
    labels: Array.from({ length: 10 }, (_, i) => i + 1),
    datasets: [
      {
        label: `${selectedGauge ? selectedGauge.label : ""} Over Time`,
        data: Array.from(
          { length: 10 },
          () => Math.random() * (selectedGauge ? selectedGauge.max : 100)
        ),
        fill: false,
        backgroundColor: selectedGauge ? selectedGauge.color : "#000",
        borderColor: selectedGauge ? selectedGauge.color : "#000",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {dashboards.map((dashboard) => (
        <div key={dashboard.id} className="dashboard-wrapper">
          <div className="dashboard">
            <h3>{dashboard.title}</h3>
            <div className="gauges">
              {dashboard.gauges.map((gauge) => (
                <div
                  className="gauge-container"
                  key={gauge.id}
                  onClick={() => openModal(gauge)}>
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
                    }}>
                    {gauge.value * gauge.max} {gauge.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gauge Details"
        className="modal"
        overlayClassName="modal-overlay">
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
  );
};

export default Dashboard;
