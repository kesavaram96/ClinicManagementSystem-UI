import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Open the menu when the SettingsIcon is clicked
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null); // Reset the anchor element to close the menu
  };

  // Navigate to the Profile page
  const handleProfileClick = () => {
    navigate('/profile'); // Redirect to profile page
    handleMenuClose(); // Close the menu after navigation
  };

  // Navigate to the Login page (Logout function)
  const handleLogout = () => {
    // Clear authentication data (optional)
    localStorage.removeItem('token'); // Remove token if stored
    navigate('/logout'); // Redirect to login page
    handleMenuClose(); // Close the menu after navigation
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 20,
      right: 20,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#1976d2',
      borderRadius: '20px',
      padding: '5px 10px',
      color: '#fff',
      boxShadow: 3,
      zIndex: 9999, // Ensure it appears above other elements
    }}>
      <IconButton sx={{ color: '#fff' }}>
        <NotificationsIcon />
      </IconButton>
      <IconButton sx={{ color: '#fff' }} onClick={handleMenuOpen}>
        <SettingsIcon />
      </IconButton>

      {/* Profile dropdown menu */}
      <Menu
        anchorEl={anchorEl}  // The menu anchor point
        open={Boolean(anchorEl)}  // Menu is open if anchorEl is set
        onClose={handleMenuClose}  // Close the menu when clicking outside
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileMenu;
