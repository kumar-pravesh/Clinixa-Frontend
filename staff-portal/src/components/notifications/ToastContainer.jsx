import React from 'react';
import { X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { cn } from '../../utils/cn';

const ToastContainer = () => {
    const { activeToast, setActiveToast } = useNotification();

    if (!activeToast) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 md:bottom-10 z-[100] w-[calc(100%-2rem)] md:w-auto animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 duration-500">
            <div className={cn(
                "bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-6 flex items-center gap-5 max-w-full md:max-w-sm relative group transition-all hover:scale-[1.02] overflow-hidden",
                activeToast.type === 'emergency' ? "shadow-red-500/20" :
                    activeToast.type === 'appointment' ? "shadow-blue-500/20" :
                        activeToast.type === 'payment' ? "shadow-emerald-500/20" : "shadow-amber-500/20"
            )}>
                {/* Flash effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>

                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative z-10",
                    activeToast.bg,
                    activeToast.color
                )}>
                    <activeToast.icon className="w-6 h-6" />
                </div>

                <div className="flex-1 pr-6 relative z-10">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-0.5">{activeToast.title}</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{activeToast.message}</p>
                </div>

                <button
                    onClick={() => setActiveToast(null)}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Progress bar for auto-clear */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/50">
                    <div className={cn(
                        "h-full animate-toast-progress origin-left",
                        activeToast.type === 'emergency' ? "bg-red-500" :
                            activeToast.type === 'appointment' ? "bg-blue-500" :
                                activeToast.type === 'payment' ? "bg-emerald-500" : "bg-amber-500"
                    )}></div>
                </div>
            </div>
        </div>
    );
};

export default ToastContainer;
