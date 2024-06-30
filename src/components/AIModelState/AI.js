// src/components/AI.js
import React, { useState, useEffect } from "react";
//import axios from "axios";
import "./AiModel.css";

const AI = () => {
  const [aiModelStatus, setAiModelStatus] = useState(null); // State for AI model status

  useEffect(() => {
    fetchAiModelStatus();
  }, []);

  const fetchAiModelStatus = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/ai/model/status`);
      //setAiModelStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching AI model status:", error);
      // setAiModelStatus("Unavailable");
    }
  };

  return (
    <div className="ai-model-container">
      <h2>AI Model Status</h2>
      <div className="ai-model-status">
        {aiModelStatus !== null ? (
          <div className={`status ${aiModelStatus.toLowerCase()}`}>
            {aiModelStatus}
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default AI;
