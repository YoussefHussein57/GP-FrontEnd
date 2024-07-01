// src/helpers/apiHelper.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000/api";
let TOKEN = "";
let userId = "";

// Function to fetch data from backend
const getFactroiesByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/factories/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return { factories: response.data };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { factories: null };
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email,
      password,
    });

    console.log("Login response:", response.data);

    const token = response.data.data.token;
    TOKEN = token;
    console.log("Set token:", TOKEN);

    const decodedToken = jwtDecode(token);
    userId = decodedToken.id; // Decode and set the userId
    console.log("User ID:", userId);

    return { token, role: decodedToken.role };
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

const appendNewReading = async (sensorId, readingData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sensorReadings/${sensorId}`,
      readingData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error appending new reading:", error);
    return null;
  }
};

const getLast10Readings = async (sensorId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sensorReadings/${sensorId}/last10`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching last 10 readings:", error);
    return null;
  }
};

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData, {
      headers: {
        "Content-Type": "application/json",
        // Optionally include Authorization header if required
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Rethrow error for higher-level handling
  }
};

const getAllUsers = async () => {
  try {
    console.log(`Fetching users with token: ${TOKEN}`);
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    console.log("Fetch users response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error.response || error.message);
    return null;
  }
};

const removeUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove user");
    }

    const data = await response.json();
    console.log("User removed successfully:", data);
    return data; // Optionally return data if needed
  } catch (error) {
    console.error("Error removing user:", error);
    throw error; // Propagate the error back to the caller
  }
};

const getUserId = async () => {
  console.log(`-------- User ID: ${userId}`);
  return userId;
};
// New functions for creating factory and asset
const createFactory = async (factoryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/factories`, factoryData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating factory:", error);
    throw error;
  }
};

const createAsset = async (assetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assets`, assetData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

export {
  getFactroiesByUser,
  login,
  getLast10Readings,
  appendNewReading,
  getAllUsers,
  registerUser,
  removeUser,
  getUserId,
  createFactory,
  createAsset,
};
