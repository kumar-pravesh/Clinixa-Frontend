import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "", showText = true, forceLight = false }) => {
    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            {/* 🧬 Bespoke Clinixa Icon (SVG) */}
            <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 group-hover:bg-primary/30 transition-all duration-500" />
                <svg
                    viewBox="0 0 100 100"
                    className="w-10 h-10 relative z-10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Main Diamond Frame */}
                    <rect x="25" y="25" width="50" height="50" rx="15" transform="rotate(45 50 50)" className="fill-primary" />

                    {/* Internal 'C' symbol */}
                    <path
                        d="M60 40C58 37 54 35 50 35C41.7 35 35 41.7 35 50C35 58.3 41.7 65 50 65C54 65 58 63 60 60"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Pulsing Core Dot */}
                    <motion.circle
                        cx="50" cy="50" r="6"
                        className="fill-accent shadow-lg"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>
            </motion.div>

            {/* ✒️ Typography */}
            {showText && (
                <div className="flex flex-col -space-y-1 text-left">
                    <div className="flex items-baseline gap-0.5">
                        <span className={`text-2xl font-black tracking-tight ${forceLight ? "text-white" : "text-slate-900"}`}>Clinix</span>
                        <span className="text-2xl font-black tracking-tight text-primary">a</span>
                    </div>
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${forceLight ? "text-slate-300" : "text-slate-400"}`}>Health Ecosystem</span>
                </div>
            )}
        </div>
    );
};

export default Logo;
