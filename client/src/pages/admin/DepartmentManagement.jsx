import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';

const DepartmentManagement = () => {
    // Load departments from localStorage if available; otherwise start with dummy data
    const [departments, setDepartments] = useState(() => {
        try {
            const raw = localStorage.getItem('departments');
            if (raw) return JSON.parse(raw);
            // Default dummy data
            return [
                {
                    id: 1,
                    name: 'Cardiology',
                    head: 'Dr. Sarah Johnson',
                    bedCount: '15',
                    staffCount: '8',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Pediatrics',
                    head: 'Dr. Emily Rodriguez',
                    bedCount: '12',
                    staffCount: '6',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Orthopedics',
                    head: 'Dr. Michael Chen',
                    bedCount: '10',
                    staffCount: '5',
                    status: 'active'
                },
                {
                    id: 4,
                    name: 'Neurology',
                    head: 'Dr. James Wilson',
                    bedCount: '8',
                    staffCount: '4',
                    status: 'active'
                },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try { localStorage.setItem('departments', JSON.stringify(departments)); } catch (e) {}
    }, [departments]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        bedCount: '',
        staffCount: '',
        status: 'active'
    });

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (department = null) => {
        if (department) {
            setEditingId(department.id);
            setFormData(department);
        } else {
            setEditingId(null);
            setFormData({ name: '', head: '', bedCount: '', staffCount: '', status: 'active' });
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
            setDepartments(departments.map(d => d.id === editingId ? { ...formData, id: editingId } : d));
        } else {
            const newDept = { ...formData, id: Date.now() };
            setDepartments([...departments, newDept]);
            // Create notification for new department
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.unshift({
                id: Date.now(),
                type: 'department_added',
                title: 'New Department Added',
                message: `Department "${formData.name}" has been added successfully`,
                timestamp: new Date().toLocaleTimeString(),
                actionPath: '/dashboard/admin/departments',
                relatedId: newDept.id,
                read: false
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('notificationUpdate'));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            setDepartments(departments.filter(d => d.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
                    <p className="text-gray-500 mt-1">Manage hospital departments and their resources</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus />
                    <span>Add Department</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="card p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search departments by name or head..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDepartments.map(dept => (
                    <div key={dept.id} className="card p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                                <p className="text-sm text-gray-500">Head: {dept.head}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {dept.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Available Beds</p>
                                <p className="text-lg font-bold text-blue-600">{dept.bedCount}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Staff Count</p>
                                <p className="text-lg font-bold text-purple-600">{dept.staffCount}</p>
                            </div>
                        </div>

                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleOpenModal(dept)}
                                className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold text-sm transition flex items-center justify-center space-x-1"
                            >
                                <FiEdit2 size={16} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(dept.id)}
                                className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm transition flex items-center justify-center space-x-1"
                            >
                                <FiTrash2 size={16} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Department' : 'Add New Department'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Department Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="e.g., Cardiology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Department Head</label>
                                <input
                                    type="text"
                                    name="head"
                                    value={formData.head}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="Dr. Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Available Beds</label>
                                <input
                                    type="number"
                                    name="bedCount"
                                    value={formData.bedCount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="25"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Staff Count</label>
                                <input
                                    type="number"
                                    name="staffCount"
                                    value={formData.staffCount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="12"
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
                                {editingId ? 'Update' : 'Add'} Department
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;
