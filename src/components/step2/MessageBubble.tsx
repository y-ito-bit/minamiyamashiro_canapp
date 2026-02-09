'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
// import ReactMarkdown from 'react-markdown'; 

// I did NOT install react-markdown. I will just use plain text for now or install it later.
// To avoid errors, I'll stick to plain text rendering or install react-markdown. 
// Given the requirements "short messages", plain text is likely fine, but AI might output bolding.
// I'll render text directly for now.

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    onSelect?: (choice: string) => void;
}

export default function MessageBubble({ role, content, onSelect }: MessageBubbleProps) {
    const isUser = role === 'user';
    const choicesDelimiter = ':::CHOICES:::';
    const stateDelimiter = ':::STATE:::';

    // Remove hidden state block from display
    let contentWithoutState = content;
    if (content.includes(stateDelimiter)) {
        const parts = content.split(stateDelimiter);
        contentWithoutState = parts[0].trim();
    }

    // Parse content for choices
    const hasChoices = contentWithoutState.includes(choicesDelimiter);
    let displayContent = contentWithoutState;
    let choices: string[] = [];

    if (hasChoices) {
        const parts = contentWithoutState.split(choicesDelimiter);
        displayContent = parts[0].trim();
        const choicesJson = parts[1].trim();

        // Only attempt to parse if it looks like a complete JSON array
        if (choicesJson.endsWith(']')) {
            try {
                choices = JSON.parse(choicesJson);
            } catch (e) {
                // Silent failure during streaming is expected
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex flex-col w-full mb-6 ${isUser ? 'items-end' : 'items-start'}`}
        >
            <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <Bot size={20} className="text-primary" />
                    </div>
                )}

                <div
                    className={`max-w-[80%] p-5 rounded-2xl shadow-sm text-base leading-relaxed whitespace-pre-wrap
          ${isUser
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white/80 backdrop-blur-sm border border-white/60 text-gray-700 rounded-bl-none'
                        }`}
                >
                    {displayContent}
                </div>

                {isUser && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                        <User size={20} className="text-gray-500" />
                    </div>
                )}
            </div>

            {/* Render Choices Buttons if they exist and it's an assistant message */}
            {!isUser && choices.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 ml-12 max-w-[85%] animate-fade-in-up">
                    {choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSelect && onSelect(choice)}
                            className="px-4 py-2 bg-white border-2 border-primary/50 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-sm active:scale-95"
                        >
                            {choice}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
