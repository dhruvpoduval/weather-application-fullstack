import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './Home.css';  // Import the CSS file for styling
import { useLocation } from 'react-router-dom';

const Home = ({ isAuthenticated, addFavorite }) => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('London');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset to default city when navigating home
    if (location.state?.resetCity) {
      setCity('London');
      setSearch('');
      setShowSearch(false);
      setShowSuggestions(false);
      // Clear the state to prevent repeated resets
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/weather/${city}`);
        setWeather(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
  }, [city]);

  // Add this useEffect for handling suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/weather/search/suggestions/${search}`
        );
        setSuggestions(response.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce the API calls
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(search);
    setShowSearch(false);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.city);
    setSearch(suggestion.fullName);
    setShowSuggestions(false);
    setShowSearch(false);
  };


  
  return (
    <div className="container">
      <div className="taskbar">
        <h1 className='app-heading'>Weathery</h1>
        <div className="search-container">
          <FaSearch className="search-icon" onClick={() => setShowSearch(!showSearch)} />
          {showSearch && (
            <div className="search-wrapper">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Enter city"
                />
                <button type="submit">Search</button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.fullName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="weather-info-container">
        <h2 className="city-name">{city}</h2>
        {weather && (
          <div className="weather-info">
            <p className="temperature">{weather.temperature}°C</p>
            <p className="description">{weather.description}</p>
            <img src={weather.icon} alt="Weather icon" className="weather-icon" />
            {/* <p className="rainfall">{weather.rainfall}mm</p> */}
            {isAuthenticated && (
              <button onClick={() => addFavorite(weather.city, weather.temperature, weather.description)}>Add to Favorites</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
