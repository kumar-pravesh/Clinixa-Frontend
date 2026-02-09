import React, { createContext, useContext, useState } from 'react';

const LabContext = createContext();

export const useLab = () => {
    const context = useContext(LabContext);
    if (!context) {
        throw new Error('useLab must be used within a LabProvider');
    }
    return context;
};

export const LabProvider = ({ children }) => {
    const [labQueue, setLabQueue] = useState([
        {
            id: 'LAB-1024',
            patient: 'John Doe',
            patientId: 'PID-8824',
            test: 'Complete Blood Count (CBC)',
            priority: 'Urgent',
            status: 'Pending',
            time: '10 min ago',
            department: 'Hematology',
            category: 'Blood Work'
        },
        {
            id: 'LAB-1025',
            patient: 'Emma Wilson',
            patientId: 'PID-7721',
            test: 'Liver Function Test',
            priority: 'Routine',
            status: 'In Progress',
            time: '25 min ago',
            department: 'Biochemistry',
            category: 'Organ Function'
        },
        {
            id: 'LAB-1026',
            patient: 'Robert Brown',
            patientId: 'PID-3301',
            test: 'Thyroid Profile',
            priority: 'Routine',
            status: 'Pending',
            time: '45 min ago',
            department: 'Endocrinology',
            category: 'Hormonal'
        },
        {
            id: 'LAB-1027',
            patient: 'Sarah Jenkins',
            patientId: 'PID-4492',
            test: 'Blood Glucose',
            priority: 'Urgent',
            status: 'Pending',
            time: '1 hour ago',
            department: 'Biochemistry',
            category: 'Metabolic'
        },
    ]);

    const [labHistory, setLabHistory] = useState([
        {
            id: 'LAB-1020',
            patient: 'James Wilson',
            patientId: 'PID-5501',
            test: 'COVID-19 RT-PCR',
            date: '2026-02-06',
            status: 'Delivered',
            technician: 'LT-01',
            results: [
                { parameter: 'SARS-CoV-2 RNA', result: 'Negative', range: 'Negative', unit: 'N/A', status: 'Normal' }
            ],
            notes: 'Patient shows no active viral load. Recommendation: Standard precautions.'
        },
        {
            id: 'LAB-1021',
            patient: 'Mary Garcia',
            patientId: 'PID-9920',
            test: 'Blood Glucose (Fasting)',
            date: '2026-02-06',
            status: 'Delivered',
            technician: 'LT-02',
            results: [
                { parameter: 'Fasting Plasma Glucose', result: '142', range: '70-99', unit: 'mg/dL', status: 'High' }
            ],
            notes: 'Elevated glucose levels noted. Clinical correlation with HbA1c recommended.'
        },
    ]);

    const updateLabStatus = (testId, status) => {
        setLabQueue(prev => prev.map(test =>
            test.id === testId ? { ...test, status } : test
        ));
    };

    const completeLabTest = (testId, reportData) => {
        const testToComplete = labQueue.find(t => t.id === testId);
        if (!testToComplete) return;

        // Remove from queue
        setLabQueue(prev => prev.filter(t => t.id !== testId));

        // Add to history
        const newHistoryRecord = {
            ...testToComplete,
            ...reportData,
            date: new Date().toISOString().split('T')[0],
            status: 'Delivered',
            technician: 'LT-01' // Mocked technician
        };
        setLabHistory(prev => [newHistoryRecord, ...prev]);
    };

    return (
        <LabContext.Provider value={{ labQueue, labHistory, updateLabStatus, completeLabTest }}>
            {children}
        </LabContext.Provider>
    );
};
