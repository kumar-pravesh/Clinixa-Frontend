import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    AlertCircle,
    Calendar,
    CreditCard,
    MessageCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'emergency',
            title: 'Emergency Case',
            message: 'Patient in Room 104 needs immediate billing clearance.',
            time: '2 mins ago',
            read: false,
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-50'
        },
        {
            id: 2,
            type: 'appointment',
            title: 'New Appointment',
            message: 'Mr. John Doe booked a consultation with Dr. Smith for 4:30 PM.',
            time: '15 mins ago',
            read: false,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        }
    ]);

    const [activeToast, setActiveToast] = useState(null);

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
        const icons = {
            emergency: AlertCircle,
            appointment: Calendar,
            payment: CheckCircle2,
            system: Clock
        };
        const colors = {
            emergency: 'text-red-500',
            appointment: 'text-blue-500',
            payment: 'text-green-500',
            system: 'text-amber-500'
        };
        const bgs = {
            emergency: 'bg-red-50',
            appointment: 'bg-blue-50',
            payment: 'bg-green-50',
            system: 'bg-amber-50'
        };

        const newNotif = {
            id: Date.now(),
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

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
        unreadCount
    }), [notifications, addNotification, markAsRead, markAllAsRead, clearNotification, activeToast, unreadCount]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
