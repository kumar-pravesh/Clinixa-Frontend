import { FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';

const AdminDashboard = () => {
    const [patients, setPatients] = useState(() => JSON.parse(localStorage.getItem('patients') || '[]'));
    const [billingRecords, setBillingRecords] = useState(() => JSON.parse(localStorage.getItem('billingRecords') || '[]'));
    const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('departments') || '[]'));

    const totalRevenue = billingRecords.reduce((sum, record) => sum + (Number(record.totalAmount) || 0), 0);
    const totalPatientsCount = patients.length || 1240; // Fallback to dummy if empty

    const stats = [
        { label: "Today's Appointments", value: '48', icon: <FiClock />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Total Patients', value: totalPatientsCount.toLocaleString(), icon: <FiUsers />, color: 'bg-green-500', trend: '+5%' },
        { label: 'Revenue (Total)', value: `₹${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-yellow-500', trend: '+8%' },
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium">Monitoring hospital performance and operations.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Last Updated: Today, 2:45 PM</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6 flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className={`text-xs font-bold mt-2 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend} from yesterday
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl text-white shadow-lg ${stat.color}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Appointments */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Today's Appointments</h3>
                    <div className="space-y-3">
                        {todayAppointments.map(apt => (
                            <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{apt.patient}</p>
                                    <p className="text-xs text-gray-500">{apt.doctor} at {apt.time}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Load */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Department Load</h3>
                    <div className="space-y-4">
                        {displayDepartments.map(dept => {
                            const doctorsWorking = dept.doctorsWorking || Math.floor(Number(dept.doctorCount) * 0.8) || 0;
                            const totalDoctors = Number(dept.doctorCount) || 1;
                            const loadPercentage = Math.round((doctorsWorking / totalDoctors) * 100);
                            return (
                                <div key={dept.name}>
                                    <div className="flex justify-between text-sm font-semibold mb-2">
                                        <span className="text-gray-900">{dept.name}</span>
                                        <span className={`text-xs ${loadPercentage > 80 ? 'text-red-600' : loadPercentage > 70 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {loadPercentage}% • {doctorsWorking}/{totalDoctors} Drs • {dept.bedCount || dept.beds} Beds
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${loadPercentage > 80 ? 'bg-red-500' : loadPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                                            style={{ width: `${loadPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}

                        {departmentLoad.map(dept => (
                            <div key={dept.name}>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-gray-900">{dept.name}</span>
                                    <span className={`text-xs ${dept.load > 80 ? 'text-red-600' : dept.load > 70 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {dept.load}% • {dept.beds}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${dept.load > 80 ? 'bg-red-500' : dept.load > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                                        style={{ width: `${dept.load}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

</div>
                </div>

                {/* Removed Daily Income and Pending Bills overview - managed in Billing Control */}
            </div>
        </div>
    );
};

export default AdminDashboard;
