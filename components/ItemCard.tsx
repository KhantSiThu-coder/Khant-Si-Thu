import React from 'react';
import { ShoppingItem } from '../types';
import { MapPin, Check, ShoppingCart, Trash2, Ban } from 'lucide-react';
import { TRANSLATIONS, Language } from '../constants';

interface ItemCardProps {
  item: ShoppingItem;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onClick: (item: ShoppingItem) => void;
  size?: 'small' | 'medium' | 'large';
  lang?: Language;
  currencySymbol?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onStatusToggle, 
  onDelete, 
  onClick, 
  size = 'medium', 
  lang = 'en',
  currencySymbol = '¥'
}) => {
  const t = TRANSLATIONS[lang];
  const coverMedia = item.media.length > 0 ? item.media[0] : null;

  const getStatusBadge = () => {
    const baseClasses = "rounded-md font-semibold backdrop-blur-md text-white shadow-sm";
    const sizeClasses = size === 'small' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]";
    
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

  const getActionButton = () => {
    if (item.status === 'dont-like') {
        const baseColor = "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50";
        // When clicked, maybe allow moving back to 'to-buy' (re-trying) or just be a static indicator?
        // Based on app logic, toggling moves it to 'to-buy' by default if not 'to-buy'.
        // Let's allow restoring it to list.
        
        if (size === 'small') {
            return (
              <button
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  e.preventDefault();
                  onStatusToggle(item.id, item.status); 
                }}
                className={`w-full py-1 rounded-md text-[10px] font-medium flex items-center justify-center transition-colors ${baseColor}`}
                title={t.addList}
              >
                <Ban size={12} />
              </button>
            );
        }
        return (
            <button
                type="button"
                onClick={(e) => { 
                  e.stopPropagation();
                  e.preventDefault();
                  onStatusToggle(item.id, item.status); 
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${baseColor}`}
            >
                <Ban size={14} /> {t.addList}
            </button>
        );
    }

    const isToBuy = item.status === 'to-buy';
    const Label = isToBuy ? t.markBought : t.addList;
    const Icon = isToBuy ? Check : ShoppingCart;
    const baseColor = isToBuy 
      ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50" 
      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50";
    
    if (size === 'small') {
      return (
        <button
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            e.preventDefault();
            onStatusToggle(item.id, item.status); 
          }}
          className={`w-full py-1 rounded-md text-[10px] font-medium flex items-center justify-center transition-colors ${baseColor}`}
          title={Label}
        >
          <Icon size={12} />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => { 
          e.stopPropagation();
          e.preventDefault();
          onStatusToggle(item.id, item.status); 
        }}
        className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${baseColor}`}
      >
        <Icon size={14} /> {Label}
      </button>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col h-full ${item.status === 'dont-like' ? 'opacity-80' : ''}`}>
      <div 
        onClick={() => onClick(item)} 
        className="cursor-pointer flex-1 relative"
      >
        <div className={`w-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden ${size === 'large' ? 'aspect-video' : 'aspect-[4/3]'}`}>
          {coverMedia ? (
             coverMedia.type === 'image' ? (
              <img src={coverMedia.url} alt={item.name} className={`w-full h-full object-cover ${item.status === 'dont-like' ? 'grayscale' : ''}`} />
             ) : (
               <video src={coverMedia.url} className={`w-full h-full object-cover ${item.status === 'dont-like' ? 'grayscale' : ''}`} />
             )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <ShoppingCart size={size === 'small' ? 20 : 28} />
            </div>
          )}
          
          {item.media.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded flex items-center gap-1 z-10">
              +{item.media.length - 1}
            </div>
          )}
          
          <div className="absolute top-1.5 left-1.5 z-10">
            {getStatusBadge()}
          </div>
        </div>

        <div className={`${size === 'small' ? 'p-1.5' : 'p-3'}`}>
          <div className="flex justify-between items-start mb-0.5 gap-1.5">
            <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-1 ${size === 'large' ? 'text-base' : 'text-xs'}`}>
              {item.name}
            </h3>
            <span className={`font-medium whitespace-nowrap ${
              item.price === null ? 'text-gray-400 dark:text-gray-500 italic text-[10px]' : 'text-gray-900 dark:text-gray-200'
            } ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
              {item.price !== null ? `${currencySymbol}${item.price.toLocaleString()}` : 'Unk.'}
            </span>
          </div>
          
          {size !== 'small' && (
            <>
              <div className="space-y-0.5">
                {item.store && (
                  <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400">
                    <MapPin size={10} className="mr-1" />
                    <span className="truncate">{item.store}</span>
                  </div>
                )}
              </div>
              
              {item.notes && (
                 <p className={`mt-1 text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 italic border-l-2 border-gray-200 dark:border-gray-700 pl-1.5 ${size === 'large' ? 'line-clamp-3' : ''}`}>
                   {item.notes}
                 </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`${size === 'small' ? 'px-1.5 pb-1.5' : 'px-3 pb-3'} pt-0 mt-auto`}>
        {getActionButton()}
      </div>

      {/* Delete Button - Placed at end of container and with z-20 to ensure it is clickable but below header/sidebar */}
      <button 
        type="button"
        onClick={(e) => { 
          e.stopPropagation(); 
          e.preventDefault();
          onDelete(item.id);
        }}
        className={`absolute top-1.5 right-1.5 z-20 bg-white/95 dark:bg-gray-800/95 hover:bg-red-100 dark:hover:bg-red-900/80 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer ${size === 'small' ? 'p-1.5' : 'p-2'}`}
        title={t.delete}
        aria-label={t.delete}
      >
        <Trash2 size={size === 'small' ? 12 : 14} />
      </button>
    </div>
  );
};