import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUser } from 'react-icons/fi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // Only Admin role for now
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulated API call delay
        setTimeout(() => {
            const userData = {
                email,
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                role: role
            };

            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('user', JSON.stringify(userData));

            // Backward compatibility for admin (just in case legacy components depend on it)
            if (role === 'admin') {
                localStorage.setItem('adminIsLogged', 'true');
                localStorage.setItem('adminUser', JSON.stringify(userData));
            }

            setLoading(false);

            // Redirect based on role
            switch (role) {
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                case 'doctor':
                    navigate('/dashboard/doctor');
                    break;
                case 'receptionist':
                    navigate('/dashboard/receptionist');
                    break;
                case 'lab-technician':
                    navigate('/dashboard/lab-technician');
                    break;
                default:
                    navigate('/dashboard/patient');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">C</span>
                            </div>
                            <span className="text-3xl font-bold font-display text-gradient">Clinixa</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary py-4 flex items-center justify-center space-x-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span>{loading ? 'Logging in...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</span>
                            {!loading && <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* No registration for admin flow */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
