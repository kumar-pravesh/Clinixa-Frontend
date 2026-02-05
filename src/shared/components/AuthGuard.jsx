import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthGuard - A universal component to protect routes.
 * It checks localStorage for authentication status and role matching.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authenticated
 * @param {string} props.requiredRole - Role required to access the route
 */
const AuthGuard = ({ children, requiredRole }) => {
    const location = useLocation();

    // Check if user is logged in
    const isLogged = localStorage.getItem('isLogged') === 'true';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    // Admin backward compatibility (if needed)
    const adminIsLogged = localStorage.getItem('adminIsLogged') === 'true';

    // If not logged in, redirect to login page with state for redirection after login
    if (!isLogged && !adminIsLogged) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If role is required but doesn't match, redirect to landing page (or unauthorized page)
    if (requiredRole && role !== requiredRole) {
        // Exception for legacy admin check until fully migrated
        if (requiredRole === 'admin' && adminIsLogged) {
            return children;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthGuard;
