// components/Calendar.tsx
'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import CalendarGrid from './CalendarGrid';
import type { PlannerTask } from '@/lib/planner';

interface CalendarProps {
  currentMonth: Date;
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  tasks: PlannerTask[];
}

const holidayLabels: Record<string, string> = {
  '01-01': 'New Year',
  '02-14': 'Valentine',
  '10-31': 'Halloween',
  '12-25': 'Holiday',
};

export default function Calendar({ currentMonth, selectedRange, onRangeChange, tasks }: CalendarProps) {
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

  const getHolidayLabel = (date: Date): string | null => {
    const key = format(date, 'MM-dd');
    return holidayLabels[key] ?? null;
  };

  const getTaskIndicators = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const monthKey = format(date, 'yyyy-MM');
    let markerCount = 0;
    let hasReminder = false;
    let hasRangeSpan = false;
    let hasWeekSpan = false;

    tasks.forEach(task => {
      if (task.completed) return;
      if (task.scope === 'day' && task.date === dateKey) {
        markerCount += 1;
        if (task.reminderEnabled) hasReminder = true;
        return;
      }

      if (task.scope === 'week' && task.weekStart) {
        const weekStartDate = parseISO(task.weekStart);
        const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 0 });
        if (isWithinInterval(date, { start: weekStartDate, end: weekEndDate })) {
          hasWeekSpan = true;
          if (isSameDay(date, weekStartDate)) {
            markerCount += 1;
            if (task.reminderEnabled) hasReminder = true;
          }
        }
        return;
      }

      if (task.scope === 'month' && task.month === monthKey && date.getDate() === 1) {
        markerCount += 1;
        if (task.reminderEnabled) hasReminder = true;
        return;
      }

      if (task.scope === 'range' && task.rangeStart && task.rangeEnd) {
        const rangeStartDate = parseISO(task.rangeStart);
        const rangeEndDate = parseISO(task.rangeEnd);
        if (isWithinInterval(date, { start: rangeStartDate, end: rangeEndDate })) {
          hasRangeSpan = true;
          if (isSameDay(date, rangeStartDate) || isSameDay(date, rangeEndDate)) {
            markerCount += 1;
            if (task.reminderEnabled) hasReminder = true;
          }
        }
      }
    });

    const spanTone: 'range' | 'week' | null = hasRangeSpan ? 'range' : hasWeekSpan ? 'week' : null;

    return {
      markerCount,
      hasReminder,
      spanTone,
    };
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[280px]">
        {/* Weekday headers */}
        <div className="calendar-grid bg-amber-100/60">
          {weekDays.map(day => (
            <div
              key={day}
              className="p-2 text-center text-[0.7rem] md:text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 bg-amber-50/80"
            >
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
              holidayLabel={getHolidayLabel(day)}
              taskIndicators={getTaskIndicators(day)}
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
