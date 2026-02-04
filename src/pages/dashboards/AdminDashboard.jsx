import { FiTrendingUp, FiUsers, FiDollarSign, FiClock } from 'react-icons/fi';

const AdminOverview = () => {
    const stats = [
        { label: "Today's Appointments", value: '48', icon: <FiClock />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Total Patients', value: '1,240', icon: <FiUsers />, color: 'bg-green-500', trend: '+5%' },
        { label: 'Daily Income', value: '$2,450', icon: <FiDollarSign />, color: 'bg-purple-500', trend: '+18%' },
        { label: 'Pending Bills', value: '12', icon: <FiTrendingUp />, color: 'bg-orange-500', trend: '-2%' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium">Monitoring hospital performance and operations.</p>
                </div>
                <button className="btn-primary">Generate Report</button>
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

            {/* Detailed Content Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="card p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Recent Appointments</h3>
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <FiClock className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium italic">No new appointments to display...</p>
                    </div>
                </div>
                <div className="card p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Department Load</h3>
                    <div className="space-y-6 mt-4">
                        {['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics'].map(dept => (
                            <div key={dept}>
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-gray-700">{dept}</span>
                                    <span className="text-primary-600">75%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
