import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                console.log('ProtectedRoute: No user, redirecting to /login');
                navigate('/login', { state: { from: location }, replace: true });
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                console.log('ProtectedRoute: Unauthorized role, redirecting to dashboard');
                const defaultPath = user.role === 'admin' ? '/admin' :
                    user.role === 'lab_technician' ? '/lab' :
                        user.role === 'doctor' ? '/doctor' :
                            user.role === 'receptionist' ? '/reception' : '/';
                navigate(defaultPath, { replace: true });
            }
        }
    }, [user, loading, allowedRoles, location, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse text-xs tracking-widest uppercase">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return null; // Navigation is handled by useEffect
    }

    return children;
};

export default ProtectedRoute;
