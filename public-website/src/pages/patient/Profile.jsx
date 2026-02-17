import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { User, Mail, Phone, Calendar, MapPin, Shield, Edit3, Heart, CreditCard } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        patientService.getProfile()
            .then(data => setProfile(data))
            .catch(err => setError(err.response?.data?.message || 'Failed to load profile'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
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
            title: "Contact",
            icon: <Phone className="text-accent" size={18} />,
            items: [
                { label: "Email Address", value: profile.email, icon: <Mail size={14} /> },
                { label: "Phone Number", value: profile.phone, icon: <Phone size={14} /> },
                { label: "Address", value: "Not provided", icon: <MapPin size={14} /> },
            ]
        },
        {
            title: "Account",
            icon: <Shield className="text-green-500" size={18} />,
            items: [
                { label: "Member Since", value: "Jan 2024", icon: <Calendar size={14} /> },
                { label: "Status", value: "Verified Patient", icon: <Shield size={14} /> },
                { label: "Payment", value: "Credit Card", icon: <CreditCard size={14} /> },
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
                        <button className="absolute bottom-1 right-1 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-primary hover:text-accent transition-colors border border-gray-100">
                            <Edit3 size={16} />
                        </button>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">{profile.name}</h1>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 uppercase tracking-tighter">
                                <ShieldCheck size={10} className="mr-1" /> Verified
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="text-primary" /> {profile.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <button className="btn-premium py-2 px-6 text-xs">Update Profile</button>
                            <button className="bg-white/50 backdrop-blur-sm border border-white/40 py-2 px-6 text-xs font-bold text-gray-700 rounded-lg hover:bg-white/80 transition-all shadow-sm">Medical History</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                        <p className="text-xs font-semibold text-gray-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Internal icon component for verification
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
