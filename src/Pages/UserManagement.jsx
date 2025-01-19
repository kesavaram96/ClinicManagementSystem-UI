import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Box,
  Modal,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
    email: "",
    roleName: "",
    phoneNumber: "",
    fullName: "",
    address: "",
    personalDetails: {}
  });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/User/Users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/User/DeleteUser?userId=${userId}`);
        setUsers(users.filter((user) => user.userId !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (userId) => {
    try {
      const response = await axios.get(`/User/User?userId=${userId}`);
      if (response.status === 200) {
        const userData = response.data;
        setEditFormData({
          ...userData,
        });
        setEditOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user for update:", error);
    }
  };

  const handleView = async (userId) => {
    try {
      const response = await axios.get(`/User/User?userId=${userId}`);
      if (response.status === 200) {
        setUserData(response.data);
        setViewOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleCreateNewUser = () => {
    navigate('/home/createuser');
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      if (name === 'roleName') {
        // Reset personal details when role changes
        setEditFormData(prev => ({
          ...prev,
          [name]: value,
          personalDetails: {
            role: value // Set the role field to match the selected role
          }
        }));
      } else {
        setEditFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleSubmitUpdate = async (userId) => {
    try {
      const { userId, ...requestBody } = {
        ...editFormData
        
        
      };
      
      await axios.put(`/User/EditUser?userId=${userId}`, requestBody);
      setEditOpen(false);
      alert('Update successful!');
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  
  
  return (
    <>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "5px" }}>
        <Typography variant="h5" gutterBottom>
          Users List
        </Typography>
        <Box display="flex" justifyContent="flex-end" style={{ marginBottom: "20px" }}>
          <Button variant="contained" color="primary" onClick={handleCreateNewUser}>
            Create New User
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roleNames.length > 0 ? user.roleNames.join(", ") : "No Roles"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="default" onClick={() => handleView(user.userId)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleUpdate(user.userId)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(user.userId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "#fff",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: "80%",
          overflowY: "auto",
        }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            User Information
          </Typography>

          {userData ? (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Username:</strong> {userData.username}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Email:</strong> {userData.email}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Role:</strong> {userData.roleName}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Phone:</strong> {userData.phoneNumber || "N/A"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Full Name:</strong> {userData.fullName || "N/A"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Address:</strong> {userData.address || "N/A"}
              </Typography>
              
              
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button onClick={() => setViewOpen(false)} variant="outlined" color="primary">
                  Close
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ mt: 2, textAlign: "center" }}>Loading...</Typography>
          )}
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "#fff",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
            Edit User
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editFormData.username}
                onChange={handleEditInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                onChange={handleEditInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="roleName"
                  value={editFormData.roleName}
                  onChange={handleEditInputChange}
                  label="Role"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                  <MenuItem value="Patient">Patient</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={handleEditInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleEditInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editFormData.address}
                onChange={handleEditInputChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>

            
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button onClick={() => setEditOpen(false)} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button onClick={() => handleSubmitUpdate(editFormData.userId)} variant="contained" color="primary">
              Update User
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserManagement;