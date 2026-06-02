import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function ProtectedRoute() {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Save where they were trying to go so we can send them back after login
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}