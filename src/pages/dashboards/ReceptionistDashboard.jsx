import { FiUserPlus, FiCreditCard, FiActivity, FiUsers } from 'react-icons/fi';

const ReceptionistOverview = () => {
    const stats = [
        { label: 'Walk-in Patients', value: '18', icon: <FiUserPlus />, color: 'bg-blue-500' },
        { label: 'Pending Bills', value: '7', icon: <FiCreditCard />, color: 'bg-orange-500' },
        { label: 'Token Issued Today', value: '45', icon: <FiActivity />, color: 'bg-green-500' },
        { label: 'Emergency Queued', value: '2', icon: <FiUsers />, color: 'bg-red-500' },
    ];

    const tokens = [
        { id: 'T-045', patient: 'Karan Mehra', dept: 'Cardiology', status: 'In Queue' },
        { id: 'T-044', patient: 'Sara Wilson', dept: 'Pediatrics', status: 'Calling' },
        { id: 'T-043', patient: 'Manoj Bajpayee', dept: 'General', status: 'Closed' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reception Module</h1>
                    <p className="text-gray-500 font-medium">Manage walk-ins, token issuance, and billing.</p>
                </div>
                <div className="flex space-x-4">
                    <button className="btn-outline border-secondary-500 text-secondary-600">Issue Token</button>
                    <button className="btn-primary">Register Walk-in</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6 flex items-center space-x-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card overflow-hidden">
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
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {tokens.map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-600">{t.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{t.patient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.dept}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'Calling' ? 'bg-blue-100 text-blue-600' :
                                                    t.status === 'In Queue' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-secondary-600 font-bold hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card p-6 h-fit bg-gradient-to-br from-white to-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Billing</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Patient Mobile</label>
                            <input type="text" placeholder="Enter number..." className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Consultation Type</label>
                            <select className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 bg-white">
                                <option>General Consultation</option>
                                <option>Specialist Visit</option>
                                <option>Follow-up</option>
                            </select>
                        </div>
                        <button className="w-full btn-primary py-3">Generate Bill</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistOverview;
