'use client';

import { useAppStore } from '@/store/useAppStore';
import MBTISlider from './MBTISlider';
import TypeDisplay from './TypeDisplay';
import { motion } from 'framer-motion';

export default function Step1() {
    const { mbtiScores, mbtiType, setScore, nextStep, userName, setUserName } = useAppStore();
    const isNameValid = userName.trim().length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 w-full"
        >
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-zen font-bold text-gray-800">
                    まずは、あなたのことを<br />教えてください
                </h1>
                <p className="text-gray-500">直感でスライダーを動かしてみましょう</p>
            </div>

            <div className="max-w-md mx-auto space-y-2">
                <label className="text-sm font-bold text-gray-600">名前</label>
                <input
                    type="text"
                    className="watercolor-input w-full"
                    placeholder="例: 山田太郎"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <MBTISlider
                    leftLabel="外向 (E)"
                    rightLabel="内向 (I)"
                    value={mbtiScores.ei}
                    onChange={(v) => setScore('ei', v)}
                    colorClass="bg-[#25C49F]"
                />
                <MBTISlider
                    leftLabel="感覚 (S)"
                    rightLabel="直観 (N)"
                    value={mbtiScores.sn}
                    onChange={(v) => setScore('sn', v)}
                    colorClass="bg-[#FFD700]"
                />
                <MBTISlider
                    leftLabel="思考 (T)"
                    rightLabel="感情 (F)"
                    value={mbtiScores.tf}
                    onChange={(v) => setScore('tf', v)}
                    colorClass="bg-[#25C49F]"
                />
                <MBTISlider
                    leftLabel="判断 (J)"
                    rightLabel="知覚 (P)"
                    value={mbtiScores.jp}
                    onChange={(v) => setScore('jp', v)}
                    colorClass="bg-[#FFD700]"
                />
            </div>

            <div className="watercolor-box p-4 text-xs text-gray-600 leading-relaxed space-y-2">
                <div className="font-bold text-gray-700">MBTIの見方（要約）</div>
                <div>E / I: 人と交流したり、行動することで活力になる / 一人で考えたり、内省することで活力になる</div>
                <div>S / N: 五感で捉えられる情報で経験則から判断する / 抽象的な情報や可能性に注目し、全体像を見据えて判断する</div>
                <div>T / F: 論理的な基準に基づいて、合理的・分析的に判断する / 個人的な価値観を重視し、共感に基づいて判断する</div>
                <div>J / P: 計画的で明確な結論や決断を好む / 臨機応変に対応し、柔軟性や自由を好む</div>
            </div>

            <TypeDisplay type={mbtiType} />

            <div className="text-center px-6">
                <p className="text-xs text-gray-400 mt-2 font-zen">
                    ※この診断結果は、AIがあなたに合わせた話し方をするための参考情報として使用します。
                </p>
            </div>

            <div className="text-center">
                <button
                    onClick={nextStep}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isNameValid}
                >
                    これで決定して相談する
                </button>
                {!isNameValid && (
                    <p className="text-xs text-gray-400 mt-2">名前を入力してください</p>
                )}
            </div>
        </motion.div>
    );
}
