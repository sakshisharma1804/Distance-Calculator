import './App.css';
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [originLat, setOriginLat] = useState("");
  const [originLng, setOriginLng] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLng, setDestLng] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [adjustedDuration, setAdjustedDuration] = useState(null);
  const [error, setError] = useState(null);

  const weatherCoefficients = {
    Clear: 1,
    Clouds: 1.1,
    Rain: 1.25,
    Drizzle: 1.15,
    Thunderstorm: 1.5,
    Snow: 1.4,
    Fog: 1.3,
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const calculateTravel = async () => {
    if (!originLat || !originLng || !destLat || !destLng || !selectedDate) {
      setError("Please fill all fields including date.");
      return;
    }

    setError(null);

    try {
      // Convert selected date to UNIX timestamp
      const selectedUnixTimestamp = Math.floor(
        new Date(selectedDate).getTime() / 1000
      );

      // Fetch weather data for the selected date and location
      const weatherResponse = await axios.get(
       " https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: originLat,
            lon: originLng,
            appid: "b4f597cc366fc6e6d9e1a00a9f1a590d",
            units: "metric",
          },
        }
      );

      const weatherMain = weatherResponse.data.weather[0].main;
      const weatherCoefficient = weatherCoefficients[weatherMain] || 1;

      // Fetch travel duration using OpenRoute API
      const routeResponse = await axios.post(
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

      const travelData = routeResponse.data.routes[0].summary;

      // Calculate adjusted duration
      const baseDuration = travelData.duration / 60; // Convert to minutes
      const adjustedDuration = baseDuration * weatherCoefficient;

      setDistance((travelData.distance / 1000).toFixed(2) + " km");
      setDuration(baseDuration.toFixed(2) + " minutes");
      setAdjustedDuration(adjustedDuration.toFixed(2) + " minutes");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to calculate travel. Please check your inputs.");
    }
  };

  return (
    <div className="app">
      <h1>Weather-Based Travel Calculator</h1>

      {/* Input fields for coordinates */}
      <div>
        <h3>Enter Origin Coordinates:</h3>
        <input
          type="number"
          placeholder="Origin Latitude"
          value={originLat}
          onChange={(e) => setOriginLat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Origin Longitude"
          value={originLng}
          onChange={(e) => setOriginLng(e.target.value)}
        />

        <h3>Enter Destination Coordinates:</h3>
        <input
          type="number"
          placeholder="Destination Latitude"
          value={destLat}
          onChange={(e) => setDestLat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Destination Longitude"
          value={destLng}
          onChange={(e) => setDestLng(e.target.value)}
        />
      </div>

      {/* Calendar for selecting a date */}
      <div>
        <h3>Select Travel Date:</h3>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]} // Prevent selecting future dates
          min={new Date(new Date().setDate(new Date().getDate() - 5))
            .toISOString()
            .split("T")[0]} // Limit to the past 5 days
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Calculate button */}
      <button onClick={calculateTravel}>Calculate Travel</button>

      {/* Results or Errors */}
      {error && <p className="error">{error}</p>}
      {distance && duration && adjustedDuration && (
        <div>
          <h3>Results:</h3>
          <p>Distance: {distance}</p>
          <p>Base Duration: {duration}</p>
          <p>Weather Adjusted Duration: {adjustedDuration}</p>
        </div>
      )}
    </div>
  );
}

export default App;