import React, { createContext, useContext, useState, useEffect } from 'react';

const QueueContext = createContext();

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};

export const QueueProvider = ({ children }) => {
    // Initial mock data
    const [tokens, setTokens] = useState([
        { id: 'TK-1024', patient: 'John Doe', dept: 'General Medicine', doctor: 'Dr. Smith', status: 'Waiting', time: '10:30 AM', mobile: '9876543210' },
        { id: 'TK-1025', patient: 'Emma Wilson', dept: 'Pediatrics', doctor: 'Dr. Brown', status: 'In Progress', time: '10:35 AM', mobile: '9876543211' },
    ]);

    const generateToken = (patientData) => {
        const nextIdNumber = tokens.length > 0
            ? Math.max(...tokens.map(t => parseInt(t.id.split('-')[1]))) + 1
            : 1000;

        const newToken = {
            id: `TK-${nextIdNumber}`,
            patient: patientData.name || patientData.patient,
            dept: patientData.dept || 'General Medicine',
            doctor: patientData.doctor || 'Dr. Smith',
            mobile: patientData.mobile,
            status: 'Waiting',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTokens(prev => [newToken, ...prev]);
        return newToken;
    };

    const updateTokenStatus = (tokenId, newStatus) => {
        setTokens(prev => prev.map(t =>
            t.id === tokenId ? { ...t, status: newStatus } : t
        ));
    };

    const deleteToken = (tokenId) => {
        setTokens(prev => prev.filter(t => t.id !== tokenId));
    };

    return (
        <QueueContext.Provider value={{ tokens, generateToken, updateTokenStatus, deleteToken }}>
            {children}
        </QueueContext.Provider>
    );
};
