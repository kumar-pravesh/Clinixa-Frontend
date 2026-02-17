import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Award,
    Clock,
    Building,
    Edit3,
    Briefcase
} from 'lucide-react';
import { cn } from '../../utils/cn';
import doctorService from '../../services/doctorService';
import { useNotification } from '../../context/NotificationContext';

const Profile = () => {
    const { addNotification } = useNotification();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await doctorService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                addNotification({
                    type: 'error',
                    title: 'Sync Error',
                    message: 'Could not retrieve your professional credentials.'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [addNotification]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) return (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-bold italic">No profile record found in the directory.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <User className="w-8 h-8 text-primary" /> My Profile
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Professional Credentials & Practice Info</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-slate-50">
                        <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center text-slate-400 font-black text-4xl border-4 border-white shadow-xl overflow-hidden shadow-slate-200">
                            {profile.profile_pic ? (
                                <img src={profile.profile_pic} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                profile.name?.split(' ').map(n => n[0]).join('')
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.dept || 'General Medicine'}</span>
                                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">
                                    {profile.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Academic & Clinical Focus
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Qualification</span>
                                        <span className="text-sm font-black text-slate-900">{profile.qualification || 'MBBS, MD'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Specialization</span>
                                        <span className="text-sm font-black text-primary">{profile.specialization}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Experience</span>
                                        <span className="text-sm font-black text-slate-900">{profile.experience_years} Years</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Award className="w-4 h-4" /> Practice Metrics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Consultation Fee</span>
                                        <span className="text-lg font-black text-emerald-600">₹{profile.consultation_fee}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Practice Area</span>
                                        <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 capitalize">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-300" /> Professional
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Secure Communication
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{profile.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
