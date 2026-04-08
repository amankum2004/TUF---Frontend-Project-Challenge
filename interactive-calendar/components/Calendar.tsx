// components/Calendar.tsx
'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import CalendarGrid from './CalendarGrid';

interface CalendarProps {
  currentMonth: Date;
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

export default function Calendar({ currentMonth, selectedRange, onRangeChange }: CalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Generate calendar days including previous/next month days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new selection
      onRangeChange({ start: date, end: null });
    } else {
      // Complete selection - ensure start is before end
      const start = selectedRange.start;
      const end = date;
      if (start <= end) {
        onRangeChange({ start, end });
      } else {
        onRangeChange({ start: end, end: start });
      }
    }
  };

  const isInRange = (date: Date): boolean => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
  };

  const isRangeStart = (date: Date): boolean => {
    return selectedRange.start ? isSameDay(date, selectedRange.start) : false;
  };

  const isRangeEnd = (date: Date): boolean => {
    return selectedRange.end ? isSameDay(date, selectedRange.end) : false;
  };

  const isInHoverRange = (date: Date): boolean => {
    if (!selectedRange.start || selectedRange.end || !hoveredDate) return false;
    const start = selectedRange.start;
    const end = hoveredDate;
    if (start <= end) {
      return isWithinInterval(date, { start, end });
    } else {
      return isWithinInterval(date, { start: end, end: start });
    }
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[280px]">
        {/* Weekday headers */}
        <div className="calendar-grid bg-stone-200">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-stone-600 bg-stone-100">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {calendarDays.map((day, idx) => (
            <CalendarGrid
              key={idx}
              date={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isInRange={isInRange(day)}
              isRangeStart={isRangeStart(day)}
              isRangeEnd={isRangeEnd(day)}
              isInHoverRange={isInHoverRange(day)}
              isToday={isToday(day)}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
