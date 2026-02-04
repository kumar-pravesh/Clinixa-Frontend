import { FiActivity, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';

const DoctorOverview = () => {
    const stats = [
        { label: 'Today Patients', value: '12', icon: <FiUsers />, color: 'bg-blue-500' },
        { label: 'Pending Prescriptions', value: '5', icon: <FiActivity />, color: 'bg-purple-500' },
        { label: 'Upcoming Consults', value: '8', icon: <FiCalendar />, color: 'bg-green-500' },
        { label: 'Total Consultations', value: '1.2k', icon: <FiClock />, color: 'bg-orange-500' },
    ];

    const patients = [
        { name: 'Sameer Khan', time: '10:30 AM', type: 'Follow up', status: 'Waiting' },
        { name: 'Anita Sharma', time: '11:00 AM', type: 'Consultation', status: 'In Progress' },
        { name: 'Rahul Varma', time: '11:45 AM', type: 'Emergency', status: 'Pending' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
                    <p className="text-gray-500 font-medium">Welcome back, Dr. Rajesh. Here is your schedule today.</p>
                </div>
                <div className="flex space-x-4">
                    <button className="btn-outline border-primary-500 text-primary-600">View Schedule</button>
                    <button className="btn-primary">Add Prescription</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6 flex items-start space-x-4">
                        <div className={`p-4 rounded-2xl text-white shadow-lg ${stat.color}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Patient Queue */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-bold text-gray-900">Today's Patient Queue</h3>
                    <button className="text-primary-600 font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time Slot</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {patients.map((p, i) => (
                                <tr key={i} className="hover:bg-primary-50/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xs font-bold">
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{p.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-600">{p.type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Waiting' ? 'bg-orange-100 text-orange-600' :
                                                p.status === 'In Progress' ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Treat</button>
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

export default DoctorOverview;


