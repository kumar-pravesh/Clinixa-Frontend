import { useState, useEffect, useRef } from 'react';
import { patientService } from '../../services/patientService';
import { FileText, Download, Eye, Calendar, Clock, Activity, Pill, FlaskConical, ChevronRight, Stethoscope, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Prescriptions = () => {
    const [records, setRecords] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const pdfTemplateRef = useRef(null);

    useEffect(() => {
        Promise.all([
            patientService.getMedicalRecords(),
            patientService.getProfile()
        ]).then(([recordsData, profileData]) => {
            setRecords(recordsData);
            setProfile(profileData);
        }).catch(err => console.error('Failed to load data:', err))
            .finally(() => setLoading(false));
    }, []);

    const getColorClass = (color) => {
        if (color === 'primary') return 'bg-primary/10 text-primary border-primary/20';
        if (color === 'accent') return 'bg-accent/10 text-accent border-accent/20';
        return 'bg-gray-100 text-gray-500 border-gray-200';
    };

    const getRecordIcon = (type) => {
        if (type === 'Prescription') return <Pill />;
        if (type === 'Lab Report') return <FlaskConical />;
        if (type === 'Consultation') return <Stethoscope />;
        return <FileText />;
    };

    const handleDownload = async (record) => {
        if (!pdfTemplateRef.current) return;
        setIsDownloading(record.id);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const element = pdfTemplateRef.current;
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Clinixa_${record.type}_${record.id}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false,
                    width: 800,
                    windowWidth: 800, // Matching template width exactly for zero-clipping capture
                    onclone: (clonedDoc) => {
                        const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                        styleSheets.forEach(sheet => sheet.remove());
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF Generation failed:', error);
            alert('PDF generation failed. Please try again.');
        } finally {
            setIsDownloading(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Hidden PDF Template - Rebuilt with Table Layout for absolute alignment reliability */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={pdfTemplateRef} style={{
                    width: '800px',
                    minHeight: '1130px',
                    padding: '60px',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    position: 'relative'
                }}>
                    {/* Header Table - Refined for zero-overlap and perfect alignment */}
                    <table style={{ width: '100%', marginBottom: '15px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '50%', textAlign: 'left', verticalAlign: 'bottom', paddingBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <div style={{ backgroundColor: '#0D9488', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>C</div>
                                        <h1 style={{ margin: 0, color: '#0D9488', fontSize: '32px', letterSpacing: '-1.5px', fontWeight: '900', lineHeight: 1 }}>CLINIXA</h1>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900' }}>Smart Healthcare Solutions</p>
                                </td>
                                <td style={{ width: '50%', textAlign: 'right', verticalAlign: 'bottom', paddingBottom: '15px' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Official Medical Record</p>
                                    <p style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>#{isDownloading ? isDownloading.split('-')[1]?.toUpperCase() : 'REF-001'}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Explicit Separation Line to prevent table border artifacts */}
                    <div style={{ width: '100%', height: '2px', backgroundColor: '#0D9488', marginBottom: '45px' }}></div>

                    {/* Patient & Metadata Table */}
                    <table style={{ width: '100%', marginBottom: '45px', borderCollapse: 'separate', borderSpacing: '25px 0', marginLeft: '-25px', marginRight: '-25px' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '50%', verticalAlign: 'top' }}>
                                    <div style={{ padding: '28px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', minHeight: '130px', boxSizing: 'border-box' }}>
                                        <p style={{ margin: '0 0 14px 0', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Patient Information</p>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>{profile?.name}</h3>
                                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>{profile?.email}</p>
                                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>{profile?.phone}</p>
                                    </div>
                                </td>
                                <td style={{ width: '50%', verticalAlign: 'top' }}>
                                    <div style={{ padding: '28px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'right', minHeight: '130px', boxSizing: 'border-box' }}>
                                        <p style={{ margin: '0 0 14px 0', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Record Metadata</p>
                                        <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: 'bold', color: '#0D9488' }}>{isDownloading ? records.find(r => r.id === isDownloading)?.type : 'Clinical Record'}</p>
                                        <p style={{ margin: '4px 0', fontSize: '15px', color: '#64748b' }}>Issued: {isDownloading ? new Date(records.find(r => r.id === isDownloading)?.date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Observations Box */}
                    <div style={{ padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '24px', backgroundColor: '#ffffff', marginBottom: '100px' }}>
                        <h2 style={{ margin: '0 0 25px 0', fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>{isDownloading ? records.find(r => r.id === isDownloading)?.title : 'General Consultation'}</h2>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
                            <div style={{ width: '50px', height: '3px', backgroundColor: '#0D9488', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1.5px' }}>Clinical Observations & Advice</span>
                        </div>
                        <div style={{ fontSize: '16px', color: '#334155', lineHeight: '1.8' }}>
                            <p style={{ margin: '0 0 20px 0' }}>This clinical document confirms the findings of the <strong>{isDownloading ? records.find(r => r.id === isDownloading)?.type.toLowerCase() : 'medical session'}</strong> conducted by <strong>{isDownloading ? records.find(r => r.id === isDownloading)?.doctor : 'Clinixa Professional'}</strong>.</p>
                            <p style={{ margin: '0 0 20px 0' }}>The patient is strictly advised to adhere to the clinical guidelines and follow-up schedules. Consistent monitoring is recommended for optimal recovery.</p>
                            <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b', fontSize: '14px' }}>This is an official healthcare record. Please retain this copy for your medical history.</p>
                        </div>
                    </div>

                    {/* Footer - Position Fixed to Bottom Area */}
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '60px',
                        right: '60px',
                        borderTop: '2px solid #f8fafc',
                        paddingTop: '30px'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '60%', textAlign: 'left' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Digitally Authenticated by Clinixa Health</p>
                                        <p style={{ margin: '4px 0', fontSize: '10px', color: '#cbd5e1' }}>© {new Date().getFullYear()} Clinixa Health • All Rights Reserved</p>
                                    </td>
                                    <td style={{ width: '40%', textAlign: 'right' }}>
                                        <div style={{ width: '180px', borderBottom: '2px solid #f1f5f9', marginBottom: '10px', display: 'inline-block' }}></div>
                                        <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>System Authorization</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Eye Button Modal (Record Preview) */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${getColorClass(selectedRecord.color)}`}>
                                    {getRecordIcon(selectedRecord.type)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 leading-tight">{selectedRecord.title}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{selectedRecord.type} Details</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all"
                            >
                                <ChevronRight className="rotate-90 w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Consulting Doctor</p>
                                    <p className="text-lg font-bold text-slate-700">{selectedRecord.doctor}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Date</p>
                                    <p className="text-lg font-bold text-slate-700">{new Date(selectedRecord.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-3">Clinical Summary</h4>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    This {selectedRecord.type.toLowerCase()} was recorded during your session on {new Date(selectedRecord.date).toLocaleDateString()}.
                                    {selectedRecord.type === 'Prescription' && " The listed medications and dosage instructions must be followed strictly as advised by the doctor."}
                                    {selectedRecord.type === 'Lab Report' && " The results of your lab tests are integrated into this report. Please consult with your doctor for clinical correlation."}
                                    {selectedRecord.type === 'Consultation' && " This record covers the primary diagnosis and general health advice provided during the checkup."}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        handleDownload(selectedRecord);
                                        setSelectedRecord(null);
                                    }}
                                    className="flex-1 bg-primary text-white h-14 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Download size={20} /> Download Official PDF
                                </button>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="px-8 h-14 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className={`absolute left-5 top-4 w-6 h-6 rounded-lg border-4 border-white shadow-md z-10 transition-transform group-hover:scale-125 ${record.type === 'Prescription' || record.type === 'Consultation' ? 'bg-primary' : 'bg-accent'
                                }`}></div>

                            <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${getColorClass(record.color)}`}>
                                            {getRecordIcon(record.type)}
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
                                        <button
                                            onClick={() => setSelectedRecord(record)}
                                            className="p-3 bg-white/50 hover:bg-white text-gray-400 hover:text-primary rounded-xl transition-all border border-white/40 shadow-sm group/btn"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(record)}
                                            disabled={isDownloading !== null}
                                            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {isDownloading === record.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                            {isDownloading === record.id ? 'Securing PDF...' : 'Download PDF'}
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
