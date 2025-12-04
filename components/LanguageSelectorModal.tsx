import React from 'react';
import { Language } from '../constants';
import { Languages } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onSelect: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語' },
  { code: 'zh', label: 'Chinese', nativeName: '中文' },
  { code: 'my', label: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'ko', label: 'Korean', nativeName: '한국어' },
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
          <Languages size={24} />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Select Language</h2>
        
        <div className="w-full space-y-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-between transition-all group"
            >
              <div className="flex flex-col items-start">
                 <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{lang.nativeName}</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">{lang.label}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          Language can be changed later in Settings.
        </p>
      </div>
    </div>
  );
};
