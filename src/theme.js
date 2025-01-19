// src/theme.js
import { createTheme } from '@mui/material/styles';

// Define your color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#f50057', // Your secondary color
    },
    background: {
      default: '#f4f4f4', // Background color for the app
    },
    text: {
      primary: '#333333', // Primary text color
      secondary: '#666666', // Secondary text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
