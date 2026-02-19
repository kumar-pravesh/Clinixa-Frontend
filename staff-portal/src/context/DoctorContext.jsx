import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import doctorService from '../services/doctorService';
import { useNotification } from './NotificationContext';

const DoctorContext = createContext();

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addNotification } = useNotification();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all initial data in parallel
            const [patientsData, appointmentsData, prescriptionsData, reportsData] = await Promise.all([
                doctorService.getPatients(),
                doctorService.getAppointments(),
                doctorService.getPrescriptions(),
                doctorService.getLabReports()
            ]);

            setPatients(patientsData);
            setAppointments(appointmentsData);
            setPrescriptions(prescriptionsData);
            setLabReports(reportsData);
            setError(null);
        } catch (err) {
            console.error("Error fetching doctor data:", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Actions ---

    const addPrescription = async (newPrescription) => {
        try {
            await doctorService.createPrescription(newPrescription);

            // Add local notification
            const patient = patients.find(p => String(p.id) === String(newPrescription.patientId));
            addNotification({
                type: 'success',
                title: 'Prescription Created',
                message: `New prescription for ${patient?.name || 'Patient'} has been issued.`
            });

            // Re-fetch or update local state
            const updatedPrescriptions = await doctorService.getPrescriptions();
            setPrescriptions(updatedPrescriptions);
            return { success: true };
        } catch (err) {
            console.error("Error creating prescription:", err);
            addNotification({
                type: 'error',
                title: 'Prescription Failed',
                message: err.message
            });
            return { success: false, message: err.message };
        }
    };

    const requestLabTest = async (testData) => {
        try {
            const result = await doctorService.requestLabTest(testData);

            addNotification({
                type: 'success',
                title: 'Lab Test Ordered',
                message: `Lab test for ${testData.testName} has been ordered.`
            });

            // Re-fetch to update stats if necessary, though it might not show in reports yet
            // fetchData(); 
            return { success: true, data: result };
        } catch (err) {
            console.error("Error ordering lab test:", err);
            addNotification({
                type: 'error',
                title: 'Ordering Failed',
                message: err.message
            });
            return { success: false, message: err.message };
        }
    };

    const uploadLabReport = async (formData) => {
        try {
            await doctorService.uploadLabReport(formData);

            addNotification({
                type: 'success',
                title: 'Report Uploaded',
                message: 'Lab report has been uploaded successfully.'
            });

            const updatedReports = await doctorService.getLabReports();
            setLabReports(updatedReports);
            return { success: true };
        } catch (err) {
            console.error("Error uploading lab report:", err);
            addNotification({
                type: 'error',
                title: 'Upload Failed',
                message: err.message
            });
            return { success: false, message: err.message };
        }
    };

    // Note: Doctors usually don't "add" appointments directly in this dashboard flow,
    // but they might set follow-ups.
    const addAppointment = async (appointmentData) => {
        try {
            await doctorService.setFollowUp(appointmentData);

            addNotification({
                type: 'appointment',
                title: 'Appointment Scheduled',
                message: `A ${appointmentData.type} has been set for ${appointmentData.patient} at ${appointmentData.time}.`
            });

            const updated = await doctorService.getAppointments();
            setAppointments(updated);
            return { success: true };
        } catch (err) {
            console.error("Error setting appointment:", err);
            addNotification({
                type: 'error',
                title: 'Scheduling Failed',
                message: err.message
            });
            return { success: false, message: err.message };
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            await doctorService.updateAppointmentStatus(id, status);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

            addNotification({
                type: 'info',
                title: 'Status Updated',
                message: `Appointment status changed to ${status}.`
            });
        } catch (err) {
            console.error("Error updating appointment status:", err);
        }
    };

    const updateLabReportStatus = (id, status) => {
        // Lab reports status is usually updated by LAB technician.
        setLabReports(labReports.map(rpt =>
            rpt.id === id ? { ...rpt, status } : rpt
        ));
    };

    const getPatientStats = () => {
        const today = new Date().toLocaleDateString('en-CA');
        return {
            totalPatients: patients.length,
            appointmentsToday: appointments.filter(a => a.date === today && a.status !== 'Completed' && a.status !== 'Cancelled').length,
            pendingReports: labReports.filter(r => r.status === 'Pending').length,
            criticalCases: patients.filter(p => p.diagnosis && p.diagnosis.toLowerCase().includes('critical')).length
        };
    };

    const value = {
        patients,
        appointments,
        prescriptions,
        labReports,
        loading,
        error,
        fetchData, // Allow components to refresh data manually
        addPrescription,
        addAppointment,
        requestLabTest,
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
