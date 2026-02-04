import { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiSearch, FiBarChart2 } from 'react-icons/fi';

const ReportsGeneration = () => {
    // Load saved reports from localStorage; do not show dummy reports by default
    const [reports, setReports] = useState(() => {
        try {
            const raw = localStorage.getItem('reports');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('reports', JSON.stringify(reports));
        } catch (e) {}
    }, [reports]);

    const [reportType, setReportType] = useState('');
    const [period, setPeriod] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !reportType || report.type === reportType;
        return matchesSearch && matchesType;
    });

    const handleGenerateReport = () => {
        if (!reportType) return;
        const generated = {
            id: Date.now(),
            title: `${capitalize(reportType)} Report ${period ? `(${period})` : ''}`.trim(),
            type: reportType,
            period: period || 'All time',
            generatedDate: new Date().toISOString().split('T')[0],
            ...generateReportDataFromStorage(reportType, period)
        };
        setReports(prev => [generated, ...prev]);
    };

    const generateReportDataFromStorage = (type, periodStr) => {
        // Read data from localStorage keys populated by admin features
        const patients = safeParse(localStorage.getItem('patients')) || [];
        const billing = safeParse(localStorage.getItem('billingRecords')) || [];
        const appointments = safeParse(localStorage.getItem('appointments')) || [];
        const doctors = safeParse(localStorage.getItem('doctors')) || [];
        const departments = safeParse(localStorage.getItem('departments')) || [];

        const periodMatch = (dateStr) => {
            if (!periodStr) return true;
            try {
                return dateStr && dateStr.includes(periodStr);
            } catch (e) {
                return false;
            }
        };

        if (type === 'patient') {
            const total = patients.length;
            const newPatients = patients.filter(p => periodMatch(p.lastVisit)).length;
            const uniqueDepartments = new Set(patients.map(p => p.department).filter(Boolean)).size;
            return { patients: total, newPatients, departments: uniqueDepartments };
        }

        if (type === 'revenue') {
            const totalRevenue = billing.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
            const totalCollected = billing.reduce((s, b) => s + (Number(b.totalPaid) || 0), 0);
            const avg = billing.length ? Math.round(totalRevenue / billing.length) : 0;
            const collectionsRate = totalRevenue ? Math.round((totalCollected / totalRevenue) * 100) : 0;
            return { totalRevenue, totalCollected, averagePerVisit: avg, collectionsRate };
        }

        if (type === 'appointments') {
            const totalAppointments = appointments.length;
            const approved = appointments.filter(a => a.status === 'approved').length;
            const pending = appointments.filter(a => a.status === 'pending').length;
            const rejected = appointments.filter(a => a.status === 'rejected' || a.status === 'cancelled').length;
            return { totalAppointments, approved, pending, rejected };
        }

        if (type === 'doctor') {
            const countByDoctor = {};
            appointments.forEach(a => {
                const name = a.doctorName || a.doctor || 'Unknown';
                countByDoctor[name] = (countByDoctor[name] || 0) + 1;
            });
            const entries = Object.entries(countByDoctor).sort((a, b) => b[1] - a[1]);
            const topDoctor = entries.length ? entries[0][0] : '';
            const topDoctorPatients = entries.length ? entries[0][1] : 0;
            return { topDoctor, topDoctorPatients };
        }

        if (type === 'department') {
            const activePatients = patients.length;
            const deptCounts = {};
            patients.forEach(p => { if (p.department) deptCounts[p.department] = (deptCounts[p.department] || 0) + 1; });
            return { activePatients, departments: deptCounts };
        }

        return {};
    };

    const safeParse = (raw) => {
        try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    };

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    const handleDownloadCSV = (report) => {
        // Convert report to CSV rows
        const headers = ['Field', 'Value'];
        const rows = [];
        rows.push(headers.join(','));
        rows.push([ 'Report Title', escapeCsv(report.title) ].join(','));
        rows.push([ 'Type', escapeCsv(report.type) ].join(','));
        rows.push([ 'Period', escapeCsv(report.period) ].join(','));
        rows.push([ 'Generated', escapeCsv(report.generatedDate) ].join(','));
        Object.entries(report).forEach(([key, value]) => {
            if (!['id', 'title', 'type', 'period', 'generatedDate'].includes(key)) {
                let v = value;
                if (typeof value === 'object') v = JSON.stringify(value);
                rows.push([ escapeCsv(key), escapeCsv(String(v)) ].join(','));
            }
        });

        const csv = rows.join('\n');
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `${report.type}_report_${report.generatedDate}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const escapeCsv = (v) => `"${String(v).replace(/"/g, '""')}"`;

    const handlePreview = (report) => {
        setSelectedReport(report);
        setShowPreview(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Reports Generation</h2>
                <p className="text-gray-500 mt-1">Generate and manage detailed hospital reports</p>
            </div>

            {/* Create Report */}
            <div className="card p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    >
                        <option value="">Select report type...</option>
                        <option value="patient">Patient Report</option>
                        <option value="revenue">Revenue Report</option>
                        <option value="appointments">Appointment Report</option>
                        <option value="doctor">Doctor Performance</option>
                        <option value="department">Department Report</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Period (e.g. 2025-02 or February 2025)"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg w-full sm:w-1/3"
                    />

                    <button
                        onClick={handleGenerateReport}
                        disabled={!reportType}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        Generate Report
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Select a report type and period, then click "Generate Report" to create and preview based on stored admin data.</p>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                    <option value="">All Reports</option>
                    <option value="patient">Patient Reports</option>
                    <option value="revenue">Revenue Reports</option>
                    <option value="appointments">Appointment Reports</option>
                    <option value="doctor">Doctor Reports</option>
                    <option value="department">Department Reports</option>
                </select>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.map(report => (
                    <div key={report.id} className="card p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-xl">
                                        <FiBarChart2 />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{report.title}</h3>
                                        <p className="text-sm text-gray-500">Generated on {report.generatedDate}</p>
                                    </div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {report.type}
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-xs text-gray-600 font-semibold mb-2">Period: {report.period}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {Object.entries(report)
                                    .filter(([key]) => !['id', 'title', 'type', 'period', 'generatedDate'].includes(key))
                                    .slice(0, 4)
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            <p className="text-xs text-gray-500 mb-1">{key}</p>
                                            <p className="text-sm font-bold text-gray-900">{value}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePreview(report)}
                                className="flex-1 px-4 py-2 border border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => handleDownloadCSV(report)}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2"
                            >
                                <FiDownload size={16} />
                                <span>Download (Excel CSV)</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {showPreview && selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h3 className="text-lg font-bold text-gray-900">{selectedReport.title}</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Report Type</p>
                                    <p className="text-sm text-gray-900 font-semibold">{selectedReport.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Period</p>
                                    <p className="text-sm text-gray-900 font-semibold">{selectedReport.period}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Generated</p>
                                    <p className="text-sm text-gray-900 font-semibold">{selectedReport.generatedDate}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Report Details</p>
                                <div className="space-y-3">
                                    {Object.entries(selectedReport)
                                        .filter(([key]) => !['id', 'title', 'type', 'period', 'generatedDate'].includes(key))
                                        .map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                <p className="text-sm font-semibold text-gray-900">{value}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDownloadCSV(selectedReport);
                                    setShowPreview(false);
                                }}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2"
                            >
                                <FiDownload />
                                <span>Download (Excel CSV)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsGeneration;
