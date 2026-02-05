import { FiUserPlus, FiCreditCard, FiActivity, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTokens } from '../components/TokenContext';

const ReceptionistOverview = () => {
    const { tokens } = useTokens();

    const stats = [
        { label: 'Walk-in Patients', value: tokens ? tokens.length : 0, icon: <FiUserPlus />, color: 'bg-blue-500' },
        { label: 'Pending Bills', value: tokens ? tokens.filter(t => t.status === 'Pending').length : 0, icon: <FiCreditCard />, color: 'bg-orange-500' },
        { label: 'Token Issued Today', value: tokens ? tokens.length : 0, icon: <FiActivity />, color: 'bg-green-500' },
        { label: 'Emergency Queued', value: tokens ? tokens.filter(t => t.department === 'Emergency').length : 0, icon: <FiUsers />, color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reception Module</h1>
                    <p className="text-gray-500 font-medium">Manage walk-ins, token issuance, and billing.</p>
                </div>
                <div className="flex space-x-4">
                    <Link to="/dashboard/receptionist/tokens" className="btn-outline border-secondary-500 text-secondary-600 inline-flex items-center justify-center px-4 py-2">Issue Token</Link>
                    <Link to="/dashboard/receptionist/walkin" className="btn-primary inline-flex items-center justify-center px-4 py-2">Register Walk-in</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} to="/dashboard/receptionist/tokens" className="card p-6 flex items-center space-x-4 hover:shadow-md transition">
                        <div className={`p-4 rounded-2xl text-white shadow-lg ${stat.color}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h3 className="text-lg font-bold text-gray-900">Live Token Status</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold uppercase">System Online</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Token ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Patient Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Doctor</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {(tokens || []).map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-600">{t.tokenNo || t.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{t.patientName || t.patient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.department || t.dept}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.doctor || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'Calling' ? 'bg-blue-100 text-blue-600' :
                                                    t.status === 'In Queue' ? 'bg-orange-100 text-orange-600' :
                                                        t.status === 'Done' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ReceptionistOverview;
