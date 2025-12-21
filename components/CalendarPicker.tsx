
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import { WheelPicker } from './WheelPicker';

interface CalendarPickerProps {
  value: number | undefined;
  onChange: (timestamp: number | undefined) => void;
  onClose: () => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, onClose }) => {
  const now = new Date();
  const initialDate = value ? new Date(value) : now;
  
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [isPickerMode, setIsPickerMode] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0);
    setSelectedDate(newDate);
  };

  const handleReset = () => {
    setSelectedDate(null);
  };

  const handleConfirm = () => {
    onChange(selectedDate?.getTime());
    onClose();
  };

  const handleWheelChange = (ts: number) => {
    const d = new Date(ts);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`pad-${i}`} className="h-10 w-10" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const currentIterDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const dayOfWeek = currentIterDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; 
    
    const isToday = now.getDate() === d && 
                    now.getMonth() === viewDate.getMonth() && 
                    now.getFullYear() === viewDate.getFullYear();

    const isSelected = selectedDate && 
                       selectedDate.getDate() === d && 
                       selectedDate.getMonth() === viewDate.getMonth() && 
                       selectedDate.getFullYear() === viewDate.getFullYear();
    
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all relative
          ${isSelected 
            ? 'bg-blue-600 text-white shadow-md scale-110 z-10' 
            : isToday
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 ring-2 ring-blue-500/30'
              : isWeekend
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        {d}
        {isToday && !isSelected && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        )}
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl w-full max-w-[340px] overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setIsPickerMode(!isPickerMode)}
            className="flex items-center gap-2 px-3 py-1 -ml-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
            <ChevronRight 
              size={18} 
              className={`text-blue-500 transition-transform duration-300 ${isPickerMode ? 'rotate-90' : 'rotate-0'}`} 
            />
          </button>
          
          {!isPickerMode && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePrevMonth} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-full transition-colors">
                <ChevronLeft size={22} />
              </button>
              <button type="button" onClick={handleNextMonth} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-full transition-colors">
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>

        {isPickerMode ? (
          <div className="flex-1 min-h-[280px] flex flex-col animate-in slide-in-from-bottom-2">
             <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest text-center">Select Month & Year</div>
             <WheelPicker 
               mode="monthYear"
               value={viewDate.getTime()} 
               onChange={handleWheelChange} 
             />
             <button 
               type="button"
               onClick={() => setIsPickerMode(false)}
               className="mt-4 w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
             >
               <CalendarIcon size={16} /> Back to Grid
             </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                <div 
                  key={day} 
                  className={`text-[10px] font-bold tracking-wider ${idx === 0 || idx === 6 ? 'text-red-500' : 'text-gray-400'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 min-h-[240px]">
              {days}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 text-gray-500 dark:text-gray-400 font-bold text-sm hover:text-red-500 transition-colors"
          >
            Clear
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="h-12 w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none transition-transform active:scale-90"
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
