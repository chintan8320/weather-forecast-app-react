import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); 

  const fetchForecastData = async () => {
    const api_key = "e73f9258b45ca92e195b7b058ebf2521";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data?.coord?.lat}&lon=${data?.coord?.lon}&appid=${api_key}`;

    try {
      const response = await axios.get(url);
      setForecastData(response.data.list);
    } catch (error) {
      console.log("Error fetching forecast data:", error);
    }
  };
  
  useEffect(() => {

    fetchForecastData();
  }, [data.name]);

  const formatDay = (timestamp) => {
    const options = { day: 'numeric', month: 'short', hour: 'numeric', hour12: true };
    return new Date(timestamp * 1000).toLocaleString('en-US', options);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    return currentDate;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  const renderTemperature = (temperature) => {
    if (isCelsius) {
      return Math.round(temperature);
    } else {
      return convertToFahrenheit(temperature);
    }
  };

  const getImage = (desc) => {
    switch (desc) {
      case 'Clouds':
          return "/images/clouds.png"
      case 'Clear':
          return "/images/clear.png"
      case 'Mist':
          return "/images/mist.png"
      case 'Haze':
          return "/images/mist.png"
      case 'Rain':
          return "/images/rain.png"
      case 'Snow':
          return "/images/snow.png"
  }
  }

  return (
    <div>
      <div className="city-name">
        <h2>
          {data?.name}, <span>{data?.sys?.country}</span>
        </h2>
      </div>
      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>
      <div className="temp">
        {data?.weather?.[0]?.main && (
          <img
            src={getImage(data?.weather?.[0]?.main)}
            alt={data?.weather?.[0]?.description} 
            className="temp-icon"
          />
        )}
        <div>
        <span>{renderTemperature((data?.main.temp)-273.15)}</span>
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
        </div>
      </div>
      <p className="weather-des">{data?.weather?.[0]?.description}</p>
      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40"/>
          <div>
            <p className="wind">{data?.wind?.speed}m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40"/>
          <div>
            <p className="humidity">{data?.main?.humidity}%</p>
            <p>Humidity</p>
        </div>
        </div>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData &&
            forecastData.map((day) => (
              <div className="day" key={day?.dt}>
                <p className="day-name">{formatDay(day?.dt)}</p>
                {data?.weather?.[0]?.main && (
                  <img
                    className="day-icon"
                    src={getImage(data?.weather?.[0]?.main)}
                    alt={data?.weather?.[0]?.description}
                  />
                )}
                <p className="weather-card-des">{day?.weather?.[0]?.description}</p>
                <p className="day-temperature">
                  {renderTemperature((day?.main?.temp_min)-273.15)}{isCelsius ? "°C" : "°F"}/ <span>{renderTemperature((day?.main?.temp_max)-273.15)}{isCelsius ? "°C" : "°F"}</span>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}        

export default Forecast;