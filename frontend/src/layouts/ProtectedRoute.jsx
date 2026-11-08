
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// Protected Route Component
export default function ProtectedRoute({
    children,
    adminOnly = false
}) {
    const { user, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="empty">
                Loading…
            </div>
        );
    }

    // Redirect unauthenticated users
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Restrict access to admin-only routes
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}
