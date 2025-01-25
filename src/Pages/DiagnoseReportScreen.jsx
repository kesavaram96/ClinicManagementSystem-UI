import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

const DiagnoseReportScreen = () => {
  const { patientId, appointmentId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [previousReports, setPreviousReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnoseReport, setDiagnoseReport] = useState({
    heartRate: "",
    weight: "",
    diagnose: "",
    medicines: "",
    healthStatus: "",
  });

  const HEALTH_STATUS_OPTIONS = [
    "Normal",
    "Healthy", 
    "Critical", 
    "Weak"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch diagnose reports
        const reportsResponse = await axios.get(`/DiagnoseReport?patientId=${patientId}`);
        setPreviousReports(reportsResponse.data);

        // Fetch patient details
        const patientResponse = await axios.get(`/User/${patientId}`);
        const patientDetails = patientResponse.data;
        setPatient({
          patientName: patientDetails.name,
          age: patientDetails.age,
          gender: patientDetails.gender,
          bloodGroup: patientDetails.bloodGroup
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleChange = (e) => {
    setDiagnoseReport({ ...diagnoseReport, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      // Sending a POST request for Diagnose Report
      const postResponse = await axios.post("/DiagnoseReport", {
        patientId: patientId,
        ...diagnoseReport,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      console.log("Diagnose Report submitted successfully:", postResponse);

      // Sending a PUT request to update the Appointment status
      const putResponse = await axios.put(`/Appointment/update/${appointmentId}`, {
        doctorId: 0,
        clinicId: 0,
        username: 'raama',
        appointmentDate: "2025-01-25T15:23:32.400Z",
        status: "Completed",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      console.log("Appointment status updated successfully:", putResponse);

      navigate("/home/ApproveAppointment");
    } catch (error) {
      console.error("Error submitting diagnose report:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
                Diagnose Report
              </Typography>
      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid item xs={12} md={4}>
  <Card 
    sx={{ 
      height: '100%', 
      //background: 'linear-gradient(145deg, #f0f4f8 0%, #e6eaf3 100%)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: 3 
    }}
  >
    <CardContent>
        <Typography variant="h6" gutterBottom>
            Patient Information
            </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Profile Icon or Placeholder */}
        <Grid item xs={4}>
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto'
            }}
          >
            <Typography variant="h4" color="primary">
              {patient?.patientName?.[0] || '?'}
            </Typography>
          </div>
        </Grid>
        
        {/* Patient Details */}
        <Grid item xs={8}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {patient?.patientName || 'Patient Name'}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Age:</strong> {patient?.age || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Gender:</strong> {patient?.gender || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Blood Group:</strong> {patient?.bloodGroup || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Additional Quick Info */}
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Card 
            variant="outlined" 
            sx={{ 
              p: 1, 
              textAlign: 'center', 
              background: '#f0f0f0',
              borderRadius: 2 
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Last Visit
            </Typography>
            <Typography variant="subtitle2">
              {previousReports.length > 0 
                ? new Date(previousReports[0].date).toLocaleDateString() 
                : 'No previous visits'}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card 
            variant="outlined" 
            sx={{ 
              p: 1, 
              textAlign: 'center', 
              background: '#f0f0f0',
              borderRadius: 2 
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Total Reports
            </Typography>
            <Typography variant="subtitle2">
              {previousReports.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Grid>

        {/* Previous Diagnose Reports */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Previous Diagnose Reports
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 200, overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Heart Rate</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Diagnose</TableCell>
                      <TableCell>Medicines</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previousReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>{report.heartRate}</TableCell>
                        <TableCell>{report.weight} kg</TableCell>
                        <TableCell>{report.diagnose}</TableCell>
                        <TableCell>{report.medicines}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Diagnose Report */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                New Diagnose
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Heart Rate"
                      type="text"
                      fullWidth
                      name="heartRate"
                      value={diagnoseReport.heartRate}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      fullWidth
                      name="weight"
                      value={diagnoseReport.weight}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Diagnosis"
                      type="text"
                      fullWidth
                      multiline
                      rows={4}
                      name="diagnose"
                      value={diagnoseReport.diagnose}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Medicines"
                      type="text"
                      fullWidth
                      multiline
                      rows={4}
                      name="medicines"
                      value={diagnoseReport.medicines}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Health Status</InputLabel>
                      <Select
                        name="healthStatus"
                        value={diagnoseReport.healthStatus}
                        onChange={handleChange}
                        required
                      >
                        {HEALTH_STATUS_OPTIONS.map(status => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                    >
                      Submit Diagnose Report
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiagnoseReportScreen;