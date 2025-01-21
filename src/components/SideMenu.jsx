import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Divider, Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';

import ProfileMenu from './ProfileMenu';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/home/', icon: <HomeIcon /> },  // Home icon for Dashboard
  { text: 'Users', path: '/home/users', icon: <PeopleIcon /> },  // People icon for Users
  { text: 'Clinic', path: '/home/clinic', icon: <LocalHospitalIcon /> },  // Hospital icon for Clinic
  { text: 'Appointment', path: '/home/appointments', icon: <EventNoteIcon /> },  // Event icon for Appointment
  { text: 'Requests', path: '/home/appointmentRequest', icon: <EventNoteIcon /> },  // Event icon for Appointment

];


  //{ text: 'Settings', path: '/settings', icon: <SettingsIcon /> },


function SideMenu() {
  const navigate = useNavigate();

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1976d2', // Updated background color for the drawer
            color: '#fff', // Text color
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" align="center" sx={{  fontWeight: 'bold' }}>
            CMS {localStorage.getItem("role")}
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: '#fff', marginBottom: 2 }} /> {/* Divider for visual separation */}

        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0', // Hover effect
                },
                color: '#fff', // Text color on hover
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: '#fff' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Right-side profile section */}
      <ProfileMenu />
    </>
  );
}

export default SideMenu;
