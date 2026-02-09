'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface MBTISliderProps {
    leftLabel: string;
    rightLabel: string;
    value: number; // -100 to 100
    onChange: (val: number) => void;
    colorClass?: string;
}

export default function MBTISlider({ leftLabel, rightLabel, value, onChange, colorClass = "bg-primary" }: MBTISliderProps) {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Sync internal state if needed or just drive from props.
    // We use dragElastic={0} to keep it strictly bounded.

    useEffect(() => {
        if (constraintsRef.current) {
            setWidth(constraintsRef.current.offsetWidth);
        }
    }, []);

    // Map value (-100 to 100) to position (0 to width - handleSize)
    // But framer motion drag logic is relative.
    // Simplified: We can use a standard input range with heavy styling, 
    // OR we can implement a proper breakdown.
    // Let's use standard range input for robustness but style it beautifully.
    // Framer motion drag is great but tricky for precise linear mapping without extra code.
    // A styled range input is accessible and easier.

    return (
        <div className="w-full max-w-md mx-auto my-6">
            <div className="flex justify-between items-center mb-2 font-zen font-bold text-gray-600">
                <span className={`transition-opacity duration-300 ${value < 0 ? 'opacity-100 text-primary' : 'opacity-60'}`}>{leftLabel}</span>
                <span className={`transition-opacity duration-300 ${value > 0 ? 'opacity-100 text-primary' : 'opacity-60'}`}>{rightLabel}</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-visible shadow-inner">
                {/* Track fill */}
                <div
                    className={`absolute top-0 bottom-0 rounded-full transition-all duration-100 opacity-50 ${colorClass}`}
                    style={{
                        left: '50%',
                        width: `${Math.abs(value) / 2}%`,
                        transform: value < 0 ? 'translateX(-100%)' : 'none'
                    }}
                ></div>

                <input
                    type="range"
                    min="-100"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full absolute top-0 left-0 h-4 opacity-0 cursor-pointer z-20"
                />

                {/* Custom Thumb (Visual only, follows calculation) */}
                <motion.div
                    className={`absolute top-1/2 w-6 h-6 border-2 border-white rounded-full shadow-md z-10 pointer-events-none ${colorClass}`}
                    style={{
                        left: `calc(${((value + 100) / 200) * 100}% - 12px)`, // Center the 24px thumb
                        marginTop: '-12px'
                    }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 1.2 }}
                />

                {/* Center Marker */}
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white z-0"></div>
            </div>
        </div>
    );
}
