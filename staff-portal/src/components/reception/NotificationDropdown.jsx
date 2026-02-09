import React from 'react';
import {
    AlertCircle,
    Calendar,
    CreditCard,
    MessageCircle,
    Clock,
    CheckCircle2,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';

import { useNotification } from '../../context/NotificationContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, unreadCount } = useNotification();

    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount} NEW</span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={cn(
                            "p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group relative",
                            !notif.read && "bg-primary/[0.02]"
                        )}
                    >
                        {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            notif.bg
                        )}>
                            <notif.icon className={cn("w-5 h-5", notif.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{notif.title}</p>
                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                {notif.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <button className="w-full p-4 text-center border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">View All Notifications</span>
            </button>
        </div>
    );
};

export default NotificationDropdown;
