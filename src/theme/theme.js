import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 }
      }
    }
  },
  palette: {
    background: { default: '#f5f5f5' },
    primary: { main: '#1565c0' },
    secondary: { main: '#7b1fa2' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

export default theme;
