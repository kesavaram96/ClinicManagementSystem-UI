import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    username: "",
    doctorId: "",
    appointmentDate: "",
    clinicId: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchAppointments();
    fetchClinics();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/Appointment/getAll`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const fetchClinics = async () => {
    try {
      const response = await axios.get(`/Clinic/getAll`);
      setClinics(response.data);
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`/Appointment/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdatedStatus(appointment.status);  // Initial status set to the current value
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!selectedAppointment) return;
  
    // Prepare the updated appointment data with required fields
    const updatedAppointmentData = {
      doctorId: selectedAppointment.doctorId || 0,  // Default to 0 if no doctor selected
      clinicId: selectedAppointment.clinicId || 0,  // Default to 0 if no clinic selected
      username: selectedAppointment.patientName,   // Use the patient's username
      appointmentDate: selectedAppointment.appointmentDate,  // Current appointment date
      status: updatedStatus,  // New status entered by the user
    };
  
    try {
      // Send the updated appointment data to the backend API
      const response = await axios.put(`/Appointment/update/${selectedAppointment.appointmentId}`, updatedAppointmentData);
      console.log("Appointment updated successfully", response.data);  // Log the response for debugging
      setOpenEdit(false);  // Close the dialog
      fetchAppointments();  // Fetch updated appointment data
    } catch (error) {
      console.error("Error updating appointment", error);
    }
  };

  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`/appointment/delete/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error("Error deleting appointment", error);
      }
    }
  };

  const handleCreateOpen = () => {
    setNewAppointment({
      username: "",
      doctorId: "",
      appointmentDate: "",
      clinicId: "",
    });
    setOpenCreate(true);
  };

  const handleCreate = async () => {
    try {
      await axios.post(`/Appointment/book`, newAppointment);
      setOpenCreate(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error booking appointment", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Appointment Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleCreateOpen}
        style={{ marginBottom: 10 }}
      >
        Book Appointment
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Clinic</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Line Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.appointmentId}>
                <TableCell>{appointment.appointmentId}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.clinicName}</TableCell>
                <TableCell>
                  {dayjs(appointment.appointmentDate).format("YYYY-MM-DD HH:mm")}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{appointment.lineNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(appointment)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(appointment.appointmentId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
<Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
  <DialogTitle>Edit Appointment Status</DialogTitle>
  <DialogContent>
    {/* Display fields for editing */}
    <TextField
      label="Status"
      fullWidth
      variant="outlined"
      value={updatedStatus}
      onChange={(e) => setUpdatedStatus(e.target.value)}
      margin="normal"
    />
    <TextField
      label="Doctor"
      fullWidth
      variant="outlined"
      value={selectedAppointment?.doctorName || ""}
      disabled
      margin="normal"
    />
    <TextField
      label="Patient"
      fullWidth
      variant="outlined"
      value={selectedAppointment?.patientName || ""}
      disabled
      margin="normal"
    />
    <TextField
      label="Clinic"
      fullWidth
      variant="outlined"
      value={selectedAppointment?.clinicName || ""}
      disabled
      margin="normal"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenEdit(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleUpdate} color="primary" variant="contained">
      Save
    </Button>
  </DialogActions>
</Dialog>



      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            name="username"
            value={newAppointment.username}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Clinic</InputLabel>
            <Select name="clinicId" value={newAppointment.clinicId} onChange={handleChange}>
              {clinics.map((clinic) => (
                <MenuItem key={clinic.clinicId} value={clinic.clinicId}>
                  {clinic.clinicName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select name="doctorId" value={newAppointment.doctorId} onChange={handleChange}>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.doctorDetailsId} value={doctor.doctorDetailsId}>
                  {doctor.fullName} ({doctor.specialization})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Appointment Date"
            type="datetime-local"
            fullWidth
            variant="outlined"
            name="appointmentDate"
            value={newAppointment.appointmentDate}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentPage;
