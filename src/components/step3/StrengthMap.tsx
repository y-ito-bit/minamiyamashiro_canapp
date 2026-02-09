'use client';

import { motion } from 'framer-motion';

const DOMAINS = {
    PRACTICAL: { label: '実務・専門', color: '#8B5CF6' },      // Purple
    EMPATHY: { label: '共感', color: '#3B82F6' },            // Blue
    COLLABORATION: { label: '連携', color: '#F97316' },      // Orange
    RESILIENCE: { label: 'しなやかさ', color: '#22C55E' },   // Green
};

export default function StrengthMap({ type, data }: { type: string, data?: any }) {
    // Use passed data or fallback
    const scores = data || { practical: 50, empathy: 50, collaboration: 50, resilience: 50 };

    return (
        <div className="relative w-full aspect-square max-w-[300px] mx-auto my-8">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 opacity-20">
                <div className="bg-purple-200 rounded-tl-full"></div>
                <div className="bg-orange-200 rounded-tr-full"></div>
                <div className="bg-blue-200 rounded-bl-full"></div>
                <div className="bg-green-200 rounded-br-full"></div>
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 text-xs font-bold text-purple-600">{DOMAINS.PRACTICAL.label}</div>
            <div className="absolute top-2 right-2 text-xs font-bold text-orange-600">{DOMAINS.COLLABORATION.label}</div>
            <div className="absolute bottom-2 left-2 text-xs font-bold text-blue-600">{DOMAINS.EMPATHY.label}</div>
            <div className="absolute bottom-2 right-2 text-xs font-bold text-green-600">{DOMAINS.RESILIENCE.label}</div>

            {/* Dynamic Bubbles based on Data */}
            <motion.div
                className="absolute w-12 h-12 rounded-full blur-md opacity-80"
                style={{ backgroundColor: DOMAINS.COLLABORATION.color, top: '20%', right: '20%' }}
                animate={{ scale: (scores.collaboration / 50) }}
            />
            <motion.div
                className="absolute w-12 h-12 rounded-full blur-md opacity-80"
                style={{ backgroundColor: DOMAINS.EMPATHY.color, bottom: '20%', left: '20%' }}
                animate={{ scale: (scores.empathy / 50) }}
            />
            <motion.div
                className="absolute w-12 h-12 rounded-full blur-md opacity-80"
                style={{ backgroundColor: DOMAINS.RESILIENCE.color, bottom: '20%', right: '20%' }}
                animate={{ scale: (scores.resilience / 50) }}
            />
            <motion.div
                className="absolute w-12 h-12 rounded-full blur-md opacity-80"
                style={{ backgroundColor: DOMAINS.PRACTICAL.color, top: '20%', left: '20%' }}
                animate={{ scale: (scores.practical / 50) }}
            />

            {/* Central Core */}
            <div className="absolute inset-0 m-auto w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center font-zen font-bold text-gray-700 shadow-sm border border-white">
                YOU
            </div>
        </div>
    );
}
