import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        // Specifically registering as a patient
        console.log(`Registering as PATIENT: ${name}, ${phone}`);
        navigate('/login');
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
                        <h2 className="text-2xl font-bold text-gray-900">Patient Login</h2>
                        <p className="text-gray-500 mt-2">Join Clinixa for seamless patient care</p>
                        <div className="mt-4 px-4 py-2 bg-primary-50 border border-primary-100 rounded-lg inline-block">
                            <p className="text-[10px] uppercase font-black tracking-widest text-primary-600">
                                Patient Sign In Required
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 1234567890"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full btn-primary py-4 flex items-center justify-center space-x-2 group"
                            >
                                <span>Sign In</span>
                                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                                 Forgot Password
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
