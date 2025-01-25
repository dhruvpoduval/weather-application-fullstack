import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ logout }) => {
  const [user, setUser] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [preferredUnit, setPreferredUnit] = useState('Celsius');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `${token}`
            }
          });
          setUser(response.data);
          setPreferredUnit(response.data.preferredUnit || 'Celsius');
        } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/login');
        }
      };

      fetchUserProfile();
    }
  }, [navigate, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/update-unit', {
        preferredUnit
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });
      alert('Temperature unit updated successfully');
    } catch (error) {
      console.error('Error updating unit:', error);
      alert('Failed to update temperature unit');
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {user && user.name && user.email ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          
          {/* Temperature Unit Selection */}
          <form onSubmit={handleUpdateUnit}>
            <label htmlFor="unit">Preferred Temperature Unit:</label>
            <select
              id="unit"
              value={preferredUnit}
              onChange={(e) => setPreferredUnit(e.target.value)}
            >
              <option value="Celsius">Celsius</option>
              <option value="Fahrenheit">Fahrenheit</option>
            </select>
            <button type="submit">Update Unit</button>
          </form>

          {/* Change Password Toggle */}
          <div className="toggle-button" onClick={() => setShowChangePassword(!showChangePassword)}>
            {showChangePassword ? 'Cancel Change Password' : 'Change Password'}
          </div>
          
          {/* Conditional Render for Change Password Form */}
          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="change-password-section">
              <div>
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Change Password</button>
            </form>
          )}
        </div>
      ) : (
        <p className="loading-text">Loading user information...</p>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
