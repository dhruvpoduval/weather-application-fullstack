import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `${token}`
            }
          });
          
          if (response.data.valid) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `${token}`;
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
    };

    verifyToken();
  }, []);

  const setAuthToken = (token) => {
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `${token}`;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const addFavorite = async (city, temperature, description) => {
    try {
      await axios.post('http://localhost:5000/api/weather/favorites', { 
        city,
        temperature,
        description
      });
      alert('City added to favorites');
    } catch (err) {
      console.error(err.response.data);
      if (err.response.status === 401) {
        handleLogout(); // Logout if unauthorized
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar key={isAuthenticated} isAuthenticated={isAuthenticated} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} addFavorite={addFavorite} />} />
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
          <Route path="/register" element={<Register setAuthToken={setAuthToken} />} />
          <Route path="/profile" element={<Profile logout={handleLogout} />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;