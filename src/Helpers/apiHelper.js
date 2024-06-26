// src/helpers/apiHelper.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000/api";
let TOKEN = "";

// Function to fetch data from backend
const getFactroiesByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/factories/user`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
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
    const userRole = decodedToken.role;
    console.log("User role:", userRole);

    return { token, role: userRole };
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
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
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

export {
  getFactroiesByUser,
  login,
  getLast10Readings,
  appendNewReading,
  getAllUsers,
  registerUser,
};
