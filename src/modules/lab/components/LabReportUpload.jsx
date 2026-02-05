import { FiUploadCloud, FiFile, FiCheckCircle, FiClock, FiTrash2 } from 'react-icons/fi';

const LabReportUpload = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Lab Results</h2>
                    <p className="text-gray-500 font-medium">Securely portal for uploading medical test results and diagnostic reports.</p>
                </div>
                <button className="btn-primary py-2 px-6 flex items-center space-x-2">
                    <FiCheckCircle />
                    <span>Approve All</span>
                </button>
            </div>

            {/* Drag & Drop Area */}
            <div className="card p-12 border-4 border-dashed border-primary-100 bg-primary-50/20 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform mb-6">
                    <FiUploadCloud className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop Lab Reports</h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto">Upload PDF, JPG or DICOM files. Maximum size allowed: 25MB per file.</p>
                <div className="mt-8 flex items-center space-x-4">
                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 shadow-md">Browse Local Files</button>
                    <span className="text-gray-300 font-bold">or</span>
                    <button className="text-primary-600 font-bold hover:underline">Import from Scanner</button>
                </div>
            </div>

            {/* Upload Queue */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Current Upload Queue (2)</h4>
                {[
                    { name: 'Lipid_Profile_Report.pdf', size: '1.2 MB', progress: 100, status: 'Completed' },
                    { name: 'ECG_Scan_JohnDoe.jpg', size: '4.8 MB', progress: 65, status: 'Uploading' },
                ].map((file, i) => (
                    <div key={i} className="card p-6 border-2 border-gray-100 hover:border-primary-200 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl ${file.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'}`}>
                                    <FiFile className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{file.name}</p>
                                    <p className="text-xs font-bold text-gray-400">{file.size} • {file.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {file.status === 'Completed' ? (
                                    <span className="flex items-center text-green-600 text-xs font-bold uppercase tracking-widest border border-green-200 px-3 py-1 rounded-full"><FiCheckCircle className="mr-1" /> Ready</span>
                                ) : (
                                    <span className="flex items-center text-primary-600 text-xs font-bold uppercase tracking-widest border border-primary-200 px-3 py-1 rounded-full"><FiClock className="mr-1 animate-spin" /> 65%</span>
                                )}
                                <button className="p-2 text-red-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"><FiTrash2 /></button>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`h-full rounded-full transition-all duration-500 ${file.status === 'Completed' ? 'bg-green-500' : 'bg-primary-500 animate-pulse'}`} style={{ width: `${file.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200">
                <p className="text-xs font-bold text-orange-600 uppercase mb-2">Important Notice</p>
                <p className="text-sm font-medium text-orange-800 italic">Please ensure patient ID is clearly visible on high-resolution scans before confirming the upload. Improperly labeled reports may be rejected by the auditing senior.</p>
            </div>
        </div>
    );
};

export default LabReportUpload;
