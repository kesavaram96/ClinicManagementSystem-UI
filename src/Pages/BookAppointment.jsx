import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "../axios";

const BookAppointment = () => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    UserName: "", // Assuming username instead of patientId
    doctorId: "",
    clinicId: "",
    appointmentDate: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        };
  
        const [clinicRes, doctorRes] = await Promise.all([
          axios.get("/Appointment/clinics", config),
          axios.get("/Appointment/doctors", config),
        ]);
  
        setClinics(clinicRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/Appointment/book", formData);
      setSuccessMessage(`Appointment booked successfully! Line Number: ${response.data.lineNumber}`);
      setOpenSnackbar(true);
      setFormData({ UserName: "", doctorId: "", clinicId: "", appointmentDate: "" });
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Book an Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Patient UserName"
          type="text"
          name="UserName"
          value={formData.UserName}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Clinic</InputLabel>
          <Select name="clinicId" value={formData.clinicId} onChange={handleChange}>
            {clinics.map((clinic) => (
              <MenuItem key={clinic.clinicId} value={clinic.clinicId}>
                {clinic.clinicName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Doctor</InputLabel>
          <Select name="doctorId" value={formData.doctorId} onChange={handleChange}>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.doctorDetailsId} value={doctor.doctorDetailsId}>
                {doctor.fullName} ({doctor.specialization})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Appointment Date"
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Book Appointment
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookAppointment;
