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

    // ONLY the 'admin' role requires a login session for now
    if (requiredRole === 'admin') {
        const isLogged = localStorage.getItem('isLogged') === 'true';
        const adminIsLogged = localStorage.getItem('adminIsLogged') === 'true';

        if (!isLogged && !adminIsLogged) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role;

        if (role !== 'admin' && !adminIsLogged) {
            return <Navigate to="/" replace />;
        }
    }

    // Direct access for other roles (patient, doctor, etc.) as requested
    return children;
};

export default AuthGuard;
