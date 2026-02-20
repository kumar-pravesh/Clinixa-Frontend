import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    AlertCircle,
    Calendar,
    CreditCard,
    MessageCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [activeToast, setActiveToast] = useState(null);
    const [loading, setLoading] = useState(true);

    const icons = {
        emergency: AlertCircle,
        appointment: Calendar,
        payment: CheckCircle2,
        system: Clock,
        success: CheckCircle2,
        error: AlertCircle,
        info: Clock,
        lab: CheckCircle2
    };
    const colors = {
        emergency: 'text-red-500',
        appointment: 'text-blue-500',
        payment: 'text-green-500',
        system: 'text-amber-500',
        success: 'text-emerald-500',
        error: 'text-rose-500',
        info: 'text-blue-500',
        lab: 'text-emerald-500'
    };
    const bgs = {
        emergency: 'bg-red-50',
        appointment: 'bg-blue-50',
        payment: 'bg-green-50',
        system: 'bg-amber-50',
        success: 'bg-emerald-50',
        error: 'bg-rose-50',
        info: 'bg-blue-50',
        lab: 'bg-emerald-50'
    };

    const formatNotification = useCallback((notif) => {
        return {
            ...notif,
            icon: icons[notif.type] || Clock,
            color: colors[notif.type] || 'text-primary',
            bg: bgs[notif.type] || 'bg-primary/5',
            time: formatTimeAgo(notif.timestamp)
        };
    }, []);

    const fetchNotifications = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            if (data.success) {
                const formatted = data.notifications.map(formatNotification);

                // Compare with old notifications to show toasts for new ones
                setNotifications(prev => {
                    const newNotifs = formatted.filter(n => !prev.find(p => p.id === n.id));
                    // Check if we have previous notifications to avoid toasts on initial load
                    if (newNotifs.length > 0 && prev.length > 0) {
                        // Show toast for the most recent unread notification
                        const latestUnread = newNotifs.find(n => !n.read);
                        if (latestUnread) setActiveToast(latestUnread);
                    }
                    return formatted;
                });
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    }, [formatNotification]);

    // Initial fetch and polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications(true);
        }, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const addNotification = useCallback((notif) => {
        // For local feedback (transient, until next poll)
        const newNotif = {
            id: `${Date.now()}-${Math.random()}`,
            type: notif.type || 'system',
            title: notif.title,
            message: notif.message,
            time: 'Just now',
            read: false,
            icon: icons[notif.type] || Clock,
            color: colors[notif.type] || 'text-amber-500',
            bg: bgs[notif.type] || 'bg-amber-50'
        };

        setNotifications(prev => [newNotif, ...prev]);
        setActiveToast(newNotif);
    }, []);

    const markAsRead = useCallback(async (id) => {
        try {
            // Handle summary notifications which might not have numeric IDs
            if (typeof id === 'number') {
                await notificationService.markAsRead(id);
            }
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const value = useMemo(() => ({
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        activeToast,
        setActiveToast,
        unreadCount,
        loading,
        refresh: fetchNotifications
    }), [notifications, addNotification, markAsRead, markAllAsRead, clearNotification, activeToast, unreadCount, loading, fetchNotifications]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Helper
function formatTimeAgo(date) {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

