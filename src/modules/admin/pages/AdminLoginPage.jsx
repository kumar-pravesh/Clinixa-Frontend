import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulated Admin API call delay
        setTimeout(() => {
            const userData = {
                email,
                name: 'Admin',
                role: 'admin'
            };

            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('adminIsLogged', 'true');
            localStorage.setItem('adminUser', JSON.stringify(userData));

            setLoading(false);
            navigate('/dashboard/admin');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-white/10">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">C</span>
                            </div>
                            <span className="text-3xl font-bold font-display text-primary-600">Clinixa Admin</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Administrative Portal</h2>
                        <p className="text-gray-500 mt-2">Please login to access the admin dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@clinixa.com"
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
                            className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 group transition-all shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span>{loading ? 'Authenticating...' : 'Login to Admin Panel'}</span>
                            {!loading && <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
