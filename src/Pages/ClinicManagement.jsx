import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

//const API_BASE_URL = "http://localhost:5000/api/clinic"; // Update with your actual API URL

const ClinicManagement = () => {
   
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    clinicId: 0,
    clinicName: "",
    location: "",
    patientCapability: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Clinics from API
  useEffect(() => {
    fetchClinics();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicRes, doctorRes] = await Promise.all([
          axios.get("/Appointment/clinics"),
          axios.get("/Appointment/doctors")
        ]);
        setClinics(clinicRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await axios.get('/Clinic/getAll');
      setClinics(response.data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Dialog for Add/Edit
  const handleOpenDialog = (clinic = null) => {
    if (clinic) {
      setFormData(clinic);
      setIsEditing(true);
    } else {
      setFormData({ clinicId: 0, clinicName: "", location: "", patientCapability: "" });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Create or Update Clinic
  const handleSaveClinic = async () => {
    try {
      if (isEditing) {
        await axios.put(`/Clinic/update`, formData);
      } else {
        await axios.post(`/Clinic/create`, formData);
      }
      fetchClinics();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving clinic:", error);
    }
  };

  // Delete Clinic
  const handleDeleteClinic = async (clinicId) => {
    try {
      await axios.delete(`/Clinic/delete/${clinicId}`);
      fetchClinics();
    } catch (error) {
      console.error("Error deleting clinic:", error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Clinic Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: "20px" }}>
        Add Clinic
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Clinic Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Patient Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow key={clinic.clinicId}>
                <TableCell>{clinic.clinicId}</TableCell>
                <TableCell>{clinic.clinicName}</TableCell>
                <TableCell>{clinic.location}</TableCell>
                <TableCell>{clinic.patientCapability}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(clinic)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteClinic(clinic.clinicId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Edit Clinic" : "Add Clinic"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Clinic Name"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Patient Capability"
            name="patientCapability"
            type="number"
            value={formData.patientCapability}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveClinic} color="primary">
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClinicManagement;
