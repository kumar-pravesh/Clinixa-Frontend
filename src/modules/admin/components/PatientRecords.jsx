import { useState, useEffect } from 'react';
import { FiEye, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';

const PatientRecords = () => {
    // Load patients from localStorage; start with dummy data if empty
    const [patients, setPatients] = useState(() => {
        try {
            const raw = localStorage.getItem('patients');
            if (raw) return JSON.parse(raw);
            // Default dummy data
            return [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1-555-0301',
                    age: 35,
                    gender: 'Male',
                    department: 'Cardiology',
                    doctor: 'Dr. Sarah Johnson',
                    lastVisit: '2025-02-01',
                    medicalHistory: ['Hypertension', 'Diabetes'],
                    allergies: ['Penicillin']
                },
                {
                    id: 2,
                    name: 'Sarah Smith',
                    email: 'sarah@example.com',
                    phone: '+1-555-0302',
                    age: 28,
                    gender: 'Female',
                    department: 'Orthopedics',
                    doctor: 'Dr. Michael Chen',
                    lastVisit: '2025-02-02',
                    medicalHistory: ['Asthma'],
                    allergies: ['Lactose']
                },
                {
                    id: 3,
                    name: 'Michael Johnson',
                    email: 'michael.j@example.com',
                    phone: '+1-555-0303',
                    age: 12,
                    gender: 'Male',
                    department: 'Pediatrics',
                    lastVisit: '2025-02-03',
                    medicalHistory: ['Ear Infections'],
                    allergies: ['None'],
                    doctor: 'Dr. Priya Kumar'
                },
                {
                    id: 4,
                    name: 'Emily Brown',
                    email: 'emily.brown@example.com',
                    phone: '+1-555-0304',
                    age: 42,
                    gender: 'Female',
                    department: 'Neurology',
                    lastVisit: '2025-02-01',
                    medicalHistory: ['Migraines', 'Vertigo'],
                    allergies: ['Aspirin'],
                    doctor: 'Dr. James Wilson'
                },
                {
                    id: 5,
                    name: 'David Lee',
                    email: 'david.lee@example.com',
                    phone: '+1-555-0305',
                    age: 55,
                    gender: 'Male',
                    department: 'Cardiology',
                    lastVisit: '2025-02-04',
                    medicalHistory: ['Heart Disease', 'Hypertension'],
                    allergies: ['Sulfa'],
                    doctor: 'Dr. Anita Rao'
                },
                {
                    id: 6,
                    name: 'Lisa Thompson',
                    email: 'lisa.t@example.com',
                    phone: '+1-555-0306',
                    age: 38,
                    gender: 'Female',
                    department: 'Orthopedics',
                    lastVisit: '2025-01-28',
                    medicalHistory: ['Arthritis', 'Back Pain'],
                    allergies: ['Ibuprofen'],
                    doctor: 'Dr. Michael Chen'
                },
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('patients', JSON.stringify(patients));
            window.dispatchEvent(new Event('patientUpdate'));
        } catch (e) {
            console.error('Error saving patients:', e);
        }
    }, [patients]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm);
        return matchesSearch;
    });

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setShowDetailModal(true);
    };

    const handleDownloadRecord = (patient) => {
        // Simulate download
        const recordData = `
    PATIENT MEDICAL RECORD
    ======================
    Name: ${patient.name}
    Email: ${patient.email}
    Phone: ${patient.phone}
    Age: ${patient.age}
    Gender: ${patient.gender}
    Department: ${patient.department}
    Last Visit: ${patient.lastVisit}

    MEDICAL HISTORY:
    ${patient.medicalHistory.join('\n')}

    ALLERGIES:
    ${patient.allergies.length > 0 ? patient.allergies.join('\n') : 'None'}
        `;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(recordData));
        element.setAttribute('download', `${patient.name}_Medical_Record.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Patient Records</h2>
                    <p className="text-gray-500 mt-1">View and manage comprehensive patient medical records</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* status filter removed */}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
                </div>
                <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Patients by Department</p>
                    <p className="text-3xl font-bold text-green-600">{new Set(patients.map(p => p.department).filter(Boolean)).size}</p>
                </div>
            </div>

            {/* Patients Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Age/Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Last Visit</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPatients.map(patient => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.age}/{patient.gender}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.doctor}</td>
                                    <td className="px-6 py-4 text-sm space-x-2 flex">
                                        <button
                                            onClick={() => handleViewDetails(patient)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadRecord(patient)}
                                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                                            title="Download Record"
                                        >
                                            <FiDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Patient Details - {selectedPatient.name}</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Email</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Age</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.age} years</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Gender</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Department</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.department}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Last Visit</p>
                                    <p className="text-sm text-gray-900">{selectedPatient.lastVisit}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Medical History</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPatient.medicalHistory.map((history, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {history}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPatient.allergies.length > 0 ? (
                                        selectedPatient.allergies.map((allergy, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                {allergy}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">No known allergies</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDownloadRecord(selectedPatient);
                                    setShowDetailModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2"
                            >
                                <FiDownload />
                                <span>Download Record</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRecords;
