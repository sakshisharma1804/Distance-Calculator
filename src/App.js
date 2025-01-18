import "./App.css";
import React, { useState } from "react";
import axios from "axios"; // Import Axios

function App() {
  const [originLat, setOriginLat] = useState("");
  const [originLng, setOriginLng] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLng, setDestLng] = useState("");

  const [loading, setLoading] = useState(false); // To show the loader
  const [distance, setDistance] = useState(null); // To store distance
  const [duration, setDuration] = useState(null); // To store duration
  const [error, setError] = useState(null); // To show errors
  const [mode, setMode] = useState("driving");

  const calculateDistance = async () => {
    if (!originLat || !originLng || !destLat || !destLng) {
      setError("Please fill in all latitude and longitude fields.");
      return;
    }
    setLoading(true); // Show the loader
    setError(null); // Reset error

    try {
      const response = await axios.get(

        `https://api.distancematrix.ai/maps/api/distancematrix/json`, // API endpoint
        
        {
          params: {
            origins: `${originLat},${originLng}`,
            destinations: `${destLat},${destLng}`,
            key: "4TJmI0Kb81MdXH5Au5cD46emIaJ22gbNFXVOpvgj28HyRBnv3XbDaF4yObTTYUDW", 
            mode: mode, 
          },
        }
      );

      console.log("API Response:", response.data);
      const result = response.data.rows[0].elements[0];
      if (result.status === "OK") {
        setDistance(result.distance.text);
        setDuration(result.duration.text);
      } else {
        setError("No results for the selected travel mode and coordinates.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false); // Stop showing the loader
    }
  };

  return (
    <div className="page" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="title">Distance Calculator</h1>

      {/* Input fields for latitude and longitude */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Enter Origin Coordinates:</h3>
        <input
          type="number"
          placeholder="Origin Latitude"
          value={originLat}
          onChange={(e) => setOriginLat(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Origin Longitude"
          value={originLng}
          onChange={(e) => setOriginLng(e.target.value)}
          className="input"
        />

        <h3>Enter Destination Coordinates:</h3>
        <input
          type="number"
          placeholder="Destination Latitude"
          value={destLat}
          onChange={(e) => setDestLat(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Destination Longitude"
          value={destLng}
          onChange={(e) => setDestLng(e.target.value)}
          className="input"
        />
      </div>

      {/* Buttons for travel modes */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("driving")}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Car
        </button>
        <button
          onClick={() => setMode("bicycling")}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Bicycle
        </button>
        <button
          onClick={() => setMode("walking")}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Walking
        </button>
      </div>

      {/* Button to calculate distance */}
      <button onClick={calculateDistance} disabled={loading}>
        {loading ? "Calculating..." : "Find Distance and Time"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the distance and duration */}
      {distance && duration && (
        <div className="container">
          <p>Travel Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
    </div>
  );
}

export default App;
