/**
 * Appointment Reminder Scheduler — 2-hour email reminders.
 * 
 * Runs every 5 minutes. Queries upcoming confirmed appointments within a 2-hour window.
 * Uses the existing notifications table for crash-safe deduplication.
 * Uses a two-tier dedup: in-memory Set (L1) + notifications table (L2).
 */
const { pool } = require('../../config/db');
const emailDispatcher = require('../email/email.dispatcher');
const NotificationModel = require('../../models/notification.model');
const featureFlags = require('../../lib/feature-flags');

const SCHEDULER_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const REMINDER_WINDOW_HOURS = 2;
const IST_OFFSET_MINUTES = 330; // +5:30

// In-memory L1 dedup cache (survives within process lifetime)
const sentReminders = new Set();

/**
 * Parse appointment date + time string into a UTC timestamp.
 * Assumes date is a Date object and time is a string like "02:00 PM".
 * Interprets in IST timezone.
 */
const parseAppointmentDatetime = (date, timeString) => {
    try {
        // Parse time string "HH:MM AM/PM"
        const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;

        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // Create datetime in IST then convert to UTC
        const dateStr = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
        const istDatetime = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`);

        return istDatetime.getTime();
    } catch {
        return null;
    }
};

/**
 * Get current time in IST
 */
const nowIST = () => {
    return Date.now(); // We'll compare UTC timestamps, IST offset is applied in parseAppointmentDatetime
};

/**
 * Check if reminder already sent (L2: database check)
 */
const isReminderSent = async (appointmentId) => {
    try {
        const [rows] = await pool.query(
            "SELECT id FROM notifications WHERE type = 'reminder_2hr' AND link = ?",
            [`appointment:${appointmentId}`]
        );
        return rows.length > 0;
    } catch {
        return false;
    }
};

/**
 * Record reminder as sent (L2: database)
 */
const recordReminderSent = async (appointmentId, userId) => {
    try {
        await NotificationModel.create({
            userId: userId,
            type: 'reminder_2hr',
            title: 'Appointment Reminder',
            message: 'A 2-hour reminder was sent for your appointment.',
            link: `appointment:${appointmentId}`
        });
    } catch (error) {
        console.error('[Reminder] Failed to record reminder in DB:', error.message);
    }
};

/**
 * Main scheduler tick
 */
const checkAndSendReminders = async () => {
    if (!featureFlags.ENABLE_REMINDER_SCHEDULER) return;

    try {
        // Query upcoming confirmed appointments with patient/doctor details
        const [upcoming] = await pool.query(`
            SELECT 
                a.id as appointment_id,
                DATE_FORMAT(a.date, '%Y-%m-%d') as date,
                a.time,
                u.name as patient_name,
                u.email as patient_email,
                u.id as user_id,
                doc_u.name as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users doc_u ON d.user_id = doc_u.id
            WHERE UPPER(a.status) = 'CONFIRMED'
            AND a.date >= CURDATE()
        `);

        const now = Date.now();
        const windowEnd = now + (REMINDER_WINDOW_HOURS * 60 * 60 * 1000);
        let sentCount = 0;
        let skippedCount = 0;

        for (const appt of upcoming) {
            const appointmentTime = parseAppointmentDatetime(appt.date, appt.time);
            if (!appointmentTime) continue;

            // Check if appointment is within the 2-hour window: now < apptTime <= now + 2h
            if (appointmentTime <= now || appointmentTime > windowEnd) continue;

            const apptId = appt.appointment_id;

            // L1 check: in-memory
            if (sentReminders.has(apptId)) {
                skippedCount++;
                continue;
            }

            // L2 check: database (crash recovery)
            const alreadySent = await isReminderSent(apptId);
            if (alreadySent) {
                sentReminders.add(apptId); // Warm L1 cache
                skippedCount++;
                continue;
            }

            // Send reminder email
            try {
                await emailDispatcher.sendAppointmentReminder(
                    appt.patient_email,
                    appt.patient_name,
                    appt.doctor_name,
                    appt.date,
                    appt.time,
                    apptId
                );

                // Record in both tiers
                sentReminders.add(apptId);
                await recordReminderSent(apptId, appt.user_id);
                sentCount++;
            } catch (error) {
                console.error(`[Reminder] Failed to send reminder for appointment ${apptId}:`, error.message);
            }
        }

        if (sentCount > 0 || skippedCount > 0) {
            console.log(`[Reminder] Tick complete: ${sentCount} sent, ${skippedCount} skipped, ${upcoming.length} evaluated`);
        }
    } catch (error) {
        console.error('[Reminder] Scheduler tick error:', error.message);
    }
};

/**
 * Start the scheduler
 */
let schedulerInterval = null;

const startScheduler = () => {
    if (!featureFlags.ENABLE_REMINDER_SCHEDULER) {
        console.log('[Reminder] Scheduler disabled via feature flag');
        return;
    }

    console.log(`[Reminder] Scheduler started (interval: ${SCHEDULER_INTERVAL_MS / 1000}s)`);

    // Run once immediately (delayed 30s to allow server to settle)
    setTimeout(() => {
        checkAndSendReminders().catch(console.error);
    }, 30 * 1000);

    // Then run periodically
    schedulerInterval = setInterval(() => {
        checkAndSendReminders().catch(console.error);
    }, SCHEDULER_INTERVAL_MS);

    if (schedulerInterval.unref) schedulerInterval.unref();
};

const stopScheduler = () => {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        console.log('[Reminder] Scheduler stopped');
    }
};

module.exports = { startScheduler, stopScheduler, checkAndSendReminders };
