
import React, { useRef, useEffect } from 'react';

interface WheelPickerProps {
  value: number | undefined; // timestamp
  onChange: (timestamp: number) => void;
  lang?: string;
}

const ITEM_HEIGHT = 40;

const Column = ({ 
  items, 
  selectedValue, 
  onSelect,
  className = ""
}: { 
  items: { label: string; value: number }[]; 
  selectedValue: number; 
  onSelect: (val: number) => void;
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync scroll position with value
  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      const index = items.findIndex(i => i.value === selectedValue);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, [selectedValue, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const target = e.currentTarget;
    const scrollTop = target.scrollTop;

    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      
      const newItem = items[clampedIndex];
      if (newItem && newItem.value !== selectedValue) {
        onSelect(newItem.value);
      }
      
      // Snap visually
      target.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: 'smooth'
      });
    }, 150);
  };

  return (
    <div className={`h-[200px] relative overflow-hidden flex-1 ${className}`}>
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
        onScroll={handleScroll}
      >
        <div style={{ height: ITEM_HEIGHT * 2 }} />
        {items.map((item) => (
          <div 
            key={item.value} 
            className={`h-[40px] flex items-center justify-center snap-center transition-all duration-200 ${
              item.value === selectedValue 
                ? 'text-indigo-600 dark:text-indigo-400 font-bold text-lg scale-110' 
                : 'text-gray-400 dark:text-gray-500 text-sm'
            }`}
          >
            {item.label}
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT * 2 }} />
      </div>
    </div>
  );
};

export const WheelPicker: React.FC<WheelPickerProps> = ({ value, onChange }) => {
  const now = new Date();
  const date = value ? new Date(value) : now;
  
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 1-12
  const currentDay = date.getDate();

  // Range: Current Year - 1 to +10
  const startYear = now.getFullYear() - 1;
  const years = Array.from({ length: 12 }, (_, i) => {
    const y = startYear + i;
    return { label: y.toString(), value: y };
  });
  
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1
  }));

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1
  }));

  const updateDate = (y: number, m: number, d: number) => {
    // Clamp day to max days in new month/year combo
    const maxDays = new Date(y, m, 0).getDate();
    const clampedDay = Math.min(d, maxDays);
    const newDate = new Date(y, m - 1, clampedDay);
    
    // Set to noon to avoid timezone switching issues at midnight
    newDate.setHours(12, 0, 0, 0); 
    onChange(newDate.getTime());
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Highlight Bar */}
      <div className="absolute top-1/2 left-0 right-0 h-[40px] -translate-y-1/2 bg-gray-200/50 dark:bg-gray-600/30 pointer-events-none border-y border-gray-300/30 dark:border-gray-500/30 z-0" />
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10 pointer-events-none opacity-80" />

      <div className="flex justify-between relative z-0">
        <Column 
          items={years} 
          selectedValue={currentYear} 
          onSelect={(y) => updateDate(y, currentMonth, currentDay)} 
        />
        <Column 
          items={months} 
          selectedValue={currentMonth} 
          onSelect={(m) => updateDate(currentYear, m, currentDay)} 
        />
        <Column 
          items={days} 
          selectedValue={currentDay} 
          onSelect={(d) => updateDate(currentYear, currentMonth, d)} 
        />
      </div>
    </div>
  );
};
