import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <Container sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4">Page not found</Typography>
            <Button component={Link} to="/accounts" sx={{ mt: 2 }} variant="contained">
                Back to accounts
            </Button>
        </Container>
    );
}