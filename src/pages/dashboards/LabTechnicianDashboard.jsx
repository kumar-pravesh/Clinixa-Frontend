import { FiUploadCloud, FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

const LabTechnicianOverview = () => {
    const stats = [
        { label: 'Pending Tests', value: '14', icon: <FiClock />, color: 'bg-orange-500' },
        { label: 'Reports Uploaded', value: '38', icon: <FiCheckCircle />, color: 'bg-green-500' },
        { label: 'Urgent Processing', value: '3', icon: <FiActivity />, color: 'bg-red-500' },
        { label: 'Samples Collected', value: '52', icon: <FiUsers />, color: 'bg-blue-500' },
    ];

    const reports = [
        { patient: 'Vikram Singh', test: 'Blood Profile', urgency: 'Normal', date: 'Feb 03' },
        { patient: 'Lata Mangeshkar', test: 'MRI Spine', urgency: 'High', date: 'Feb 03' },
        { patient: 'Amitabh Bachchan', test: 'X-Ray Chest', urgency: 'Urgent', date: 'Feb 04' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lab Portal</h1>
                    <p className="text-gray-500 font-medium">Manage sample collections and report uploads.</p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                    <FiUploadCloud />
                    <span>Upload New Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6 flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full text-white shadow-xl mb-4 ${stat.color}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="card p-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900">Reporting Queue</h3>
                    <div className="flex bg-gray-50 p-1 rounded-xl">
                        <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-sm font-bold text-primary-600">All</button>
                        <button className="px-4 py-1.5 text-sm font-bold text-gray-500">Urgent</button>
                        <button className="px-4 py-1.5 text-sm font-bold text-gray-500">Pending</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {reports.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-transparent hover:border-primary-100 hover:shadow-lg transition-all group">
                            <div className="flex items-center space-x-6">
                                <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                    <FiFileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold">{r.patient}</p>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-xs font-bold text-gray-500">{r.test}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${r.urgency === 'Urgent' ? 'bg-red-100 text-red-600' :
                                                r.urgency === 'High' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>{r.urgency}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="text-sm font-bold text-gray-400">{r.date}</p>
                                <button className="btn-primary py-2 px-6 text-sm">Upload Result</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianOverview;
