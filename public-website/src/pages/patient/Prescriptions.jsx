import { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { FileText, Download, Eye, Calendar, Clock, Activity, Pill, FlaskConical, ChevronRight } from 'lucide-react';

const Prescriptions = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch or connecting to service
        // For now, let's create a premium-looking placeholder structure that can be easily connected
        setRecords([
            { id: 1, type: 'Prescription', doctor: 'Dr. Sarah Wilson', date: '2024-02-12', title: 'General Checkup Follow-up', icon: <Pill />, color: 'primary' },
            { id: 2, type: 'Lab Report', doctor: 'City Lab Corp', date: '2024-02-10', title: 'Full Blood Count (FBC)', icon: <FlaskConical />, color: 'accent' },
            { id: 3, type: 'Prescription', doctor: 'Dr. James Miller', date: '2024-01-25', title: 'Acute Bronchitis Treatment', icon: <Pill />, color: 'primary' },
        ]);
        setLoading(false);
    }, []);

    const getColorClass = (color) => {
        if (color === 'primary') return 'bg-primary/10 text-primary border-primary/20';
        if (color === 'accent') return 'bg-accent/10 text-accent border-accent/20';
        return 'bg-gray-100 text-gray-500 border-gray-200';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Medical Timeline</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Your complete health history</p>
                </div>
                <button className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all border border-primary/10 flex items-center gap-2">
                    <Activity size={14} /> Health Analytics
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Records...</p>
                </div>
            ) : (
                <div className="relative space-y-6 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-gray-100 before:to-transparent">
                    {records.map((record) => (
                        <div key={record.id} className="relative pl-16 group">
                            {/* Timeline Node */}
                            <div className={`absolute left-5 top-4 w-6 h-6 rounded-lg border-4 border-white shadow-md z-10 transition-transform group-hover:scale-125 ${record.type === 'Prescription' ? 'bg-primary' : 'bg-accent'
                                }`}></div>

                            <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${getColorClass(record.color)}`}>
                                            {record.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getColorClass(record.color)}`}>
                                                    {record.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(record.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{record.title}</h3>
                                            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                                                <span className="text-gray-300">by</span> {record.doctor}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="p-3 bg-white/50 hover:bg-white text-gray-400 hover:text-primary rounded-xl transition-all border border-white/40 shadow-sm group/btn">
                                            <Eye size={18} />
                                        </button>
                                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            <Download size={16} /> Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {records.length === 0 && (
                        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center ml-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-400">No Medical Records</h3>
                            <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto">Your digital prescriptions and reports will appear here automatically.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Prescriptions;
