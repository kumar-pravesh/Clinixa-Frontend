import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    AlertCircle,
    Calendar,
    CreditCard,
    MessageCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';

import { adminService } from '../services/adminService';

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

    const mapNotification = (notif) => {
        const icons = {
            'NEW_APPOINTMENT': Calendar,
            'EMERGENCY': AlertCircle,
            'PAYMENT': CheckCircle2,
        };
        const colors = {
            'NEW_APPOINTMENT': 'text-blue-500',
            'EMERGENCY': 'text-red-500',
            'PAYMENT': 'text-green-500',
        };
        const bgs = {
            'NEW_APPOINTMENT': 'bg-blue-50',
            'EMERGENCY': 'bg-red-50',
            'PAYMENT': 'bg-green-50',
        };

        return {
            id: notif.id,
            title: notif.type.replace('_', ' '),
            message: notif.message,
            time: new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: !!notif.is_read,
            icon: icons[notif.type] || Clock,
            color: colors[notif.type] || 'text-amber-500',
            bg: bgs[notif.type] || 'bg-amber-50'
        };
    };

    const fetchNotifications = async () => {
        try {
            const data = await adminService.getNotifications();
            setNotifications(data.map(mapNotification));
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    // Initial fetch and poll
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    // Auto-clear toast after 5 seconds
    useEffect(() => {
        if (activeToast) {
            const timer = setTimeout(() => {
                setActiveToast(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [activeToast]);

    const addNotification = useCallback((notif) => {
        // This is for local manual notifications (e.g. from UI actions)
        const toast = {
            id: Date.now(),
            ...notif,
            time: 'Just now',
            read: false,
            icon: notif.type === 'error' ? AlertCircle : CheckCircle2,
            color: notif.type === 'error' ? 'text-red-500' : 'text-emerald-500',
            bg: notif.type === 'error' ? 'bg-red-50' : 'bg-emerald-50'
        };
        setActiveToast(toast);
    }, []);

    const markAsRead = useCallback(async (id) => {
        try {
            await adminService.markRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(() => {
        // Backend implementation pending for bulk mark, so doing local for now
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const contextValue = useMemo(() => ({
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        activeToast,
        setActiveToast,
        unreadCount
    }), [notifications, addNotification, markAsRead, markAllAsRead, clearNotification, activeToast, unreadCount]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};
