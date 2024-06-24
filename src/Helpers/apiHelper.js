// src/helpers/apiHelper.js
import axios from "axios";

let BASE_URL = "http://localhost:4000/api";
let TOKEN = "";

// Function to fetch data from backend
const getFactroiesByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
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

    // setError("Login Successful");
    console.log("token:", response.data.data.token);
    TOKEN = response.data.data.token;
    return TOKEN; // Return the token instead of true
  } catch (err) {
    if (err.response) {
      console.log("Response error:", err.response);
      //   setError(err.response.data.message || "Invalid Credentials");
    } else if (err.request) {
      console.error("Request error:", err.request);
      //   setError("No response from the server. Please try again later.");
    } else {
      console.error("General error:", err.message);
      //   setError("An error occurred. Please try again.");
    }
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
    return response.data; // Return data from response
  } catch (error) {
    console.error("Error fetching last 10 readings:", error);
    return null; // Handle errors gracefully as per your app's requirements
  }
};

export { getFactroiesByUser, login, getLast10Readings };
