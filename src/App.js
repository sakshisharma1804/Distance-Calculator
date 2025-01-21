import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [originLat, setOriginLat] = useState("");
  const [originLng, setOriginLng] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLng, setDestLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [weatherFactor, setWeatherFactor] = useState(1); // Default weather coefficient

  const calculateDistance = async () => {
    if (!originLat || !originLng || !destLat || !destLng) {
      setError("Please fill in all latitude and longitude fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            [parseFloat(originLng), parseFloat(originLat)],
            [parseFloat(destLng), parseFloat(destLat)],
          ],
          preference: "fastest",
          geometry: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 5b3ce3597851110001cf6248a211a767c9284c9296924e1382074772",
          },
        }
      );

      console.log("API Response:", response.data);
      const result = response.data.routes[0].summary;

      if (result) {
        const adjustedDuration = result.duration / 60 * weatherFactor; // Adjust duration with weather
        setDistance((result.distance / 1000).toFixed(2) + " km");
        setDuration(adjustedDuration.toFixed(2) + " minutes");
      } else {
        setError("No results found for the provided coordinates.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="title">Distance Calculator</h1>

      {/* Input fields for latitude and longitude */}
      <div>
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

      {/* Weather condition buttons */}
      <div>
        <h3>Select Weather Condition:</h3>
        <button className="button" onClick={() => setWeatherFactor(1)}>
          Clear/Sunny (x1)
        </button>
        <button className="button" onClick={() => setWeatherFactor(1.1)}>
          Light Rain (x1.1)
        </button>
        <button className="button" onClick={() => setWeatherFactor(1.25)}>
          Heavy Rain (x1.25)
        </button>
        <button className="button" onClick={() => setWeatherFactor(1.5)}>
          Snow (x1.5)
        </button>
        <button className="button" onClick={() => setWeatherFactor(1.2)}>
          Fog (x1.2)
        </button>
      </div>

      {/* Calculate button */}
      <button className="button" onClick={calculateDistance} disabled={loading}>
        {loading ? "Calculating..." : "Calculate Distance and Time"}
      </button>

      {/* Error or Results */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {distance && duration && (
        <div className="container">
          <p>Weather Coefficient: {weatherFactor}</p>
          <p>Distance: {distance}</p>
          <p>Adjusted Travel Time: {duration}</p>
        </div>
      )}
    </div>
  );
}

export default App;

