import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookAppointment from './BookAppointment';
import AppointmentPage from './AppointmentPage';
import AppointmentRequest from './AppointmentRequest';
import AppointmentApproval from './AppointmentApproval';
import ApproveAppointment from './ApproveAppointment';

function AppointmentRoutes() {
  return (
    <Routes>
      <Route path="book" element={<BookAppointment />} />
      <Route path="manage" element={<AppointmentPage />} />
      <Route path="request" element={<AppointmentRequest />} />
      <Route path="approval" element={<AppointmentApproval />} />
      <Route path="approve" element={<ApproveAppointment />} />
    </Routes>
  );
}

export default AppointmentRoutes;