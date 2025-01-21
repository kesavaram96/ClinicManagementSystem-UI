import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "../axios";

const AppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // Store doctors list
  const [clinics, setClinics] = useState([]); // Store clinics list
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    clinicId: "",
    doctorId: "",
    appointmentDate: "",
    requestingReason: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicRes, doctorRes] = await Promise.all([
          axios.get("/Appointment/clinics"),
          axios.get("/Appointment/doctors"),
        ]);
        setClinics(clinicRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/AppointmentRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/AppointmentRequest",
        {
          clinicId: newAppointment.clinicId,
          doctorId: newAppointment.doctorId,
          appointmentDate: newAppointment.appointmentDate,
          requestingReason: newAppointment.requestingReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      setAppointments([...appointments, response.data]);
      setOpen(false);
      setNewAppointment({
        clinicId: "",
        doctorId: "",
        appointmentDate: "",
        requestingReason: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/AppointmentRequest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Appointment Requests
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Request Appointment
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Clinic</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Requested Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.cLinicName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.requestedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Appointment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          {/* Clinic Selection Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Clinic</InputLabel>
            <Select
              value={newAppointment.clinicId}
              onChange={(e) => setNewAppointment({ ...newAppointment, clinicId: e.target.value })}
            >
              {clinics.map((clinic) => (
                <MenuItem key={clinic.clinicId} value={clinic.clinicId}>
                  {clinic.clinicName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Doctor Selection Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={newAppointment.doctorId}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.doctorDetailsId} value={doctor.doctorDetailsId}>
                  {doctor.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Appointment Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAppointment.appointmentDate}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })
            }
          />

          <TextField
            margin="dense"
            label="Requesting Reason"
            fullWidth
            multiline
            rows={2}
            value={newAppointment.requestingReason}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, requestingReason: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentRequests;
