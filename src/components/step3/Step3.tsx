'use client';

import { useAppStore } from '@/store/useAppStore';
import StrengthMap from './StrengthMap';
import { motion } from 'framer-motion';

export default function Step3() {
    const { mbtiType, reportData, userName } = useAppStore();

    if (!reportData) return <div className="text-center p-10 font-bold text-gray-500 animate-pulse">レポートを生成しています...<br />(少し時間がかかります)</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto space-y-8 pb-10"
        >
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-zen font-bold text-primary">
                    {userName ? `${userName}さんのお仕事ポートフォリオ` : 'あなたのお仕事ポートフォリオ'}
                </h1>
                <p className="text-gray-500">対話から見えた「現場の強み」です</p>
                {reportData.focusArea && (
                    <div className="flex justify-center gap-2 mt-2">
                        {reportData.focusArea.map((area: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 rounded-full text-xs font-bold shadow-sm">
                                {area}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="watercolor-box p-6 md:p-8">
                <StrengthMap type={mbtiType} data={reportData.strengthMap} />

                <div className="mt-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700 border-b-2 border-primary/20 pb-2 mb-3">
                            強みからのメッセージ
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                            {reportData.message}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-700 border-b-2 border-primary/20 pb-2 mb-4">
                            見つかった専門性と強み
                        </h3>
                        <div className="space-y-4">
                            {reportData.identifiedSkills.map((skill: any, i: number) => (
                                <div key={i} className="bg-white/60 p-4 rounded-xl border border-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${skill.type === '実務' ? 'bg-purple-400' : 'bg-green-400'}`}>
                                            {skill.type}
                                        </span>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base">{skill.skillName}</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {skill.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-4">
                <button
                    className="text-primary font-bold hover:underline"
                    onClick={() => window.location.reload()}
                >
                    はじめからやり直す
                </button>
            </div>
        </motion.div>
    );
}
