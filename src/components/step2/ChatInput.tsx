'use client';

import { Send } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSend: (msg: string) => void;
    isLoading: boolean;
    isListening: boolean; // Kept for prop compatibility but unused
    toggleListening: () => void; // Kept for prop compatibility but unused
}

export default function ChatInput({ input, setInput, onSend, isLoading }: ChatInputProps) {
    return (
        <div className="relative w-full max-w-2xl mx-auto mt-4">
            <div className="watercolor-box flex items-center p-2 pr-4 transition-all focus-within:ring-2 ring-primary/30">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ここにメッセージを入力..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none h-[24px] max-h-32 py-3 px-4 text-gray-700 placeholder-gray-400 font-medium font-zen leading-relaxed outline-none"
                    rows={1}
                    style={{ minHeight: '48px' }} // Ensures enough touch target
                />

                <button
                    onClick={() => onSend(input)}
                    disabled={isLoading || !input.trim()}
                    className="ml-2 p-3 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-transform active:scale-95 shadow-md flex-shrink-0"
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="text-center mt-2 text-xs text-gray-400 font-zen">
                Enter で改行
            </div>
        </div>
    );
}
