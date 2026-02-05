import { FiActivity, FiSearch, FiFileText, FiPlusCircle } from 'react-icons/fi';

const MedicalRecords = () => {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">E-Prescription & Records</h2>
                    <p className="text-gray-500 font-medium">Digital health tracking for optimized patient care.</p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                    <FiPlusCircle />
                    <span>New Prescription</span>
                </button>
            </div>

            <div className="card bg-white shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-bold text-primary-600">Clinixa Digital Rx</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">State-of-the-Art Electronic Health Records</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">Dr. Rajesh Kumar</p>
                            <p className="text-xs font-semibold text-gray-500">Senior Cardiologist, Clinixa</p>
                            <p className="text-xs font-semibold text-gray-500">MCI Reg: 123456</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest italic">Patient Vitals</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Weight</p>
                                    <p className="text-xl font-bold text-gray-900">72.5 kg</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase">BP</p>
                                    <p className="text-xl font-bold text-gray-900">120/80 mmHg</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Heart Rate</p>
                                    <p className="text-xl font-bold text-gray-900">78 bpm</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase">SpO2</p>
                                    <p className="text-xl font-bold text-gray-900">98%</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest italic">Diagnosis & Notes</p>
                            <div className="p-6 bg-primary-50/30 rounded-3xl border-2 border-dashed border-primary-100 min-h-[150px]">
                                <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                                    Patient presents with mild chest discomfort and fatigue. Heart sounds are normal. Recommended ECG and Lipid profile. Prescribing mild anticoagulants.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest italic border-b pb-4">Medications</p>
                            <div className="space-y-4">
                                {[
                                    { name: 'Aspirin 75mg', freq: '1-0-1', dur: '10 Days' },
                                    { name: 'Atorvastatin 10mg', freq: '0-0-1', dur: '30 Days' },
                                    { name: 'Pantoprazole 40mg', freq: '1-0-0', dur: '15 Days' },
                                ].map((med, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">Rx</div>
                                            <div>
                                                <p className="font-bold text-gray-900">{med.name}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">{med.dur}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-primary-600">{med.freq}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Follow-up Date</p>
                                <p className="font-bold text-gray-900">Feb 15, 2026</p>
                            </div>
                            <div className="w-32 h-16 border border-gray-200 border-dashed rounded flex flex-col items-center justify-center">
                                <div className="text-[8px] font-bold text-gray-300 uppercase">E-Signature</div>
                                <div className="font-script text-xl text-primary-600 opacity-50">Dr. Rajesh</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button className="btn-outline px-10 border-gray-200 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all font-bold">Print Record</button>
            </div>
        </div>
    );
};

export default MedicalRecords;
