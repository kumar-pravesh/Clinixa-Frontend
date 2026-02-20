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
                    console.log('Persistence: Restoring user session');
                    setUser(data.user);
                }
            } catch (err) {
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
        try {
            const data = await authService.login(credentials);

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            // Validate that user object has required fields
            if (!data.user || !data.user.role) {
                throw new Error('Invalid user data received from server');
            }

            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Authentication failed');
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
