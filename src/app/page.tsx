'use client';

import { useAppStore } from '@/store/useAppStore';
import Step1 from '@/components/step1/Step1';
import Step2 from '@/components/step2/Step2';
import Step3 from '@/components/step3/Step3';

export default function Home() {
  const { currentStep } = useAppStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements can go here */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl -z-10 animate-[pulse_4s_infinite]"></div>

      <div className="z-10 w-full max-w-4xl transition-all duration-500 flex flex-col items-center">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
      </div>
    </main>
  );
}
