import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function AppHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/accounts"
                    sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                    JD Bank
                </Typography>
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">Hi, {user.username}</Typography>
                        <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>
                            Log out
                        </Button>
                    </Box>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Log in</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}