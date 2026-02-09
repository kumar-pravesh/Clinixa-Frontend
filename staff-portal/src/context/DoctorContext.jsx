import React, { createContext, useContext, useState, useEffect } from 'react';

const DoctorContext = createContext();

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
    // --- Mock Data ---

    // Patients
    const [patients, setPatients] = useState([
        { id: 'P-1001', name: 'Alice Johnson', age: 34, gender: 'Female', diagnosis: 'Flu', lastVisit: '2023-11-10', status: 'Admitted' },
        { id: 'P-1002', name: 'Michael Smith', age: 45, gender: 'Male', diagnosis: 'Hypertension', lastVisit: '2023-11-09', status: 'Outpatient' },
        { id: 'P-1003', name: 'David Brown', age: 28, gender: 'Male', diagnosis: 'Fracture', lastVisit: '2023-11-08', status: 'Admitted' },
        { id: 'P-1004', name: 'Emily Davis', age: 52, gender: 'Female', diagnosis: 'Diabetes', lastVisit: '2023-11-07', status: 'Outpatient' },
        { id: 'P-1005', name: 'Chris Wilson', age: 40, gender: 'Male', diagnosis: 'Migraine', lastVisit: '2023-11-06', status: 'Outpatient' },
    ]);

    // Appointments
    const [appointments, setAppointments] = useState([
        { id: 1, patient: 'Alice Johnson', patientId: 'P-1001', date: new Date().toISOString().split('T')[0], time: '09:00 AM', type: 'Check-up', status: 'In Progress', reason: 'Routine Checkup' },
        { id: 2, patient: 'Michael Smith', patientId: 'P-1002', date: new Date().toISOString().split('T')[0], time: '10:30 AM', type: 'Follow-up', status: 'Waiting', reason: 'BP Check' },
        { id: 3, patient: 'David Brown', patientId: 'P-1003', date: new Date().toISOString().split('T')[0], time: '11:15 AM', type: 'Consultation', status: 'Scheduled', reason: 'Leg Pain' },
        { id: 4, patient: 'Emily Davis', patientId: 'P-1004', date: '2023-11-16', time: '02:00 PM', type: 'Check-up', status: 'Scheduled', reason: 'Diabetes Control' },
    ]);

    // Prescriptions
    const [prescriptions, setPrescriptions] = useState([
        { id: 'RX-2045', patient: 'Alice Johnson', date: '2023-11-10', medications: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' }], status: 'Active' },
        { id: 'RX-2044', patient: 'Michael Smith', date: '2023-11-09', medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }], status: 'Completed' },
    ]);

    // Lab Reports
    const [labReports, setLabReports] = useState([
        { id: 'RPT-5012', patient: 'Alice Johnson', test: 'Complete Blood Count (CBC)', date: '2023-11-10', status: 'Available' },
        { id: 'RPT-5011', patient: 'Michael Smith', test: 'Lipid Profile', date: '2023-11-09', status: 'Pending' },
    ]);

    // --- Actions ---

    const addPrescription = (newPrescription) => {
        const id = `RX-${Math.floor(Math.random() * 10000)}`;
        const date = new Date().toISOString().split('T')[0];
        setPrescriptions([{ id, date, status: 'Active', ...newPrescription }, ...prescriptions]);
    };

    const addAppointment = (newAppointment) => {
        const id = Math.floor(Math.random() * 10000);
        setAppointments([...appointments, { id, status: 'Scheduled', ...newAppointment }]);
    };

    const uploadLabReport = (report) => {
        const id = `RPT-${Math.floor(Math.random() * 10000)}`;
        const date = new Date().toISOString().split('T')[0];
        setLabReports([{ id, date, status: 'Available', ...report }, ...labReports]);
    };

    const updateAppointmentStatus = (id, status) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status } : apt
        ));
    };

    const updateLabReportStatus = (id, status) => {
        setLabReports(labReports.map(rpt =>
            rpt.id === id ? { ...rpt, status } : rpt
        ));
    };

    const getPatientStats = () => {
        return {
            totalPatients: patients.length,
            appointmentsToday: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
            pendingReports: labReports.filter(r => r.status === 'Pending').length,
            criticalCases: patients.filter(p => p.status === 'Admitted').length
        };
    };

    const value = {
        patients,
        appointments,
        prescriptions,
        labReports,
        addPrescription,
        addAppointment,
        uploadLabReport,
        updateAppointmentStatus,
        updateLabReportStatus,
        getPatientStats
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};
