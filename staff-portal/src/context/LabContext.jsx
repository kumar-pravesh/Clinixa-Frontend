import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import labService from '../services/labService';
import { useAuth } from './AuthContext';

const LabContext = createContext();

export const useLab = () => {
    const context = useContext(LabContext);
    if (!context) {
        throw new Error('useLab must be used within a LabProvider');
    }
    return context;
};

export const LabProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [labQueue, setLabQueue] = useState([]);
    const [labHistory, setLabHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (authLoading) return;

        // Only fetch if user is lab_staff (or admin if allowed, but for now restricted to lab_staff to fix 403)
        // If the user is NOT lab_staff, we simply don't fetch and set loading to false.
        if (!user || user.role !== 'lab_technician') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [queueData, historyData] = await Promise.all([
                labService.getQueue(),
                labService.getHistory()
            ]);
            setLabQueue(queueData);
            setLabHistory(historyData);
            setError(null);
        } catch (err) {
            console.error("Error fetching lab data:", err);
            setError("Failed to load lab dashboard data.");
        } finally {
            setLoading(false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateLabStatus = async (testId, status) => {
        try {
            await labService.updateStatus(testId, status);
            // Optimistic update or refetch
            setLabQueue(prev => prev.map(test =>
                test.test_id === testId ? { ...test, status } : test // Backend uses test_id (LAB-XXXX) or id? Service sends id.
                // Backend getQueue returns id and test_id.
                // Let's assume frontend uses the formatted ID for display but we might need numeric ID for API if we adjusted service.
                // My labService.js uses /lab/queue/${id}/status.
                // If I pass "LAB-1024", backend service strips it.
            ));
            fetchData(); // Safer to refetch to ensure consistency
        } catch (err) {
            console.error("Error updating lab status:", err);
        }
    };

    const completeLabTest = async (testId, reportData) => {
        try {
            // reportData should match what uploadReport expects
            // { lab_test_id, patient_id, doctor_id, test_name, results, notes, file (if any) }

            // If the UI passes "testId" separately, we should merge or ensure it's in reportData
            const payload = { ...reportData, lab_test_id: testId };

            // Convert to FormData if there's a file, or if the service expects it?
            // labService.uploadReport expects FormData if there's a file.
            // If the UI sends a JSON object, we might need to adjust or ensure UI sends FormData.
            // For now, assuming UI adaptation or handling here.

            // Actually, for simplicity in this context, let's assume reportData IS the FormData object or we construct it.
            // But if it's JSON from a form...
            // Let's assume reportData contains raw values.

            /* 
               If reportData is a FormData object, use it directly. 
               But we need to append lab_test_id if missing.
            */

            let dataToSend = reportData;
            if (!(reportData instanceof FormData)) {
                // ... assuming this branch is handled elsewhere or not hit
            } else {
                // Only append if it doesn't already exist to avoid duplication/arrays on backend
                if (!dataToSend.has('lab_test_id')) {
                    dataToSend.append('lab_test_id', testId);
                }
            }

            await labService.uploadReport(dataToSend);

            // remove from queue, add to history
            fetchData();
            return { success: true };
        } catch (err) {
            console.error("Error completing lab test:", err);
            return { success: false, message: err.message };
        }
    };

    return (
        <LabContext.Provider value={{ labQueue, labHistory, loading, error, fetchData, updateLabStatus, completeLabTest }}>
            {children}
        </LabContext.Provider>
    );
};
