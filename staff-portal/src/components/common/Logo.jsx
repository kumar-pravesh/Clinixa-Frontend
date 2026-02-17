import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionCircle = motion.circle;

const Logo = ({ className = "", showText = true, forceLight = false }) => {
    return (
        <div className={`flex items-center gap-0 group ${className}`}>
            {/* 🧬 Production-Grade Clinixa Icon */}
            <MotionDiv
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:bg-primary/30 transition-all duration-700" />
                <svg
                    viewBox="0 0 100 100"
                    className="w-16 h-16 relative z-10 drop-shadow-2xl translate-y-0.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0D9488" />
                            <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Main Diamond Frame */}
                    <rect
                        x="25" y="25" width="50" height="50" rx="16"
                        transform="rotate(45 50 50)"
                        fill="url(#logoGradient)"
                        style={{ filter: 'url(#logoGlow)' }}
                    />

                    {/* Internal 'C' symbol */}
                    <path
                        d="M62 38C59 34 54 32 49 32C39.5 32 32 39.5 32 49C32 58.5 39.5 66 49 66C54 66 59 64 62 60"
                        stroke="white"
                        strokeWidth="9"
                        strokeLinecap="round"
                    />

                    {/* Heartbeat Core */}
                    <MotionCircle
                        cx="50" cy="50" r="7"
                        className="fill-accent shadow-2xl"
                        animate={{
                            scale: [1, 1.25, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Status Indicator */}
                    <circle cx="82" cy="18" r="6.5" className={`${forceLight ? 'fill-slate-900/40' : 'fill-white'} shadow-sm`} />
                    <circle cx="82" cy="18" r="3.5" className="fill-green-400" />
                </svg>
            </MotionDiv>

            {/* ✒️ Technical Typography - Single-Line Minimalist Branding */}
            {showText && (
                <div className="flex flex-col">
                    <div className="flex items-baseline leading-none">
                        <span className={`text-[32px] font-black tracking-tighter ${forceLight ? "text-white" : "text-slate-900"}`}>Clinix</span>
                        <span className="text-[32px] font-black tracking-tighter text-primary drop-shadow-sm">a</span>
                    </div>
                    {/* 🏥 Medical Heartbeat Underline */}
                    <div className="h-2 w-full mt-0.5">
                        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
                            <path
                                d="M0,5 L30,5 L35,1 L45,9 L50,5 L100,5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="text-accent opacity-90 drop-shadow-[0_0_2px_rgba(249,115,22,0.4)]"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logo;
