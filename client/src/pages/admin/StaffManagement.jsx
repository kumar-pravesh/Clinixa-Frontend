import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';

const StaffManagement = () => {
    // Load staff from localStorage; start with dummy data if empty
    const [staffList, setStaffList] = useState(() => {
        try {
            const raw = localStorage.getItem('staffList');
            if (raw) return JSON.parse(raw);
            // Default dummy data
            return [
                { id: 1, name: 'John Smith', role: 'Lab Technician', email: 'john@hospital.com', phone: '+1-555-0201', department: 'Laboratory', status: 'active' },
                { id: 2, name: 'Maria Garcia', role: 'Lab Technician', email: 'maria@hospital.com', phone: '+1-555-0202', department: 'Laboratory', status: 'active' },
                { id: 3, name: 'Robert Johnson', role: 'Receptionist', email: 'robert@hospital.com', phone: '+1-555-0203', department: 'Reception', status: 'active' },
                { id: 4, name: 'Alice Williams', role: 'Receptionist', email: 'alice@hospital.com', phone: '+1-555-0204', department: 'Reception', status: 'active' },
                { id: 5, name: 'James Davis', role: 'Lab Technician', email: 'james.d@hospital.com', phone: '+1-555-0205', department: 'Laboratory', status: 'active' },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try { localStorage.setItem('staffList', JSON.stringify(staffList)); } catch (e) {}
    }, [staffList]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Lab Technician',
        email: '',
        phone: '',
        department: '',
        status: 'active'
    });

    const filteredStaff = staffList.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleOpenModal = (staff = null) => {
        if (staff) {
            setEditingId(staff.id);
            setFormData(staff);
        } else {
            setEditingId(null);
            setFormData({ name: '', role: 'Lab Technician', email: '', phone: '', department: '', status: 'active' });
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
            setStaffList(staffList.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
        } else {
            const newStaff = { ...formData, id: Date.now() };
            setStaffList([...staffList, newStaff]);
            // Create notification
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.unshift({
                id: Date.now(),
                type: 'staff_added',
                title: 'New Staff Added',
                message: `${newStaff.name} (${newStaff.role}) has been added to ${newStaff.department}`,
                timestamp: new Date().toLocaleTimeString(),
                actionPath: '/dashboard/admin/staff',
                relatedId: newStaff.id,
                read: false
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('notificationUpdate'));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            setStaffList(staffList.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
                    <p className="text-gray-500 mt-1">Manage Lab Technicians, Receptionists and other staff</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus />
                    <span>Add Staff</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                    <option value="all">All Roles</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Receptionist">Receptionist</option>
                </select>
            </div>

            {/* Staff Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStaff.map(staff => (
                                <tr key={staff.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{staff.name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{staff.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{staff.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{staff.phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 flex">
                                        <button
                                            onClick={() => handleOpenModal(staff)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(staff.id)}
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
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Staff' : 'Add New Staff'}</h3>
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
                                    placeholder="Staff Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                >
                                    <option value="Lab Technician">Lab Technician</option>
                                    <option value="Receptionist">Receptionist</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="staff@hospital.com"
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
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="e.g., Laboratory"
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
                                {editingId ? 'Update' : 'Add'} Staff
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
