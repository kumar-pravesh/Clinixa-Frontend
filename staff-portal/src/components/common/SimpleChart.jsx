import React from 'react';

/**
 * A simple SVG area chart component for sparklines.
 * @param {number[]} data - Array of numerical values.
 * @param {string} color - Tailwind text color class (e.g., 'text-emerald-500').
 * @param {number} height - Height of the SVG viewBox.
 */
export const SimpleChart = ({ data, color = "text-emerald-500", height = 40 }) => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;

    // Use a small padding to prevent clipping at top/bottom stroke
    const padding = 2;
    const renderHeight = height - padding * 2;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const normalizedVal = (val - min) / range;
        const y = height - padding - (normalizedVal * renderHeight);
        return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const fillPathD = `${pathD} L 100,${height} L 0,${height} Z`;

    return (
        <svg viewBox={`0 0 100 ${height}`} className={`w-full h-full overflow-visible ${color}`} preserveAspectRatio="none">
            <path
                d={fillPathD}
                className="fill-current opacity-10"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d={pathD}
                fill="none"
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
};
