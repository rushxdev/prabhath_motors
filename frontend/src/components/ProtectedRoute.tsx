import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) {
        // Redirect to login if not logged in
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Redirect to unauthorized page if admin access is required but user is not an admin
        return <Navigate to="/unauthorized" replace />;
    }

    // Render the protected component
    return <Outlet />;
};

export default ProtectedRoute;
