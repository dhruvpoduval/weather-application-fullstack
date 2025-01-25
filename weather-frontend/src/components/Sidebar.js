// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaStar, FaUserCircle } from 'react-icons/fa';
import './Sidebar.css'; // Create and import CSS for styling

const Sidebar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(isAuthenticated ? '/profile' : '/login');
  };

  const handleHomeClick = () => {
    navigate('/', { state: { resetCity: true } });
  };

  const renderIcon = (IconComponent, onClickHandler) => (
    <div className="icon" onClick={onClickHandler}>
      <IconComponent />
    </div>
  );

  return (
    <div className="sidebar">
      {renderIcon(isAuthenticated ? FaUser : FaUserCircle, handleProfileClick)}
      <hr />
      {renderIcon(FaHome, handleHomeClick)}
      {isAuthenticated && renderIcon(FaStar, () => navigate('/favorites'))}
    </div>
  );
};

export default Sidebar;
