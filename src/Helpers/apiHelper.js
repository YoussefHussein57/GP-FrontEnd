// src/helpers/apiHelper.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000/api";
let TOKEN = "";
let userId = "";

// Function to fetch data from backend
const getFactoriesByUser = async () => {
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
const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/users/refresh-token`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    const token = response.data.token;
    TOKEN = token;
    localStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
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
const removeAsset = async (assetId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/assets/${assetId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.status === 200) {
      throw new Error("Failed to delete asset");
    }

    console.log("Asset deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error; // Propagate the error back to the caller
  }
};
const removeFactory = async (factoryId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/factories/${factoryId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.status === 200) {
      throw new Error("Failed to delete factory");
    }

    console.log("Factory deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting factory:", error);
    throw error; // Propagate the error back to the caller
  }
};
const removeSensor = async (sensorId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/sensors/${sensorId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.status === 200) {
      throw new Error("Failed to delete sensor");
    }

    console.log("Sensor deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor:", error);
    throw error; // Propagate the error back to the caller
  }
};
const toggleSensor = async (sensorId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sensors/${sensorId}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling sensor:", error);
    throw error;
  }
};

const createSensor = async (sensorData) => {
  try {
    const response = await axios.post(`${BASE_URL}/sensors`, sensorData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating sensor:", error);
    throw error;
  }
};

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle token refresh if needed
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken(); // Example function to refresh token
        localStorage.setItem("token", token);
        return api(originalRequest); // Retry original request with new token
      } catch (refreshError) {
        // Handle refresh token error (e.g., logout user)
        console.error("Failed to refresh token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const fetchModelData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/assets`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log("Response from server:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching model data:", error);
    throw error;
  }
};

export default api;

export {
  getFactoriesByUser,
  login,
  getLast10Readings,
  appendNewReading,
  getAllUsers,
  registerUser,
  removeUser,
  getUserId,
  createFactory,
  createAsset,
  removeAsset,
  removeFactory,
  removeSensor,
  toggleSensor,
  fetchModelData,
  createSensor, // Export the new function
};
