import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import receptionService from '../services/receptionService';
import { useAuth } from './AuthContext';

const QueueContext = createContext();

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};

export const QueueProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({
        newRegistrations: 0,
        activeQueue: 0,
        avgWaitingTime: 0,
        revenueToday: 0
    });
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        if (authLoading || !user || user.role !== 'receptionist') return;
        try {
            const data = await receptionService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        }
    }, [user, authLoading]);

    const fetchTokens = useCallback(async () => {
        if (authLoading) return;

        // Only fetch if user is receptionist
        if (!user || user.role !== 'receptionist') {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await receptionService.getTokens();
            setTokens(data);
            setError(null);
            fetchStats(); // Also fetch stats
        } catch (err) {
            console.error('Error fetching tokens:', err);
            setError('Failed to load tokens');
            // Fallback to empty array on error
            setTokens([]);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading, fetchStats]);

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    const generateToken = async (patientData) => {
        try {
            const newToken = await receptionService.generateToken(patientData);
            await fetchTokens(); // Refresh list and stats
            return newToken;
        } catch (err) {
            console.error('Error generating token:', err);
            throw err;
        }
    };

    const updateTokenStatus = async (tokenId, newStatus) => {
        console.log(`[QueueContext] Updating token ${tokenId} status to ${newStatus}`);
        try {
            await receptionService.updateTokenStatus(tokenId, newStatus);
            // Optimistic update
            setTokens(prev => prev.map(t =>
                t.id === tokenId ? { ...t, status: newStatus } : t
            ));
            fetchStats(); // Update stats (active queue counts)
        } catch (err) {
            console.error('Error updating token status:', err);
            // Revert on error
            await fetchTokens();
        }
    };

    const deleteToken = async (tokenId) => {
        console.log(`[QueueContext] Deleting token ${tokenId}`);
        try {
            await receptionService.deleteToken(tokenId);
            setTokens(prev => prev.filter(t => t.id !== tokenId));
            fetchStats();
        } catch (err) {
            console.error('Error deleting token:', err);
            throw err;
        }
    };

    return (
        <QueueContext.Provider value={{ tokens, stats, loading, error, fetchTokens, fetchStats, generateToken, updateTokenStatus, deleteToken }}>
            {children}
        </QueueContext.Provider>
    );
};
