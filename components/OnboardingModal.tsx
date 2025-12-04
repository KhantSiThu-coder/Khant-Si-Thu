import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../constants';
import { X, Sparkles, CheckCircle2, ShoppingBag, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = TRANSLATIONS[lang];
  const steps = [
    {
      icon: <ShoppingBag size={48} className="text-indigo-600 dark:text-indigo-400" />,
      title: t.onboarding.welcomeTitle,
      desc: t.onboarding.welcomeDesc,
    },
    {
      icon: <Sparkles size={48} className="text-blue-500" />,
      title: t.onboarding.aiTitle,
      desc: t.onboarding.aiDesc,
    },
    {
      icon: <CheckCircle2 size={48} className="text-green-500" />,
      title: t.onboarding.trackTitle,
      desc: t.onboarding.trackDesc,
    },
    {
      icon: <ShieldCheck size={48} className="text-gray-600 dark:text-gray-400" />,
      title: t.onboarding.privacyTitle,
      desc: t.onboarding.privacyDesc,
    },
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center text-center p-8 pt-12 min-h-[360px]">
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl shadow-inner">
             {steps[currentStep].icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {steps[currentStep].desc}
          </p>
        </div>

        {/* Navigation & Indicators */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-600'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
             {currentStep > 0 && (
                <button
                onClick={handlePrev}
                className="flex-shrink-0 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
             )}
             
             <button
               onClick={handleNext}
               className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
             >
               {currentStep === steps.length - 1 ? t.onboarding.start : t.onboarding.next}
               {currentStep < steps.length - 1 && <ChevronRight size={18} />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
