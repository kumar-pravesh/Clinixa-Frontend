import { useState } from 'react';
import { FiCheck, FiX, FiClock, FiUser, FiCalendar, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { useEffect } from 'react';

const AppointmentApproval = () => {
    // Load doctors from localStorage (shared with DoctorManagement)
    const [doctors, setDoctors] = useState(() => {
        try {
            const raw = localStorage.getItem('doctors');
            if (raw) return JSON.parse(raw);
            return [];
        } catch (e) {
            return [];
        }
    });

    // Load patients from localStorage (shared with PatientRecords)
    const [patients, setPatients] = useState(() => {
        try {
            const raw = localStorage.getItem('patients');
            if (raw) return JSON.parse(raw);
            return [];
        } catch (e) {
            return [];
        }
    });

    // Load appointments from localStorage; initialize with comprehensive dummy data
    const [appointments, setAppointments] = useState(() => {
        try {
            const raw = localStorage.getItem('appointments');
            if (raw) return JSON.parse(raw);

            // Always have default data even if doctors/patients are empty
            return [
                {
                    id: 1,
                    patientName: 'Aryan Kumar',
                    doctorName: 'Dr. Chandan Shashank',
                    department: 'Cardiology',
                    date: '2025-02-10',
                    time: '10:00 AM',
                    status: 'pending',
                    reason: 'Routine Checkup'
                },
                {
                    id: 2,
                    patientName: 'Sarah Smith',
                    doctorName: 'Dr. Michael Chen',
                    department: 'Orthopedics',
                    date: '2025-02-10',
                    time: '11:30 AM',
                    status: 'pending',
                    reason: 'Knee Pain Consultation'
                },
                {
                    id: 3,
                    patientName: 'Shubham Sekhar',
                    doctorName: 'Dr. Chandan Shashank',
                    department: 'Pediatrics',
                    date: '2025-02-10',
                    time: '02:00 PM',
                    status: 'approved',
                    reason: 'Child Health Checkup'
                },
                {
                    id: 4,
                    patientName: 'Emily Brown',
                    doctorName: 'Dr. James Wilson',
                    department: 'Neurology',
                    date: '2025-02-11',
                    time: '03:30 PM',
                    status: 'pending',
                    reason: 'Migraine Treatment'
                },
                {
                    id: 5,
                    patientName: 'David Lee',
                    doctorName: 'Dr. Sarah Johnson',
                    department: 'Cardiology',
                    date: '2025-02-11',
                    time: '09:00 AM',
                    status: 'pending',
                    reason: 'Post-Operative Review'
                },
                {
                    id: 6,
                    patientName: 'Lisa Thompson',
                    doctorName: 'Dr. Michael Chen',
                    department: 'Orthopedics',
                    date: '2025-02-12',
                    time: '01:00 PM',
                    status: 'rejected',
                    reason: 'Spine Realignment'
                },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        } catch (e) { }
    }, [appointments]);

    // Listen for updates from DoctorManagement and PatientRecords
    useEffect(() => {
        const handleStorageUpdate = () => {
            const updatedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
            const updatedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
            setDoctors(updatedDoctors);
            setPatients(updatedPatients);
        };

        window.addEventListener('doctorUpdate', handleStorageUpdate);
        window.addEventListener('patientUpdate', handleStorageUpdate);
        return () => {
            window.removeEventListener('doctorUpdate', handleStorageUpdate);
            window.removeEventListener('patientUpdate', handleStorageUpdate);
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id) => {
        const appointment = appointments.find(apt => apt.id === id);
        const doctor = doctors.find(d => d.name === appointment.doctorName);

        if (!doctor || doctor.status !== 'active') {
            alert('❌ Cannot approve: Doctor is not available');
            return;
        }

        if (window.confirm('Approve this appointment?')) {
            setAppointments(appointments.map(apt =>
                apt.id === id ? { ...apt, status: 'approved' } : apt
            ));
            // Create notification for appointment approval
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.unshift({
                id: Date.now(),
                type: 'appointment_approved',
                title: 'Appointment Approved',
                message: `Appointment for ${appointment.patientName} with ${appointment.doctorName} on ${appointment.date} has been approved`,
                timestamp: new Date().toLocaleTimeString(),
                actionPath: '/dashboard/admin/appointments',
                relatedId: id,
                read: false
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('notificationUpdate'));
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Are you sure you want to reject this appointment?')) {
            setAppointments(appointments.map(apt =>
                apt.id === id ? { ...apt, status: 'rejected' } : apt
            ));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const stats = [
        { label: 'Total Appointments', value: appointments.length, icon: '📋', color: 'bg-blue-100' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, icon: '⏳', color: 'bg-yellow-100' },
        { label: 'Approved', value: appointments.filter(a => a.status === 'approved').length, icon: '✓', color: 'bg-green-100' },
        { label: 'Rejected', value: appointments.filter(a => a.status === 'rejected').length, icon: '✕', color: 'bg-red-100' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Appointment Approval</h2>
                <p className="text-gray-500 mt-1">Review and approve/reject patient appointments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`card p-4 ${stat.color}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient, doctor, or department..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                        <div key={appointment.id} className="card p-6 hover:shadow-lg transition border-l-4 border-primary-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {appointment.patientName[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{appointment.patientName}</h3>
                                            <p className="text-sm text-gray-500">{appointment.department}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(appointment.status)}`}>
                                    {appointment.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <FiUser className="text-primary-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Doctor</p>
                                        <p className="text-sm font-semibold text-gray-900">{appointment.doctorName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiCalendar className="text-primary-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Date & Time</p>
                                        <p className="text-sm font-semibold text-gray-900">{appointment.date} at {appointment.time}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Availability Indicator */}
                            <div className={`mb-4 p-3 rounded-lg ${doctors.find(d => d.name === appointment.doctorName)?.status === 'active' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-start space-x-2">
                                    {doctors.find(d => d.name === appointment.doctorName)?.status === 'active' ? (
                                        <>
                                            <span className="text-green-600 text-lg">✓</span>
                                            <div>
                                                <p className="text-xs text-green-700 font-semibold">Doctor Available</p>
                                                <p className="text-sm text-green-700">Ready to accept appointments</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FiAlertCircle className="text-red-600" />
                                            <div>
                                                <p className="text-xs text-red-700 font-semibold">Doctor Not Available</p>
                                                <p className="text-sm text-red-700">This doctor is unavailable for new appointments</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 font-semibold mb-1">Reason for Visit</p>
                                <p className="text-sm text-gray-700">{appointment.reason}</p>
                            </div>

                            {appointment.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleApprove(appointment.id)}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
                                    >
                                        <FiCheck />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(appointment.id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
                                    >
                                        <FiX />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card p-12 text-center">
                        <FiClock className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No appointments found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentApproval;
