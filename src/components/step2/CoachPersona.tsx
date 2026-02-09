'use client';

import { motion } from 'framer-motion';

export default function CoachPersona() {
    return (
        <div className="flex flex-col items-center justify-center mb-6">
            <motion.div
                className="relative w-24 h-24"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
                {/* Simple "Watercolor" Circle + Icon representation */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-full border-2 border-white/50 shadow-lg flex items-center justify-center overflow-hidden">
                    {/* Placeholder for an avatar image or simple SVG */}
                    <span className="text-4xl">🌿</span>
                </div>
            </motion.div>
            <div className="mt-4 text-center">
                <div className="text-sm font-bold text-gray-500 tracking-wider">CAREER COACH</div>
                <div className="text-lg font-zen font-bold text-primary">ミドリさん</div>
            </div>
        </div>
    );
}
