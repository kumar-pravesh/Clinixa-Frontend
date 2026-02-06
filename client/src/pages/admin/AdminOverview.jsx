import { FiTrendingUp, FiUsers, FiDollarSign, FiClock } from 'react-icons/fi';
import { useState } from 'react';

const AdminOverview = () => {
    const [patients, setPatients] = useState(() => JSON.parse(localStorage.getItem('patients') || '[]'));
    const [billingRecords, setBillingRecords] = useState(() => JSON.parse(localStorage.getItem('billingRecords') || '[]'));
    const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('departments') || '[]'));

    const totalRevenue = billingRecords.reduce((sum, record) => sum + (Number(record.totalAmount) || 0), 0);
    const totalPatientsCount = patients.length || 1240; // Fallback to dummy if empty

    const stats = [
        { label: "Today's Appointments", value: '48', icon: <FiClock />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Total Patients', value: totalPatientsCount.toLocaleString(), icon: <FiUsers />, color: 'bg-green-500', trend: '+8%' },
        { label: 'Daily Income', value: '$4,850', icon: <FiDollarSign />, color: 'bg-yellow-500', trend: '+15%' },
        { label: 'Pending Bills', value: '24', icon: <FiTrendingUp />, color: 'bg-red-500', trend: '-3%' },
    ];

    const todayAppointments = [
        { id: 1, patient: 'John Doe', doctor: 'Dr. Sarah Johnson', time: '10:00 AM', status: 'scheduled' },
        { id: 2, patient: 'Sarah Smith', doctor: 'Dr. Michael Chen', time: '11:30 AM', status: 'completed' },
        { id: 3, patient: 'Michael Johnson', doctor: 'Dr. Emily Rodriguez', time: '02:00 PM', status: 'scheduled' },
        { id: 4, patient: 'Emily Brown', doctor: 'Dr. James Wilson', time: '03:30 PM', status: 'pending' },
    ];

    const displayDepartments = departments.length > 0 ? departments : [
        { name: 'Cardiology', doctorCount: 10, staffCount: 8, doctorsWorking: 8, bedCount: 20 },
        { name: 'Pediatrics', doctorCount: 7, staffCount: 6, doctorsWorking: 5, bedCount: 30 },
        { name: 'Neurology', doctorCount: 5, staffCount: 4, doctorsWorking: 3, bedCount: 15 },
        { name: 'Orthopedics', doctorCount: 5, staffCount: 5, doctorsWorking: 4, bedCount: 20 },
    ];


    const departmentLoad = [
        { name: 'Cardiology', load: 85, beds: '18/20' },
        { name: 'Pediatrics', load: 72, beds: '22/30' },
        { name: 'Neurology', load: 65, beds: '10/15' },
        { name: 'Orthopedics', load: 78, beds: '16/20' },
    ];

    // pending bills overview removed (billing moved to Billing Control)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1 text-sm">Overview of hospital operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const iconBgColors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100'];
                    const iconColors = ['text-blue-500', 'text-green-500', 'text-yellow-500', 'text-pink-500'];

                    return (
                        <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm font-medium mb-2">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.trend} from yesterday
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${iconBgColors[index]} ${iconColors[index]}`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Weekly Appointments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Appointments</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around px-8 py-6 gap-2">
                        {[45, 52, 38, 60, 55, 42, 28].map((height, idx) => (
                            <div
                                key={idx}
                                className="flex-1 bg-[#0d9488] rounded-t hover:bg-[#0f766e] transition-colors"
                                style={{ height: `${height}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <svg className="w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 400 200">
                            <polyline
                                points="20,150 60,130 100,145 140,100 180,110 220,85 260,95 300,70 340,50 380,35"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                            />
                            {[
                                [20, 150], [60, 130], [100, 145], [140, 100], [180, 110],
                                [220, 85], [260, 95], [300, 70], [340, 50], [380, 35]
                            ].map(([cx, cy], idx) => (
                                <circle key={idx} cx={cx} cy={cy} r="5" fill="#10b981" />
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
