import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowRight, FiUser, FiPhone, FiHeart, FiCheckCircle } from 'react-icons/fi';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        age: '',
        bloodGroup: '',
        gender: '',
        emergencyName: '',
        emergencyNumber: '',
        email: ''
    });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(`Logging in as Patient with`, formData);
        navigate('/dashboard/patient');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">C</span>
                            </div>
                            <span className="text-3xl font-bold font-display text-gradient">Clinixa</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Patient Registration</h2>
                        <p className="text-gray-500 mt-2">Register in to access your patient portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Name Input */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Number Input */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Age Input */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Age</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="age"
                                    required
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="25"
                                    min="1"
                                    max="120"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Blood Group Select */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Blood Group</label>
                            <select
                                name="bloodGroup"
                                required
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Gender Select */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Gender</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Emergency Contact Name */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Emergency Contact Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="emergencyName"
                                    required
                                    value={formData.emergencyName}
                                    onChange={handleChange}
                                    placeholder="Emergency Contact"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Emergency Contact Number */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Emergency Contact Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="emergencyNumber"
                                    required
                                    value={formData.emergencyNumber}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300 transition-colors" />
                                <span className="text-gray-600 group-hover:text-primary-600 transition-colors">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 group"
                        >
                            <span>Register to Portal</span>
                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-sm">
                            Need a patient portal account?{' '}
                            <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
