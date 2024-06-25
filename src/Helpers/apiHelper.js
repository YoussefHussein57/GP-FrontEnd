// src/helpers/apiHelper.js
import axios from "axios";

let BASE_URL = "http://localhost:4000/api";
let TOKEN = "";

// Function to fetch data from backend
const getFactroiesByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/factories/user`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Handle errors gracefully as per your app's requirements
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email,
      password,
    });

    console.log("Login response:", response.data); // Log the response data

    TOKEN = response.data.data.token;
    return {
      token: response.data.token,
      role: response.data.role, // Assuming your server returns 'role' in the response
    };
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

// const getUserRole = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/users/role`, {
//       headers: {
//         Authorization: `Bearer ${TOKEN}`,
//       },
//     });
//     return response.data.role; // Assuming role is provided in response
//   } catch (error) {
//     console.error("Error fetching user role:", error);
//     return null;
//   }
// };

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
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error appending new reading:", error);
    return null; // Handle errors gracefully as per your app's requirements
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
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error fetching last 10 readings:", error);
    return null; // Handle errors gracefully as per your app's requirements
  }
};
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error fetching all users:", error);
    return null; // Handle errors gracefully as per your app's requirements
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
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error registering user:", error);
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
  //getUserRole,
};
