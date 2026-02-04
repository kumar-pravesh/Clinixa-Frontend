import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const StaffRegistrationApproval = () => {
    // Load registrations from localStorage; start with dummy data if empty
    const [registrations, setRegistrations] = useState(() => {
        try {
            const raw = localStorage.getItem('staffRegistrations');
            if (raw) return JSON.parse(raw);
            // Default dummy data
            return [
                {
                    id: 1,
                    name: 'Dr. Robert Taylor',
                    role: 'Doctor',
                    specialization: 'Cardiology',
                    email: 'robert.taylor@email.com',
                    phone: '+1-555-0401',
                    registeredDate: '2025-02-01',
                    status: 'pending',
                    availability: 'Full-time',
                    experience: '12 years',
                    qualification: 'MD, Board Certified'
                },
                {
                    id: 2,
                    name: 'James Anderson',
                    role: 'Lab Technician',
                    specialization: 'N/A',
                    email: 'james.anderson@email.com',
                    phone: '+1-555-0402',
                    registeredDate: '2025-02-02',
                    status: 'pending',
                    availability: 'Part-time',
                    experience: '5 years',
                    qualification: 'Bachelor in Medical Lab Science'
                },
                {
                    id: 3,
                    name: 'Lisa Thompson',
                    role: 'Receptionist',
                    specialization: 'N/A',
                    email: 'lisa.thompson@email.com',
                    phone: '+1-555-0404',
                    registeredDate: '2025-02-03',
                    status: 'pending',
                    availability: 'Full-time',
                    experience: '3 years',
                    qualification: 'Diploma in Office Management'
                },
                {
                    id: 4,
                    name: 'Dr. Marcus Williams',
                    role: 'Doctor',
                    specialization: 'Orthopedics',
                    email: 'marcus.williams@email.com',
                    phone: '+1-555-0403',
                    registeredDate: '2025-02-04',
                    status: 'pending',
                    availability: 'Full-time',
                    experience: '8 years',
                    qualification: 'MD, Orthopedic Specialist'
                },
                {
                    id: 5,
                    name: 'Sarah Chen',
                    role: 'Lab Technician',
                    specialization: 'N/A',
                    email: 'sarah.chen@email.com',
                    phone: '+1-555-0405',
                    registeredDate: '2025-02-01',
                    status: 'approved',
                    availability: 'Full-time',
                    experience: '6 years',
                    qualification: 'Bachelor in Clinical Laboratory Science'
                },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try { localStorage.setItem('staffRegistrations', JSON.stringify(registrations)); } catch (e) {}
    }, [registrations]);

    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const filteredRegistrations = registrations.filter(reg => {
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
        return matchesStatus;
    });

    const handleApprove = (id) => {
        if (window.confirm('Approve this registration?')) {
            const approvedStaff = registrations.find(r => r.id === id);
            
            // Add to Staff Management if role is Lab Technician or Receptionist
            if (approvedStaff && (approvedStaff.role === 'Lab Technician' || approvedStaff.role === 'Receptionist')) {
                try {
                    const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
                    const newStaff = {
                        id: Date.now(),
                        name: approvedStaff.name,
                        role: approvedStaff.role,
                        email: approvedStaff.email,
                        phone: approvedStaff.phone,
                        department: approvedStaff.role === 'Lab Technician' ? 'Laboratory' : 'Reception',
                        status: 'active'
                    };
                    staffList.push(newStaff);
                    localStorage.setItem('staffList', JSON.stringify(staffList));
                } catch (e) { }
            }
            
            setRegistrations(prev => prev.map(reg =>
                reg.id === id ? { ...reg, status: 'approved' } : reg
            ));
            
            // Create notification
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.unshift({
                id: Date.now(),
                type: 'registration_approved',
                title: 'Staff Registration Approved',
                message: `${approvedStaff.name} (${approvedStaff.role}) registration has been approved`,
                timestamp: new Date().toLocaleTimeString(),
                actionPath: '/dashboard/admin/registrations',
                relatedId: approvedStaff.id,
                read: false
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('notificationUpdate'));
            
            setShowDetailModal(false);
        }
    };

    const handleReject = (id) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        if (window.confirm('Reject this registration?')) {
            setRegistrations(prev => prev.map(reg =>
                reg.id === id ? { ...reg, status: 'rejected' } : reg
            ));
            setRejectionReason('');
            setShowDetailModal(false);
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
        { label: 'Total Applications', value: registrations.length, color: 'bg-blue-100' },
        { label: 'Pending', value: registrations.filter(r => r.status === 'pending').length, color: 'bg-yellow-100' },
        { label: 'Approved', value: registrations.filter(r => r.status === 'approved').length, color: 'bg-green-100' },
        { label: 'Rejected', value: registrations.filter(r => r.status === 'rejected').length, color: 'bg-red-100' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Staff Registration Approval</h2>
                <p className="text-gray-500 mt-1">Approve or reject new doctor and staff registrations</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`card p-4 ${stat.color}`}>
                        <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card p-4">
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

            {/* Registrations List */}
            <div className="space-y-4">
                {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map(registration => (
                        <div key={registration.id} className="card p-6 hover:shadow-lg transition border-l-4 border-primary-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {registration.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{registration.name}</h3>
                                            <p className="text-sm text-gray-500">{registration.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(registration.status)}`}>
                                    {registration.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-100">
                                <div className="flex items-start space-x-2">
                                    <FiMail className="text-primary-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Email</p>
                                        <p className="text-sm text-gray-900">{registration.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <FiPhone className="text-primary-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Phone</p>
                                        <p className="text-sm text-gray-900">{registration.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <FiCalendar className="text-primary-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Applied</p>
                                        <p className="text-sm text-gray-900">{registration.registeredDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <FiClock className="text-primary-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Availability</p>
                                        <p className="text-sm text-gray-900">{registration.availability}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold mb-1">Experience</p>
                                        <p className="text-sm font-semibold text-gray-900">{registration.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold mb-1">Qualification</p>
                                        <p className="text-sm font-semibold text-gray-900">{registration.qualification}</p>
                                    </div>
                                    {registration.specialization !== 'N/A' && (
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold mb-1">Specialization</p>
                                            <p className="text-sm font-semibold text-gray-900">{registration.specialization}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {registration.status === 'pending' ? (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedRegistration(registration);
                                            setShowDetailModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                                    >
                                        <FiUser size={16} />
                                        <span>Review</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center pt-2">
                                    <p className="text-sm text-gray-500">
                                        {registration.status === 'approved' ? '✓ Registration approved' : '✕ Registration rejected'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card p-12 text-center">
                        <FiClock className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No registrations found</p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showDetailModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h3 className="text-lg font-bold text-gray-900">Review Registration - {selectedRegistration.name}</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Role</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRegistration.role}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Applied Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRegistration.registeredDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Experience</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRegistration.experience}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Availability</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRegistration.availability}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Qualification</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRegistration.qualification}</p>
                                </div>
                                {selectedRegistration.specialization !== 'N/A' && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Specialization</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedRegistration.specialization}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Rejection Reason (if applicable)</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Provide reason for rejection if you choose to reject..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setRejectionReason('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleReject(selectedRegistration.id)}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
                            >
                                <FiX />
                                <span>Reject</span>
                            </button>
                            <button
                                onClick={() => handleApprove(selectedRegistration.id)}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
                            >
                                <FiCheck />
                                <span>Approve</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffRegistrationApproval;
