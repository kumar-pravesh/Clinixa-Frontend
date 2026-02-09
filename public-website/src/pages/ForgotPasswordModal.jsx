import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { authService } from '../services/authService';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setSubmitted(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!submitted ? (
                            <>
                                {/* Header */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                                
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                                        <button
                                            onClick={handleClose}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <p className="text-gray-600 mb-6">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border-l-4 border-red-500 mb-6"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Sending...' : 'Send Reset Link'}
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="text-primary hover:text-teal-700 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <ArrowLeft size={14} />
                                                Back to Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mb-6"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-green-100 rounded-full p-4">
                                            <CheckCircle className="text-green-600" size={48} />
                                        </div>
                                    </div>
                                </motion.div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                                <p className="text-gray-600 mb-6">
                                    We've sent a password reset link to <strong>{email}</strong>. 
                                    Please check your email and click the link to reset your password.
                                </p>

                                <p className="text-sm text-gray-500 mb-6">
                                    The link will expire in 1 hour.
                                </p>

                                <button
                                    onClick={handleClose}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;
