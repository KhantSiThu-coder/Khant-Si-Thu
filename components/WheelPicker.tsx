
import React, { useRef, useEffect } from 'react';

interface WheelPickerProps {
  value: number | undefined; // timestamp
  onChange: (timestamp: number) => void;
  mode?: 'date' | 'monthYear';
}

const ITEM_HEIGHT = 44; 

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
  const lastHapticIndex = useRef<number>(-1);

  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      const index = items.findIndex(i => i.value === selectedValue);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
        lastHapticIndex.current = index;
      } else if (items.length > 0) {
        // Fallback to first item if selected value not in range
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [selectedValue, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    
    const currentIndex = Math.round(scrollTop / ITEM_HEIGHT);
    if (currentIndex !== lastHapticIndex.current) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(5); 
      }
      lastHapticIndex.current = currentIndex;
    }

    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      
      const newItem = items[clampedIndex];
      if (newItem && newItem.value !== selectedValue) {
        onSelect(newItem.value);
      }
      
      if (target.scrollTop !== clampedIndex * ITEM_HEIGHT) {
         target.scrollTo({
           top: clampedIndex * ITEM_HEIGHT,
           behavior: 'smooth'
         });
      }
    }, 100);
  };

  return (
    <div className={`h-[220px] relative overflow-hidden flex-1 ${className}`}>
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar py-[88px]" 
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div 
            key={item.value} 
            className={`h-[44px] flex items-center justify-center snap-center transition-all duration-200 select-none ${
              item.value === selectedValue 
                ? 'text-gray-900 dark:text-white font-medium text-xl opacity-100 scale-100' 
                : 'text-gray-400 dark:text-gray-500 text-lg opacity-40 scale-95'
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export const WheelPicker: React.FC<WheelPickerProps> = ({ value, onChange, mode = 'date' }) => {
  const now = new Date();
  const date = value ? new Date(value) : now;
  
  const currentRealYear = now.getFullYear();
  const startYear = currentRealYear;
  const endYear = startYear + 100;

  // Adjust selected year if it's outside the new dynamic range
  const currentYear = Math.max(startYear, Math.min(date.getFullYear(), endYear));
  const currentMonth = date.getMonth() + 1; 
  const currentDay = date.getDate();

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const y = startYear + i;
    return { label: y.toString(), value: y };
  });
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = monthNames.map((name, i) => ({
    label: name,
    value: i + 1
  }));

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1
  }));

  const updateDate = (y: number, m: number, d: number) => {
    const maxDays = new Date(y, m, 0).getDate();
    const clampedDay = Math.min(d, maxDays);
    const newDate = new Date(y, m - 1, clampedDay);
    newDate.setHours(12, 0, 0, 0); 
    onChange(newDate.getTime());
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mt-4">
      <div className="absolute top-1/2 left-4 right-4 h-[44px] -translate-y-1/2 bg-gray-100 dark:bg-gray-700 rounded-xl pointer-events-none z-0" />
      
      <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white dark:from-gray-800 via-white/80 dark:via-gray-800/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white dark:from-gray-800 via-white/80 dark:via-gray-800/80 to-transparent z-10 pointer-events-none" />

      <div className="flex justify-between relative z-20 px-4">
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
        {mode === 'date' && (
          <Column 
            items={days} 
            selectedValue={currentDay} 
            onSelect={(d) => updateDate(currentYear, currentMonth, d)} 
          />
        )}
      </div>
    </div>
  );
};
