import { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiEdit2, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';

const BillingManagement = () => {
    // Load patients from localStorage (shared with PatientRecords)
    const [patients, setPatients] = useState(() => {
        try {
            const raw = localStorage.getItem('patients');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    // Service price controls (admin can set prices for services)
    const [servicePrices, setServicePrices] = useState(() => {
        try {
            const raw = localStorage.getItem('servicePrices');
            if (raw) return JSON.parse(raw);
            return {
                consultant: 500,
                xray: 150,
                lab: 200,
                medication: 100
            };
        } catch (e) { return { consultant: 500, xray: 150, lab: 200, medication: 100 }; }
    });

    // Load billing records from localStorage; initialize with comprehensive dummy data
    const [billingRecords, setBillingRecords] = useState(() => {
        try {
            const raw = localStorage.getItem('billingRecords');
            if (raw) return JSON.parse(raw);
            // Default billing records include services, totalAmount and totalPaid
            return [
                { id: 1, patientName: 'Aryan Kumar', patientId: 'P001', department: 'Cardiology', services: [{ name: 'consultant', price: 500 }], totalAmount: 500, totalPaid: 500, date: '2025-02-01' },
                { id: 2, patientName: 'Shubham Sekhar', patientId: 'P002', department: 'Orthopedics', services: [{ name: 'consultant', price: 500 }, { name: 'xray', price: 150 }], totalAmount: 650, totalPaid: 0, date: '2025-02-02' },
                { id: 3, patientName: 'Michael Johnson', patientId: 'P003', department: 'Pediatrics', services: [{ name: 'consultant', price: 500 }, { name: 'lab', price: 200 }], totalAmount: 700, totalPaid: 0, date: '2025-01-25' },
                { id: 4, patientName: 'Emily Brown', patientId: 'P004', department: 'Neurology', services: [{ name: 'consultant', price: 500 }], totalAmount: 500, totalPaid: 0, date: '2025-02-03' },
                { id: 5, patientName: 'David Lee', patientId: 'P005', department: 'Cardiology', services: [{ name: 'consultant', price: 500 }, { name: 'medication', price: 100 }], totalAmount: 600, totalPaid: 600, date: '2025-02-04' },
                { id: 6, patientName: 'Lisa Thompson', patientId: 'P006', department: 'Orthopedics', services: [{ name: 'consultant', price: 500 }, { name: 'lab', price: 200 }], totalAmount: 700, totalPaid: 0, date: '2025-01-15' },
            ];
        } catch (e) {
            return [];
        }
    });

    // Persist billing records and service prices to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('billingRecords', JSON.stringify(billingRecords));
            localStorage.setItem('servicePrices', JSON.stringify(servicePrices));
        } catch (e) { }
    }, [billingRecords, servicePrices]);

    // Listen for patient updates
    useEffect(() => {
        const handlePatientUpdate = () => {
            const updatedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
            setPatients(updatedPatients);
        };

        window.addEventListener('patientUpdate', handlePatientUpdate);
        return () => window.removeEventListener('patientUpdate', handlePatientUpdate);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);

    const filteredBillings = billingRecords.filter(record => {
        const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(record.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(record.department).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalBilled = billingRecords.reduce((s, r) => s + (Number(r.totalAmount) || 0), 0);
    const totalPaid = billingRecords.reduce((s, r) => s + (Number(r.totalPaid) || 0), 0);
    const unpaidCount = billingRecords.filter(r => (Number(r.totalPaid) || 0) < (Number(r.totalAmount) || 0)).length;

    const stats = [
        { label: 'Total Billed', value: `₹${totalBilled}`, icon: '💳', color: 'bg-blue-100' },
        { label: 'Total Paid', value: `₹${totalPaid}`, icon: '✓', color: 'bg-green-100' },
        { label: 'Unpaid Bills', value: `${unpaidCount}`, icon: '⏳', color: 'bg-yellow-100' },
    ];

    const formatMoney = (v) => `₹${Number(v || 0)}`;

    const handleRecordPayment = (id) => {
        const record = billingRecords.find(r => r.id === id);
        const input = window.prompt(`Enter amount paid by patient (remaining ${formatMoney((record.totalAmount || 0) - (record.totalPaid || 0))}):`, String(record.totalAmount - (record.totalPaid || 0) || 0));
        if (!input) return;
        const paid = Number(input) || 0;
        setBillingRecords(prev => prev.map(r => r.id === id ? { ...r, totalPaid: (Number(r.totalPaid || 0) + paid) } : r));
        // Create notification
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({ id: Date.now(), type: 'billing_paid', title: 'Payment Recorded', message: `${formatMoney(paid)} received for ${record.patientName}`, timestamp: new Date().toLocaleTimeString(), actionPath: '/dashboard/admin/billing', relatedId: id, read: false });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        window.dispatchEvent(new Event('notificationUpdate'));
    };

    // overdue handling removed

    const handleDeleteBill = (id) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            setBillingRecords(prev => prev.filter(record => record.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Billing Control</h2>
                <p className="text-gray-500 mt-1">Manage service prices and record patient payments</p>
            </div>

            {/* Service Price Controls */}
            <div className="card p-4">
                <h3 className="text-lg font-bold mb-3">Service Prices (Admin)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {Object.entries(servicePrices).map(([key, val]) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input type="number" value={val} onChange={(e) => setServicePrices(prev => ({ ...prev, [key]: Number(e.target.value || 0) }))} className="px-3 py-2 border rounded" />
                        </div>
                    ))}
                </div>
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
                        placeholder="Search by patient name, ID, or department..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Billing Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Patient ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Services</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Total Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBillings.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.patientName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{record.patientId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{record.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{(record.services || []).map(s => `${s.name} (₹${s.price})`).join(', ')}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center space-x-1"><span className="text-green-600 font-bold">₹</span> <span>{formatMoney(record.totalAmount).replace('₹', '')}</span></td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatMoney(record.totalPaid)}</td>
                                    <td className="px-6 py-4 text-sm space-x-1 flex">
                                        <button onClick={() => handleRecordPayment(record.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Record Payment"><FiCheck /></button>
                                        <button onClick={() => handleDeleteBill(record.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><FiX /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingManagement;
