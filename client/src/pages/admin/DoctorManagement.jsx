import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';

const DoctorManagement = () => {
    // Load doctors from localStorage; start with dummy data if empty
    const [doctors, setDoctors] = useState(() => {
        try {
            const raw = localStorage.getItem('doctors');
            if (raw) return JSON.parse(raw);
            // Default dummy data
            return [
                { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology', email: 'sarah@hospital.com', phone: '+1-555-0101', status: 'active' },
                { id: 2, name: 'Dr. Michael Chen', specialization: 'Orthopedics', email: 'michael@hospital.com', phone: '+1-555-0102', status: 'active' },
                { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics', email: 'emily@hospital.com', phone: '+1-555-0103', status: 'active' },
                { id: 4, name: 'Dr. James Wilson', specialization: 'Neurology', email: 'james@hospital.com', phone: '+1-555-0104', status: 'active' },
                { id: 5, name: 'Dr. Jessica Lee', specialization: 'Cardiology', email: 'jessica@hospital.com', phone: '+1-555-0105', status: 'active' },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('doctors', JSON.stringify(doctors));
            // Dispatch event to notify other components that doctors have been updated
            window.dispatchEvent(new Event('doctorUpdate'));
        } catch (e) {}
    }, [doctors]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        status: 'active'
    });

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setEditingId(doctor.id);
            setFormData(doctor);
        } else {
            setEditingId(null);
            setFormData({ name: '', specialization: '', email: '', phone: '', status: 'active' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (editingId) {
            setDoctors(doctors.map(d => d.id === editingId ? { ...formData, id: editingId } : d));
        } else {
            const newDoctor = { ...formData, id: Date.now() };
            setDoctors(prev => [...prev, newDoctor]);
            // Create notification
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.unshift({
                id: Date.now(),
                type: 'doctor_added',
                title: 'New Doctor Added',
                message: `Dr. ${newDoctor.name} (${newDoctor.specialization}) has been added`,
                timestamp: new Date().toLocaleTimeString(),
                actionPath: '/dashboard/admin/doctors',
                relatedId: newDoctor.id,
                read: false
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('notificationUpdate'));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
                    <p className="text-gray-500 mt-1">Manage hospital doctors and their information</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus />
                    <span>Add Doctor</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="card p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search doctors by name, specialization, or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctors Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredDoctors.map(doctor => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{doctor.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{doctor.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{doctor.phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {doctor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 flex">
                                        <button
                                            onClick={() => handleOpenModal(doctor)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doctor.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="Dr. Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="e.g., Cardiology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="doctor@hospital.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="+1-555-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                            >
                                {editingId ? 'Update' : 'Add'} Doctor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;
