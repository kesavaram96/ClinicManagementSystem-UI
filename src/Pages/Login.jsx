import * as React from 'react';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, IconButton } from '@mui/material';
import { keyframes } from '@mui/system';
import axios from '../axios'; // Add axios for API calls
import Clinic from '../images/Clinic.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
 

// Define keyframes animation for the image
const zoomIn = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
`;

const Login = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleCollapse = () => {
    setOpen(!open);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/User/Login', {
        Username: userName,
        Password: password,
      });

      if (response.data.message === 'Success' && response.data.status === true) {
        localStorage.setItem('token', response.data.token); // Store the token locally

        const decodedToken = jwtDecode(response.data.token);
        console.log("Decoded Token:", decodedToken); // Debugging
  
        // Extract username and role
        const username = decodedToken.unique_name;
        const role = decodedToken.role;

        localStorage.setItem('username', username);
        localStorage.setItem('role', role);

        alert('Login successful!');
        navigate('/home ');
      } else {
        alert('Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ bgcolor: '#eef5ff', padding: '3rem', borderRadius: '15px' }}>
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <Grid container>
            {/* Left side with animated image */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                bgcolor: '#d1e8ff',
                animation: `${zoomIn} 6s ease-in-out infinite alternate`,
              }}
            >
              <Box
                component="img"
                src={Clinic}
                alt="Clinic"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                }}
              />
            </Grid>

            {/* Right side with collapsible login form */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#fafafa',
              }}
            >
              <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
                Clinic Management System
              </Typography>

              <Typography variant="h6" align="center" gutterBottom sx={{ color: '#666' }}>
                Login to Your Account
              </Typography>

              {/* Button to expand/collapse form */}
              <IconButton
                onClick={handleCollapse}
                sx={{
                  display: 'block',
                  margin: '1rem auto',
                  bgcolor: '#1976d2',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#115293',
                  },
                }}
              >
                <ExpandMoreIcon />
              </IconButton>

              <form onSubmit={handleSubmit}>
                {/* Collapsible form section */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="username"
                          label="Username"
                          variant="outlined"
                          placeholder="Enter your username"
                          sx={{
                            borderColor: '#1976d2',
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#1976d2',
                              },
                            },
                          }}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="password"
                          label="Password"
                          variant="outlined"
                          type="password"
                          placeholder="Enter your password"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#1976d2',
                              },
                            },
                          }}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{
                            padding: '0.9rem',
                            fontSize: '1rem',
                            bgcolor: '#1976d2',
                            '&:hover': {
                              bgcolor: '#115293',
                            },
                          }}
                        >
                          Login
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Login;
