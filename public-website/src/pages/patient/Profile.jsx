import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { User, Mail, Phone, Calendar, MapPin, Shield, Edit3, Heart, CreditCard } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        setLoading(true);
        patientService.getProfile()
            .then(data => {
                setProfile(data);
                setFormData(data);
            })
            .catch(err => setError(err.response?.data?.message || 'Failed to load profile'))
            .finally(() => setLoading(false));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await patientService.updateProfile(formData);
            await loadProfile();
            setIsEditing(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading && !profile) return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="glass-card p-6 text-center rounded-2xl border-red-100">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Error Loading Profile</h3>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-premium px-5 py-2 text-sm">Try Again</button>
        </div>
    );

    if (!profile) return <div className="p-4 text-sm">No profile data available</div>;

    const infoGroups = [
        {
            title: "Personal",
            icon: <User className="text-primary" size={18} />,
            items: [
                { label: "Full Name", value: profile.name, icon: <User size={14} /> },
                { label: "Date of Birth", value: profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A', icon: <Calendar size={14} /> },
                { label: "Gender", value: profile.gender, icon: <Heart size={14} /> },
            ]
        },
        {
            title: "Vital Statistics",
            icon: <Activity className="text-pink-500" size={18} />,
            items: [
                { label: "Height (cm)", value: profile.height ? `${profile.height} cm` : 'N/A', icon: <Activity size={14} /> },
                { label: "Weight (kg)", value: profile.weight ? `${profile.weight} kg` : 'N/A', icon: <Activity size={14} /> },
                { label: "Blood Pressure", value: (profile.bp_systolic && profile.bp_diastolic) ? `${profile.bp_systolic}/${profile.bp_diastolic} mmHg` : 'N/A', icon: <Activity size={14} /> },
            ]
        },
        {
            title: "Medical Background",
            icon: <Shield className="text-green-500" size={18} />,
            items: [
                { label: "Blood Group", value: profile.blood_group || 'N/A', icon: <Heart size={14} /> },
                { label: "Medical History", value: profile.history || 'No history recorded', icon: <Edit3 size={14} /> },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-2xl glass-panel p-6 shadow-lg border-white/40">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-primary to-secondary rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black italic">
                            {profile.name.charAt(0)}
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">{profile.name}</h1>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 uppercase tracking-tighter">
                                <ShieldCheck size={10} className="mr-1" /> Verified Patient
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="text-primary" /> {profile.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`py-2 px-6 text-xs font-bold rounded-lg transition-all shadow-sm ${isEditing ? 'bg-gray-100 text-gray-600' : 'btn-premium'}`}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Medical Info'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <div className="glass-card rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                        <Edit3 className="text-primary" size={20} /> Update Medical Profile
                    </h2>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.gender || ''}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Group</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.blood_group || ''}
                                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height (cm)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.height || ''}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.weight || ''}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BP Systolic</label>
                                <input
                                    type="number"
                                    placeholder="Upper (e.g. 120)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.bp_systolic || ''}
                                    onChange={(e) => setFormData({ ...formData, bp_systolic: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BP Diastolic</label>
                                <input
                                    type="number"
                                    placeholder="Lower (e.g. 80)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.bp_diastolic || ''}
                                    onChange={(e) => setFormData({ ...formData, bp_diastolic: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical History</label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                placeholder="List any chronic conditions, allergies, or past surgeries..."
                                value={formData.history || ''}
                                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={updating}
                            className="btn-premium w-full py-4 text-sm disabled:opacity-50"
                        >
                            {updating ? 'Saving Records...' : 'Save & Update Health Profile'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
                    {infoGroups.map((group, idx) => (
                        <div key={idx} className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2.5">
                                {group.icon}
                                <h3 className="font-bold text-xs text-gray-800 uppercase tracking-widest">{group.title}</h3>
                            </div>
                            <div className="p-5 space-y-4 flex-1">
                                {group.items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-300 leading-none">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                            <p className="text-xs font-semibold text-gray-700 break-words">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Internal components
const Activity = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const ShieldCheck = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default Profile;
