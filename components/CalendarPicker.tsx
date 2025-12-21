
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-react';

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

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`pad-${i}`} className="h-10 w-10" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isSelected = selectedDate && 
                       selectedDate.getDate() === d && 
                       selectedDate.getMonth() === viewDate.getMonth() && 
                       selectedDate.getFullYear() === viewDate.getFullYear();
    
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
          ${isSelected 
            ? 'bg-blue-600 text-white shadow-md scale-110' 
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl w-full max-w-[340px] overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 group cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
            <ChevronRight size={20} className="text-blue-500 mt-1" />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={handlePrevMonth} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <button type="button" onClick={handleNextMonth} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded-full">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-[10px] font-bold text-gray-400 tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 min-h-[240px]">
          {days}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
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
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
