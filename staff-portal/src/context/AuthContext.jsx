import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authService.refresh();
                if (data.accessToken) {
                    console.log('Persistence: Saving refreshed accessToken to localStorage');
                    localStorage.setItem('accessToken', data.accessToken);
                }
                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.warn('Auth Persistence: Refresh failed or session expired');
                // Don't clear user immediately if we already have one (from login)
                // but usually checkAuth runs on mount
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        // --- DEMO MODE BYPASS ---
        const demoUsers = {
            'admin@clinixa.life': { id: 'demo-admin', name: 'Demo Administrator', role: 'admin', email: 'admin@clinixa.life' },
            'doctor@clinixa.life': { id: 'demo-doctor', name: 'Dr. Demo Specialist', role: 'doctor', email: 'doctor@clinixa.life' },
            'receptionist@clinixa.life': { id: 'demo-reception', name: 'Demo Reception', role: 'receptionist', email: 'receptionist@clinixa.life' },
            'lab@clinixa.life': { id: 'demo-lab', name: 'Demo Lab Technician', role: 'lab_tech', email: 'lab@clinixa.life' }
        };

        if (demoUsers[credentials.email]) {
            console.log('Demo Mode: Authenticated as', credentials.email);
            const mockData = { user: demoUsers[credentials.email], accessToken: 'demo-token-' + Date.now() };
            localStorage.setItem('accessToken', mockData.accessToken);
            setUser(mockData.user);
            return mockData;
        }
        // ------------------------

        try {
            // Attempt actual login
            const data = await authService.login(credentials);
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            if (data.user && !data.user.role) {
                if (credentials.email.includes('admin')) data.user.role = 'admin';
                else if (credentials.email.includes('lab')) data.user.role = 'lab_tech';
                else if (credentials.email.includes('doc')) data.user.role = 'doctor';
                else data.user.role = 'receptionist';
            }
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Login implementation error:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Authentication system failure');
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Server-side logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
