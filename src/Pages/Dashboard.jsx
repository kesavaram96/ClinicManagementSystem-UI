import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  LocalHospital as HospitalIcon, 
  Person as PatientIcon, 
  AssignmentTurnedIn as ReportIcon 
} from '@mui/icons-material';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedReports: 0,
    monthlyPatientGrowth: [],
    recentPatients: [],
    appointmentStats: []
  });

  useEffect(() => {
    // Mock data fetch - replace with actual API calls
    const fetchDashboardData = async () => {
      try {
        // Simulated data
        setDashboardData({
          totalPatients: 1245,
          totalAppointments: 456,
          completedReports: 389,
          monthlyPatientGrowth: [
            { month: 'Jan', patients: 100 },
            { month: 'Feb', patients: 120 },
            { month: 'Mar', patients: 150 },
            { month: 'Apr', patients: 180 },
            { month: 'May', patients: 200 }
          ],
          recentPatients: [
            { id: 1, name: 'John Doe', age: 45, lastVisit: '2024-01-15' },
            { id: 2, name: 'Jane Smith', age: 32, lastVisit: '2024-01-20' },
            { id: 3, name: 'Mike Johnson', age: 55, lastVisit: '2024-01-25' }
          ],
          appointmentStats: [
            { status: 'Pending', count: 50 },
            { status: 'Completed', count: 200 },
            { status: 'Cancelled', count: 20 }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Key Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PatientIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Total Patients</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {dashboardData.totalPatients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HospitalIcon sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6">Total Appointments</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {dashboardData.totalAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReportIcon sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6">Completed Reports</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {dashboardData.completedReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Growth Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Monthly Patient Growth
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.monthlyPatientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Appointment Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Appointment Status
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.appointmentStats.map((stat) => (
                      <TableRow key={stat.status}>
                        <TableCell>{stat.status}</TableCell>
                        <TableCell align="right">{stat.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Patients */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Patients
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Last Visit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2 }}>
                              {patient.name[0]}
                            </Avatar>
                            {patient.name}
                          </Box>
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;