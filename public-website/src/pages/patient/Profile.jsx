import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';

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

    if (loading) return <div className="p-4">Loading profile...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!profile) return <div className="p-4">No profile data available</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-primary">My Profile</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 bg-primary text-white">
                    <h3 className="text-lg font-medium">Patient Information</h3>
                    <p className="opacity-80 text-sm">{profile.email}</p>
                </div>

                <div className="border-t border-gray-200">
                    <dl>
                        <div className="px-4 py-5 grid grid-cols-3 gap-4 bg-gray-50">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="col-span-2 text-sm text-gray-900">{profile.name}</dd>
                        </div>

                        <div className="px-4 py-5 grid grid-cols-3 gap-4 bg-white">
                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                            <dd className="col-span-2 text-sm text-gray-900">
                                {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}
                            </dd>
                        </div>

                        <div className="px-4 py-5 grid grid-cols-3 gap-4 bg-gray-50">
                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                            <dd className="col-span-2 text-sm text-gray-900">{profile.gender}</dd>
                        </div>

                        <div className="px-4 py-5 grid grid-cols-3 gap-4 bg-white">
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="col-span-2 text-sm text-gray-900">{profile.phone}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Profile;
