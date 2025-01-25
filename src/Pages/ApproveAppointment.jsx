import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActions,
  CircularProgress,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const ApproveAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/Appointment/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      })
      .then(response => {
        const processedAppointments = response.data.map(appointment => ({
          ...appointment,
          isCompleted: appointment.status === 'Completed',
          isCancelled: appointment.status === 'Cancelled',
          isAttending: appointment.status === 'Attending'
        }));
        setAppointments(processedAppointments);

        const initialDisabledState = {};
        processedAppointments.forEach(appointment => {
          initialDisabledState[appointment.appointmentId] =
            appointment.isCompleted || appointment.isCancelled || appointment.isAttending;
        });

        setDisabledButtons(initialDisabledState);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (appointment, status) => {
    if (status === "Attend") {
      navigate(`/home/DiagnoseReportScreen/${appointment.patientId}/${appointment.appointmentId}`);
    } else if (status === "Cancel") {
      axios
        .put(`/Appointment/update/${appointment.appointmentId}`, {
          doctorId: appointment.doctorId,
          clinicId: appointment.clinicId,
          username: appointment.patientName,
          appointmentDate: appointment.appointmentDate,
          status: "Cancelled",
        })
        .then(() => {
          setDisabledButtons(prev => ({ ...prev, [appointment.appointmentId]: true }));
        })
        .catch(error => console.error("Error updating appointment:", error));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Attending":
        return "success"; // Green for Attending
      case "Cancelled":
        return "error"; // Red for Cancel
      case "Scheduled":
        return "warning"; // Yellow for Scheduled
      case "Completed":
        return "primary"; // Blue for Completed
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Appointments
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {appointments.map(appointment => (
            <Grid item xs={12} sm={6} md={4} key={appointment.appointmentId}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h3" component="span" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                      {appointment.lineNumber}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Typography variant="h6" color="textSecondary" sx={{ marginTop: 1 }}>
                    {appointment.patientName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                    {appointment.clinicName} - {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => handleUpdate(appointment, "Attend")}
                      disabled={disabledButtons[appointment.appointmentId] || appointment.status === 'Completed' || appointment.status === 'Cancelled' || appointment.status === 'Attending'}
                    >
                      Attend
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleUpdate(appointment, "Cancel")}
                      disabled={disabledButtons[appointment.appointmentId] || appointment.status === 'Completed' || appointment.status === 'Cancelled' || appointment.status === 'Attending'}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ApproveAppointment;
