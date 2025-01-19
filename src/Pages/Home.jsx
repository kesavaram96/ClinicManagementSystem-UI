import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import SideMenu from '../components/SideMenu';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import UserCreationForm from './UserCreationForm';
import BookAppointment from './BookAppointment';
import ClinicManagement from './ClinicManagement';
import AppointmentPage from './AppointmentPage';
// import Profile from './Profile';
// import Settings from './Settings';

const drawerWidth = 240;

function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Fixed Side Menu */}
      <SideMenu />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 1,
          marginLeft: `10px`, // Ensures content does not overlap with the side menu
        }}
      >
        <Toolbar /> {/* Pushes content below the fixed toolbar */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="createuser" element={<UserCreationForm />} />
          <Route path="bookappointments" element={<BookAppointment />} />
          <Route path="clinic" element={<ClinicManagement />} />
          <Route path="appointments" element={<AppointmentPage />} />





          {/* Uncomment or add more routes as needed */}
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Box>
    </Box>
  );
}

export default Home;
