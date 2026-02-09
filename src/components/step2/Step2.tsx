'use client';

import { useChat } from '@/hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import CoachPersona from './CoachPersona';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

type UnderstandingState = {
    officeHistory: boolean;
    role: boolean;
    duties: boolean;
    episode: boolean;
    strengths: boolean;
    episodeCount: number;
    strengthsCount: number;
    rotationStatus: 'experienced' | 'partial' | 'none' | 'unknown';
};

const defaultUnderstanding: UnderstandingState = {
    officeHistory: false,
    role: false,
    duties: false,
    episode: false,
    strengths: false,
    episodeCount: 0,
    strengthsCount: 0,
    rotationStatus: 'unknown',
};

const parseStateFromContent = (content: string): Partial<UnderstandingState> | null => {
    const delimiter = ':::STATE:::';
    if (!content.includes(delimiter)) return null;
    const raw = content.split(delimiter)[1]?.trim();
    if (!raw) return null;
    const match = raw.match(/\{[\s\S]*\}$/);
    const jsonText = match ? match[0] : raw;

    try {
        const parsed = JSON.parse(jsonText);
        const toBool = (val: unknown) => val === true;
        const rotation = parsed.rotationStatus || parsed.rotation_status || 'unknown';
        const rotationStatus = (['experienced', 'partial', 'none', 'unknown'] as const).includes(rotation)
            ? rotation
            : 'unknown';
        const episodeCountRaw = parsed.episodeCount ?? parsed.episode_count;
        const strengthsCountRaw = parsed.strengthsCount ?? parsed.strengths_count;
        const episodeCount = Number.isFinite(episodeCountRaw) ? Number(episodeCountRaw) : (parsed.episode ? 1 : 0);
        const strengthsCount = Number.isFinite(strengthsCountRaw) ? Number(strengthsCountRaw) : (parsed.strengths ? 1 : 0);
        return {
            officeHistory: toBool(parsed.officeHistory ?? parsed.office_history),
            role: toBool(parsed.role),
            duties: toBool(parsed.duties),
            episode: toBool(parsed.episode),
            strengths: toBool(parsed.strengths),
            episodeCount,
            strengthsCount,
            rotationStatus,
        };
    } catch {
        return null;
    }
};

export default function Step2() {
    const { messages, input, setInput, sendMessage, isLoading, isListening, toggleListening } = useChat();
    const { nextStep } = useAppStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [understanding, setUnderstanding] = useState<UnderstandingState>(defaultUnderstanding);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        for (let i = messages.length - 1; i >= 0; i -= 1) {
            const msg = messages[i];
            if (msg.role !== 'assistant') continue;
            const parsed = parseStateFromContent(msg.content);
            if (parsed) {
                setUnderstanding(prev => ({ ...prev, ...parsed }));
                break;
            }
        }
    }, [messages]);

    const basePercent =
        (understanding.officeHistory ? 10 : 0) +
        (understanding.role ? 10 : 0) +
        (understanding.duties ? 10 : 0);
    const episodePortion = Math.min(Math.max(understanding.episodeCount, 0), 3) / 3;
    const strengthsPortion = Math.min(Math.max(understanding.strengthsCount, 0), 3) / 3;
    const progressPercent = Math.round(basePercent + (episodePortion * 40) + (strengthsPortion * 30));

    const isReportShape = (data: any) => {
        if (!data || typeof data !== 'object') return false;
        if (!data.strengthMap || typeof data.strengthMap !== 'object') return false;
        if (!Array.isArray(data.identifiedSkills)) return false;
        return true;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-transparent w-full max-w-2xl mx-auto h-[80vh] flex flex-col relative"
        >
            <CoachPersona />
            <div className="watercolor-box w-full p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-gray-600">理解度ゲージ</div>
                    <div className="text-xs font-bold text-primary">{progressPercent}%</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="text-xs text-gray-400">
                    対話が深まるほどゲージが上がります
                </div>
            </div>

            {/* Loading Overlay */}
            {isGeneratingReport && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-bold text-gray-700 animate-pulse">あなたの強みを分析中...</p>
                    <p className="text-sm text-gray-500 mt-2">レポート作成中...少々お待ちください</p>
                </div>
            )}

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent space-y-4"
                style={{ scrollBehavior: 'smooth' }}
            >
                {messages.map((msg, idx) => (
                    <MessageBubble
                        key={idx}
                        role={msg.role}
                        content={msg.content}
                        onSelect={sendMessage}
                    />
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start mb-4 ml-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="pt-4 pb-8 px-2 flex flex-col items-center">
                {/* Conditional Report Button (Demo: Show after 2 messages for testing, Requirement: 15) */}
                {/* For PoC Demo, I'll make it visible if messages > 2 */}
                {messages.length > 2 && !isGeneratingReport && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={async () => {
                            setIsGeneratingReport(true);
                            try {
                                const res = await fetch('/api/report', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        messages,
                                        mbtiType: useAppStore.getState().mbtiType,
                                        userName: useAppStore.getState().userName,
                                    }),
                                });

                                const data = await res.json();

                                if (!res.ok) {
                                    // Handle API Limit / Mock Data Fallback
                                    if (res.status === 503 && data.mockData) {
                                        alert("※現在、AIへのアクセスが集中しているため、本番レポートの生成が制限されています。\n\n代わりに「サンプルレポート」を表示します。");
                                        useAppStore.getState().setReportData(data.mockData);
                                        nextStep();
                                        return;
                                    }
                                    throw new Error(data.error || "Failed to generate report");
                                }

                                if (data && isReportShape(data)) {
                                    useAppStore.getState().setReportData(data);
                                    nextStep();
                                } else {
                                    throw new Error('Invalid report data');
                                }
                            } catch (e) {
                                console.error("Failed to generate report", e);
                                alert("レポート生成に失敗しました。もう一度お試しください。");
                                setIsGeneratingReport(false);
                            }
                        }}
                        className="mb-4 px-6 py-2 bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 rounded-full font-bold shadow-md text-sm hover:scale-105 transition-transform"
                    >
                        ✨ 診断レポートを見る
                    </motion.button>
                )}

                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={sendMessage}
                    isLoading={isLoading}
                    isListening={isListening}
                    toggleListening={toggleListening}
                />
            </div>
        </motion.div>
    );
}
