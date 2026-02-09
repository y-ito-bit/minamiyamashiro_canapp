import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

// Type definitions for Web Speech API
interface IWindow extends Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
}

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function useChat() {
    const { mbtiType, nextStep, userName } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null); // Use any for simplicity with non-standard API

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { SpeechRecognition, webkitSpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const reco = new SpeechRecognitionConstructor();
                reco.continuous = false; // Stop after one sentence for smoother interaction
                reco.lang = 'ja-JP';
                reco.interimResults = false;

                reco.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                };

                reco.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                reco.onend = () => {
                    setIsListening(false);
                };

                setRecognition(reco);
            }
        }
    }, []); // Run once

    const toggleListening = () => {
        if (!recognition) {
            alert("お使いのブラウザは音声入力をサポートしていません。Chromeをお試しください。");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const newMessages = [...messages, { role: 'user', content } as Message];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages,
                    mbtiType,
                    userName,
                }),
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                assistantMessage += text;

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: assistantMessage };
                    return updated;
                });
            }

            // Basic logic to transition after X messages (e.g., 10 turns)
            // This is a simplified check.
            if (messages.length >= 10 && messages.length % 5 === 0) {
                // Maybe trigger a "Show Report" button or auto-transition?
                // User requirements: 15 questions -> Unlock, 20 -> Force.
                // We track "messages" length. Each turn is 2 messages (User + AI).
                // 15 questions ~ 30 messages.
            }

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };


    // Function to trigger initial greeting
    const triggerGreeting = async () => {
        setIsLoading(true);
        try {
            // "挨拶して" triggers the system prompt's "First Message" behavior
            // We use a specific hidden prompt or just let the system prompt handle it based on context
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: '（会話を開始してください。最初に自己紹介し、「あなたは5年間、どちらの事務所でどのような業務をしてきましたか？」と聞いてください。）' }],
                    mbtiType,
                    userName,
                }),
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages([{ role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                assistantMessage += text;

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[0] = { role: 'assistant', content: assistantMessage };
                    return updated;
                });
            }
        } catch (error) {
            console.error('Error fetching greeting:', error);
            // Fallback greeting if API fails
            setMessages([{ role: 'assistant', content: `こんにちは！${mbtiType}タイプですね。あなたの強みを見つける作戦会議を始めましょう。` }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial greeting if empty
    useEffect(() => {
        if (messages.length === 0 && mbtiType) {
            triggerGreeting();
        }
    }, [mbtiType]); // eslint-disable-line

    return {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
        isListening,
        toggleListening
    };
}
