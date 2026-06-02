import { createTheme  } from '@mui/material';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1565c0' }, // JD Bank blue
        secondary: { main: '#4caf50' }, // money green
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
});