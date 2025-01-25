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

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [approvalReason, setApprovalReason] = useState("");

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

  const handleStatusUpdate = async (status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/AppointmentRequest/UpdateAppointmentRequestStatus/${currentAppointment.id}`,
        { 
          status: status, 
          approvedReason: approvalReason 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setAppointments(appointments.map(app => 
        app.id === currentAppointment.id 
          ? { ...app, status: status } 
          : app
      ));

      setStatusDialogOpen(false);
      setCurrentAppointment(null);
      setApprovalReason("");
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing appointment:`, error);
    }
  };

  const openStatusDialog = (appointment) => {
    setCurrentAppointment(appointment);
    setStatusDialogOpen(true);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Appointment Requests
      </Typography>

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
                      color="primary"
                      onClick={() => openStatusDialog(appointment)}
                      disabled={appointment.status !== "Pending"}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}



      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Reason for Status Change"
            fullWidth
            multiline
            rows={2}
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusUpdate("Approve")} 
            color="primary" 
            variant="contained"
          >
            Approve
          </Button>
          <Button 
            onClick={() => handleStatusUpdate("Reject")} 
            color="error" 
            variant="contained"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentApproval;