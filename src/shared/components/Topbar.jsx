import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Topbar = ({ role, toggleSidebar }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    // Load user data
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch (e) {
            return {};
        }
    });

    // Load notifications from localStorage and listen for updates
    const [notifications, setNotifications] = useState(() => {
        try {
            const raw = localStorage.getItem('notifications');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    // Listen for notificationUpdate event
    useEffect(() => {
        const handleNotificationUpdate = () => {
            try {
                const raw = localStorage.getItem('notifications');
                const updated = raw ? JSON.parse(raw) : [];
                setNotifications(updated);
            } catch (e) {
                console.error('Error updating notifications:', e);
            }
        };

        window.addEventListener('notificationUpdate', handleNotificationUpdate);
        return () => window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationTypeColor = (type) => {
        switch (type) {
            case 'staff_registration':
            case 'registration_approved':
                return 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100';
            case 'appointment':
            case 'appointment_approved':
                return 'bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100';
            case 'doctor_added':
            case 'staff_added':
            case 'department_added':
                return 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100';
            case 'billing_paid':
                return 'bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100';
            default:
                return 'bg-gray-50 border-l-4 border-gray-500 hover:bg-gray-100';
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read
        const updatedNotifications = notifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        window.dispatchEvent(new Event('notificationUpdate'));

        setShowNotifications(false);
        navigate(notification.actionPath || '/dashboard/admin');
    };

    const handleMarkAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        window.dispatchEvent(new Event('notificationUpdate'));
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FiMenu className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            <div className="flex items-center space-x-6">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                        <FiBell className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                            <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-gray-900">Notifications</h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <FiX size={18} />
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-bold uppercase tracking-wider"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="divide-y divide-gray-100">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 transition cursor-pointer ${getNotificationTypeColor(notification.type)} ${!notification.read ? 'opacity-100' : 'opacity-75'}`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">
                                                    {notification.type.includes('staff') || notification.type.includes('registration') ? '👨‍⚕️' :
                                                        notification.type.includes('appointment') ? '📅' :
                                                            notification.type.includes('doctor') ? '🏥' :
                                                                notification.type.includes('billing') ? '💰' :
                                                                    notification.type.includes('department') ? '🏢' : '📢'}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 flex-shrink-0"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500">No notifications</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 p-3 text-center">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate('/dashboard/admin/registrations');
                                    }}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                >
                                    View All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs font-semibold text-gray-500 capitalize">{user?.role || role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center text-white shadow-md">
                        <FiUser className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
