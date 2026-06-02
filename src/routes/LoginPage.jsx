import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const loginSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    // Send them back to where they came from, or /accounts by default
    const redirectTo = location.state?.from?.pathname || '/accounts';

    async function handleSubmit(values, { setSubmitting }) {
        setError(null);
        try {
            await login(values.username, values.password);
            navigate(redirectTo, { replace: true });
        }
        catch (err) {
            const message = err.response?.data?.message
            || (err.response?.status === 401 ? 'Invalid username or password' : 'Login failed');
            setError(message);
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Log in to JD Bank</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                    >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="username"
                                label="Username"
                                fullWidth
                                margin="normal"
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                autoFocus
                                />
                            <Field
                                as={TextField}
                                name="password"
                                type="password"
                                label="Password"
                                fullWidth
                                margin="normal"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                />
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? <CircularProgress size={20} /> : 'Log in'}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}