
import React from 'react';
import { ShoppingItem } from '../types';
import { MapPin, Check, ShoppingCart, Trash2, Ban, CalendarClock } from 'lucide-react';
import { TRANSLATIONS, Language, CURRENCY_OPTIONS } from '../constants';

interface ItemCardProps {
  item: ShoppingItem;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onClick: (item: ShoppingItem) => void;
  size?: 'small' | 'medium' | 'large';
  lang?: Language;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onStatusToggle, 
  onDelete, 
  onClick, 
  size = 'medium', 
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];
  const coverMedia = item.media.length > 0 ? item.media[0] : null;

  // Determine currency symbol
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.value === item.currency)?.symbol || '¥';

  // Standard date formatter for YYYY/MM/DD
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getStatusBadge = (isList: boolean = false) => {
    const baseClasses = "rounded-md font-semibold backdrop-blur-md text-white shadow-sm z-20 transition-all whitespace-nowrap";
    const sizeClasses = isList ? "px-1.5 py-0.5 text-[8px] sm:text-[10px]" : (size === 'medium' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]");
    
    switch (item.status) {
      case 'to-buy':
        return <span className={`${baseClasses} ${sizeClasses} bg-indigo-500/90`}>{t.toBuy}</span>;
      case 'in-stock':
        return <span className={`${baseClasses} ${sizeClasses} bg-green-500/90`}>{t.inStock}</span>;
      case 'low':
        return <span className={`${baseClasses} ${sizeClasses} bg-orange-500/90`}>{t.low}</span>;
      case 'dont-like':
        return <span className={`${baseClasses} ${sizeClasses} bg-red-500/90`}>{t.dontLike}</span>;
    }
  };

  const getActionButton = (isList: boolean = false) => {
    const isToBuy = item.status === 'to-buy';
    const isDontLike = item.status === 'dont-like';
    
    const Icon = isDontLike ? Ban : (isToBuy ? Check : ShoppingCart);
    const Label = isDontLike ? t.addList : (isToBuy ? t.markBought : t.addList);
    
    const colorClasses = isDontLike 
      ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
      : (isToBuy ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300");

    if (isList) {
      return (
        <button
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            onStatusToggle(item.id, item.status); 
          }}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors shadow-sm border border-black/5 dark:border-white/5 flex-shrink-0 ${colorClasses}`}
          title={Label}
        >
          <Icon size={18} className="sm:w-[20px] sm:h-[20px]" />
        </button>
      );
    }

    if (size === 'medium') {
      return (
        <button
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            onStatusToggle(item.id, item.status); 
          }}
          className={`w-full py-1 rounded-md text-[10px] font-medium flex items-center justify-center transition-colors ${colorClasses}`}
        >
          <Icon size={12} className="mr-1" /> {Label}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => { 
          e.stopPropagation();
          onStatusToggle(item.id, item.status); 
        }}
        className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${colorClasses}`}
      >
        <Icon size={14} /> {Label}
      </button>
    );
  };

  // SMALL VIEW (List / Details)
  if (size === 'small') {
    return (
      <div 
        onClick={() => onClick(item)}
        className="group relative flex items-center gap-3 sm:gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all w-full max-w-full overflow-hidden"
      >
        {/* Thumbnail on the far left */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm">
          {coverMedia ? (
             coverMedia.type === 'image' ? (
              <img src={coverMedia.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <video src={coverMedia.url} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
             )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <ShoppingCart size={24} />
            </div>
          )}
        </div>

        {/* Action and Status Indicator */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[50px] sm:min-w-[60px]">
           {getActionButton(true)}
           {getStatusBadge(true)}
        </div>

        {/* Details Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 overflow-hidden">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate" title={item.name}>
              {item.name}
            </h3>
            <span className={`font-bold whitespace-nowrap text-sm sm:text-base ${item.price === null ? 'text-gray-400 italic font-normal text-xs' : 'text-gray-900 dark:text-gray-200'}`}>
                {item.price !== null ? `${currencySymbol}${item.price.toLocaleString()}` : '—'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[80px] sm:max-w-none">
                {item.category}
             </span>
          </div>

          {/* Metadata Row - Standardized Date Format */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
              {item.store && (
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <MapPin size={12} className="text-gray-400" /> 
                  <span className="truncate">{item.store}</span>
                </span>
              )}
              {item.expiryDate && (
                <span className="flex items-center gap-1 flex-shrink-0">
                  <CalendarClock size={12} className="text-gray-400" /> 
                  <span>{formatDate(item.expiryDate)}</span>
                </span>
              )}
          </div>
        </div>

        {/* Delete on the far right */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
          title={t.delete}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  // Grid Layouts (Medium/Large)
  const isLarge = size === 'large';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col h-full ${item.status === 'dont-like' ? 'opacity-80' : ''}`}>
      <div 
        onClick={() => onClick(item)} 
        className="cursor-pointer flex-1 relative flex flex-col"
      >
        <div className={`w-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden ${isLarge ? 'aspect-[4/3]' : 'aspect-square'}`}>
          {coverMedia ? (
             coverMedia.type === 'image' ? (
              <img 
                src={coverMedia.url} 
                alt={item.name} 
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.status === 'dont-like' ? 'grayscale' : ''}`} 
              />
             ) : (
               <video 
                 src={coverMedia.url} 
                 muted 
                 loop 
                 autoPlay 
                 playsInline
                 className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${item.status === 'dont-like' ? 'grayscale' : ''}`} 
               />
             )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50">
              <ShoppingCart size={isLarge ? 32 : 24} />
            </div>
          )}
          
          {item.media.length > 1 && (
            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1 py-0.5 rounded-md flex items-center gap-1 z-10 font-medium">
              +{item.media.length - 1}
            </div>
          )}
          
          <div className="absolute top-1.5 left-1.5 z-10">
            {getStatusBadge()}
          </div>
        </div>

        <div className={`${isLarge ? 'p-3' : 'p-2'} flex-1 flex flex-col`}>
          <div className="flex justify-between items-start mb-0.5 gap-1.5">
            <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-1 ${isLarge ? 'text-sm' : 'text-[11px]'}`} title={item.name}>
              {item.name}
            </h3>
            <span className={`font-bold whitespace-nowrap ${
              item.price === null ? 'text-gray-400 dark:text-gray-500 italic text-[9px]' : 'text-gray-900 dark:text-gray-200'
            } ${isLarge ? 'text-sm' : 'text-[10px]'}`}>
              {item.price !== null ? `${currencySymbol}${item.price.toLocaleString()}` : '—'}
            </span>
          </div>
          
          {isLarge && (
            <div className="space-y-1 mt-1">
              {item.store && (
                <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400">
                  <MapPin size={10} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{item.store}</span>
                </div>
              )}
              {item.expiryDate && (
                <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400" title={t.expiryDate}>
                  <CalendarClock size={10} className="mr-1 flex-shrink-0" />
                  <span>{formatDate(item.expiryDate)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${isLarge ? 'px-3 pb-3' : 'px-2 pb-2'} pt-0 mt-auto`}>
        {getActionButton()}
      </div>

      <button 
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          onDelete(item.id);
        }}
        className={`absolute top-1 right-1 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-red-100 dark:hover:bg-red-900/80 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 p-1.5`}
        title={t.delete}
      >
        <Trash2 size={isLarge ? 14 : 12} />
      </button>
    </div>
  );
};
