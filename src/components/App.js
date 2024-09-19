import React, { useState, useEffect } from "react";
import axios from "axios";
import Forecast from "./Forecast";
import SearchInput from "./SearchInput";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [query, setQuery] = useState("Vadodara");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const search = async (event) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    setWeather((prev) => ({ ...prev, loading: true }));
    const api_key = "e73f9258b45ca92e195b7b058ebf2521";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}`;

    try {
      const response = await axios.get(url);
      setWeather({ data: response.data, loading: false, error: false });
      toast.success(`${query} weather data fetched successfully`);
    } catch (error) {
      setWeather({ data: {}, loading: false, error: true });
      toast.error(`Something went wrong`);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <Toaster />
      <SearchInput query={query} setQuery={setQuery} search={search} />
      {weather.loading ? (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      ) : weather.error ? (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry city not found, please try again.
            </span>
          </span>
        </>
      ) : (
        weather &&
        Object.keys(weather.data).length > 0 && (
          <Forecast weather={weather} toDate={toDate} />
        )
      )}
    </div>
  );
}

export default App;
