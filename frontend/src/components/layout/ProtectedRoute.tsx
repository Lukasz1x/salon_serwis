import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasRole(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}