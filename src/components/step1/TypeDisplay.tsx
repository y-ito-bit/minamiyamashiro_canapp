'use client';

import { MBTI_TYPES } from '@/data/mbtiData';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeDisplayProps {
    type: string;
}

export default function TypeDisplay({ type }: TypeDisplayProps) {
    const info = MBTI_TYPES[type] || { title: "未知のタイプ", description: "判定中..." };

    return (
        <div className="text-center my-8 watercolor-box p-6 max-w-lg mx-auto transform transition-all hover:scale-[1.02]">
            <div className="text-sm font-bold text-gray-400 mb-1 tracking-widest">YOUR TYPE</div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-5xl font-zen font-black text-primary mb-2 drop-shadow-sm tracking-tight">
                        {type}
                    </h2>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        {info.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        {info.description}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
