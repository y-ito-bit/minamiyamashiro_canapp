import { create } from 'zustand';

type MBTIScores = {
    ei: number; // -100 (E) to 100 (I)
    sn: number; // -100 (S) to 100 (N)
    tf: number; // -100 (T) to 100 (F)
    jp: number; // -100 (J) to 100 (P)
};

export type ReportData = {
    focusArea: string[]; // e.g., ["現場の支え手", "チームの調整役"]
    strengthMap: {
        practical: number;     // 実務・専門
        empathy: number;       // 共感
        collaboration: number; // 連携
        resilience: number;    // しなやかさ
    };
    message: string;
    identifiedSkills: {
        type: string; // "実務" or "普遍"
        skillName: string;
        description: string;
    }[];
};

type AppState = {
    currentStep: 1 | 2 | 3;
    userName: string;
    mbtiScores: MBTIScores;
    mbtiType: string;
    reportData: ReportData | null;
    setScore: (axis: keyof MBTIScores, value: number) => void;
    nextStep: () => void;
    setStep: (step: 1 | 2 | 3) => void;
    setUserName: (name: string) => void;
    setReportData: (data: ReportData) => void;
};

// Helper: Calculate type string from scores
const calculateType = (scores: MBTIScores): string => {
    const e = scores.ei <= 0 ? 'E' : 'I';
    const s = scores.sn <= 0 ? 'S' : 'N';
    const t = scores.tf <= 0 ? 'T' : 'F';
    const j = scores.jp <= 0 ? 'J' : 'P';
    return `${e}${s}${t}${j}`;
};

export const useAppStore = create<AppState>((set) => ({
    currentStep: 1,
    userName: '',
    mbtiScores: { ei: 0, sn: 0, tf: 0, jp: 0 },
    mbtiType: 'ESTJ', // Default
    reportData: null,
    setScore: (axis, value) => set((state) => {
        const newScores = { ...state.mbtiScores, [axis]: value };
        return {
            mbtiScores: newScores,
            mbtiType: calculateType(newScores),
        };
    }),
    nextStep: () => set((state) => ({ currentStep: (state.currentStep + 1) as 1 | 2 | 3 })),
    setStep: (step) => set({ currentStep: step }),
    setUserName: (name) => set({ userName: name }),
    setReportData: (data) => set({ reportData: data }),
}));
