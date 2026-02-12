import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import doctorService from '../services/doctorService';

const DoctorContext = createContext();

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            // Re-fetch or update local state
            const updatedPrescriptions = await doctorService.getPrescriptions();
            setPrescriptions(updatedPrescriptions);
            return { success: true };
        } catch (err) {
            console.error("Error creating prescription:", err);
            return { success: false, message: err.message };
        }
    };

    const uploadLabReport = async (formData) => {
        try {
            await doctorService.uploadLabReport(formData);
            const updatedReports = await doctorService.getLabReports();
            setLabReports(updatedReports);
            return { success: true };
        } catch (err) {
            console.error("Error uploading lab report:", err);
            return { success: false, message: err.message };
        }
    };

    // Note: Doctors usually don't "add" appointments directly in this dashboard flow,
    // but they might set follow-ups.
    const addAppointment = async (appointmentData) => {
        // Mapping "Add Appointment" to "Set Follow Up" for now, or just logging warning
        console.warn("addAppointment is deprecated in DoctorContext. Use setFollowUp.");
        // If it's a follow-up:
        if (appointmentData.type === 'Follow-up') {
            try {
                await doctorService.setFollowUp(appointmentData);
                const updated = await doctorService.getAppointments();
                setAppointments(updated);
            } catch (err) {
                console.error("Error setting follow-up:", err);
            }
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            await doctorService.updateAppointmentStatus(id, status);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        } catch (err) {
            console.error("Error updating appointment status:", err);
        }
    };

    const updateLabReportStatus = (id, status) => {
        // Lab reports status is usually updated by LAB technician.
        // But if doctor reviews it? Backend doesn't have "review" endpoint yet.
        // We'll update local state for UI feedback if needed, but it won't persist unless backend supports it.
        setLabReports(labReports.map(rpt =>
            rpt.id === id ? { ...rpt, status } : rpt
        ));
    };

    const getPatientStats = () => {
        const today = new Date().toISOString().split('T')[0];
        return {
            totalPatients: patients.length,
            appointmentsToday: appointments.filter(a => a.date === today && a.status !== 'Completed' && a.status !== 'Cancelled').length,
            pendingReports: labReports.filter(r => r.status === 'Pending').length, // Filter by status if available
            criticalCases: patients.filter(p => p.diagnosis && p.diagnosis.toLowerCase().includes('critical')).length // logic depends on data
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
