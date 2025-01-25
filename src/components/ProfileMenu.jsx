import React, { useState, useEffect } from 'react';
import { Box, IconButton, Menu, MenuItem, Badge, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as signalR from '@microsoft/signalr';

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7033/notificationHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.on("ReceiveNotification", (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    return () => {
      connection.stop();
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null); 
  };

  const handleNotificationsOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile'); 
    handleMenuClose(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/logout'); 
    handleMenuClose(); 
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
      zIndex: 9999,
    }}>
      <IconButton 
        sx={{ color: '#fff' }} 
        onClick={handleNotificationsOpen}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            width: 300,
          }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem 
              key={index}
              sx={{ 
                whiteSpace: 'normal', 
                wordWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                py: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {notification.Message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleString()}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>

      <IconButton 
        sx={{ color: '#fff' }} 
        onClick={handleMenuOpen}
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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