
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingItem } from '../types';
import { TRANSLATIONS, Language, CURRENCY_OPTIONS } from '../constants';
import { X, Edit2, Trash2, MapPin, CalendarClock, Tag, ShoppingCart, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ItemDetailModalProps {
  item: ShoppingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  lang?: Language;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  lang = 'en'
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);

  if (!item || !isOpen) return null;

  const t = TRANSLATIONS[lang];
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.value === item.currency)?.symbol || '¥';

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  const isUrl = (str: string) => /^(https?:\/\/|www\.|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(str.trim());

  const handlePrevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : item.media.length - 1));
  };

  const handleNextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMediaIndex((prev) => (prev < item.media.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Actions */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2.5 bg-white/90 dark:bg-gray-700/90 backdrop-blur-md rounded-full shadow-lg text-gray-500 dark:text-gray-400 hover:scale-105 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Preview */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 w-full overflow-hidden flex-shrink-0 group">
          {item.media.length > 0 ? (
            <div 
              className="h-full w-full cursor-zoom-in" 
              onClick={() => setIsMediaExpanded(true)}
            >
              {item.media[activeMediaIndex].type === 'image' ? (
                <img 
                  src={item.media[activeMediaIndex].url} 
                  alt={item.name} 
                  className="h-full w-full object-contain"
                />
              ) : (
                <video 
                  src={item.media[activeMediaIndex].url} 
                  className="h-full w-full object-contain"
                  controls={false}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Maximize2 size={24} />
                </div>
              </div>

              {item.media.length > 1 && (
                <>
                  <button onClick={handlePrevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all z-20">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={handleNextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all z-20">
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium z-20">
                    {activeMediaIndex + 1} / {item.media.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-700">
              <ShoppingCart size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <Tag size={12} />
                  {t.categories[item.category as keyof typeof t.categories] || item.category}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                  item.status === 'in-stock' ? 'bg-green-500' : 
                  item.status === 'low' ? 'bg-orange-500' : 
                  item.status === 'to-buy' ? 'bg-indigo-500' : 'bg-red-500'
                }`}>
                  {t[item.status as keyof typeof t] || item.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {item.price !== null ? `${currencySymbol}${item.price.toLocaleString()}` : '—'}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{t.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">
                <MapPin size={14} /> {t.storeLabel}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                {item.store ? (
                  isUrl(item.store) ? (
                    <a 
                      href={item.store.trim().startsWith('http') ? item.store.trim() : `https://${item.store.trim()}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline"
                    >
                      {item.store}
                    </a>
                  ) : item.store
                ) : '-'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">
                <CalendarClock size={14} /> {t.expiryDate}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {item.expiryDate ? formatDate(item.expiryDate) : '-'}
              </div>
            </div>
          </div>

          {item.notes && (
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500 font-bold mb-2 uppercase tracking-wider">{t.noteLabel}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <button 
            onClick={() => {
              if (window.confirm(t.confirmDelete)) {
                onDelete(item.id);
                onClose();
              }
            }}
            className="flex-shrink-0 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 size={24} />
          </button>
          <button 
            onClick={() => onEdit(item)}
            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            <Edit2 size={20} />
            {t.edit}
          </button>
        </div>
      </div>

      {/* Expanded Media Overlay using Portal */}
      {isMediaExpanded && item.media.length > 0 && createPortal(
        <div 
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setIsMediaExpanded(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[610]"
            onClick={(e) => {
              e.stopPropagation();
              setIsMediaExpanded(false);
            }}
          >
            <X size={32} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            {item.media[activeMediaIndex].type === 'image' ? (
              <img 
                src={item.media[activeMediaIndex].url} 
                alt={item.name} 
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                src={item.media[activeMediaIndex].url} 
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {item.media.length > 1 && (
            <>
              <button 
                onClick={handlePrevMedia} 
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={handleNextMedia} 
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
              >
                <ChevronRight size={32} />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-lg">
                {activeMediaIndex + 1} / {item.media.length}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
