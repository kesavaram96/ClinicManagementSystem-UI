import React, { useState,useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import axios from "../axios";

// var roles = [];
// if(localStorage.getItem("role")==='Admin')
// {
//   roles = ["admin", "doctor", "nurse", "receptionist", "patient"];
// }
// else
// {
//   roles = ["patient"];
// }
const initialFormData = {
  username: "",
  password: "",
  email: "",
  roleName: "",
  fullName:"",
  phoneNumber:"",
  address:"",
  personalDetails: {
    role: "",
    department: "",
    position: "",
    specialization: "",
    joiningDate: "",
    shift: "",
    ward: "",
    deskLocation: "",
    assignedDoctor: "",
    medicalHistory: "",
    insuranceNumber: "",
    dateOfBirth: "",
    emergencyContactPerson: "",
    ecNumber: "",
    ecRelationship: "",
    bloodGroup: "",
  },
};

const CreateUserForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Fetch role
    if (userRole === "Admin") {
      setAvailableRoles(["admin", "doctor", "nurse", "receptionist", "patient"]);
    } else {
      setAvailableRoles(["patient"]);
    }
  }, []); // Runs once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("personalDetails.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.roleName) {
      case "admin":
        return (
          <>
            <TextField
              label="Department"
              name="personalDetails.department"
              value={formData.personalDetails.department}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Position"
              name="personalDetails.position"
              value={formData.personalDetails.position}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case "doctor":
        return (
          <>
            <TextField
              label="Specialization"
              name="personalDetails.specialization"
              value={formData.personalDetails.specialization}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Joining Date"
              name="personalDetails.joiningDate"
              type="date"
              value={formData.personalDetails.joiningDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      case "nurse":
        return (
          <>
            <TextField
              label="Shift"
              name="personalDetails.shift"
              value={formData.personalDetails.shift}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ward"
              name="personalDetails.ward"
              value={formData.personalDetails.ward}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case "receptionist":
        return (
          <>
            <TextField
              label="Desk Location"
              name="personalDetails.deskLocation"
              value={formData.personalDetails.deskLocation}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Assigned Doctor"
              name="personalDetails.assignedDoctor"
              value={formData.personalDetails.assignedDoctor}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case "patient":
        return (
          <>
            <TextField
              label="Medical History"
              name="personalDetails.medicalHistory"
              value={formData.personalDetails.medicalHistory}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Insurance Number"
              name="personalDetails.insuranceNumber"
              value={formData.personalDetails.insuranceNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              name="personalDetails.dateOfBirth"
              type="date"
              value={formData.personalDetails.dateOfBirth}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
  
    // Prepare the full data with default empty values
    const dataToSend = {
      ...formData,
      personalDetails: {
        role: formData.personalDetails.role || "",
        department: formData.personalDetails.department || "",
        position: formData.personalDetails.position || "",
        specialization: formData.personalDetails.specialization || "",
        joiningDate: formData.personalDetails.joiningDate || "2024-10-10",
        shift: formData.personalDetails.shift || "",
        ward: formData.personalDetails.ward || "",
        deskLocation: formData.personalDetails.deskLocation || "",
        assignedDoctor: formData.personalDetails.assignedDoctor || "",
        medicalHistory: formData.personalDetails.medicalHistory || "",
        insuranceNumber: formData.personalDetails.insuranceNumber || "",
        dateOfBirth: formData.personalDetails.dateOfBirth || "2024-10-10",
        emergencyContactPerson: formData.personalDetails.emergencyContactPerson || "",
        ecNumber: formData.personalDetails.ecNumber || "",
        ecRelationship: formData.personalDetails.ecRelationship || "",
        bloodGroup: formData.personalDetails.bloodGroup || "",
      },
    };
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/User/create",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("User created successfully!");
      setFormData(initialFormData); // Reset form after successful submission
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Create User
      </Typography>
      <form>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role"
          name="roleName"
          select
          value={formData.roleName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {availableRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {renderRoleSpecificFields()}

        <Box sx={{ textAlign: "center", marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
        {message && (
          <Typography
            variant="body1"
            color={message.includes("success") ? "green" : "red"}
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            {message}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default CreateUserForm;
