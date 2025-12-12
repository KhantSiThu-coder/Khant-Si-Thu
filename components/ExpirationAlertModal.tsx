
import React from 'react';
import { ShoppingItem } from '../types';
import { TRANSLATIONS, Language } from '../constants';
import { X, CalendarClock, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface ExpirationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  lang?: Language;
}

export const ExpirationAlertModal: React.FC<ExpirationAlertModalProps> = ({
  isOpen,
  onClose,
  items,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.expiryAlertTitle}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
           <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
             {t.expiryAlertDesc}
           </p>

           <div className="space-y-3">
              {items.map((item) => {
                const coverMedia = item.media.length > 0 ? item.media[0] : null;
                const expiryDate = item.expiryDate ? new Date(item.expiryDate) : new Date();
                
                // Calculate rough days difference
                const now = new Date();
                // Reset hours to midnight for accurate day calculation
                const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const expiryMidnight = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
                
                const diffTime = expiryMidnight.getTime() - nowMidnight.getTime();
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let dayText = '';
                if (daysLeft < 0) dayText = 'Expired';
                else if (daysLeft === 0) dayText = 'Today';
                else if (daysLeft === 1) dayText = 'Tomorrow';
                else dayText = `${daysLeft} days`;

                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {coverMedia ? (
                        coverMedia.type === 'image' ? (
                          <img src={coverMedia.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <video 
                            src={coverMedia.url} 
                            className="absolute inset-0 w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                            <CalendarClock size={12} />
                            <span>{expiryDate.toLocaleDateString()}</span>
                         </div>
                         <span className="text-xs font-bold px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded text-red-500 shadow-sm border border-red-100 dark:border-gray-700">
                           {dayText}
                         </span>
                      </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
           <button
             onClick={onClose}
             className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium transition-colors"
           >
             {t.dismiss}
           </button>
        </div>
      </div>
    </div>
  );
};
