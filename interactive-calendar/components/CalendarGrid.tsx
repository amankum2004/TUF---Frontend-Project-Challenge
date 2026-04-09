// components/CalendarGrid.tsx
'use client';

import { format } from 'date-fns';
import { clsx } from 'clsx';

interface CalendarGridProps {
  date: Date;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInHoverRange: boolean;
  isToday: boolean;
  holidayLabel?: string | null;
  taskIndicators: {
    markerCount: number;
    hasReminder: boolean;
    spanTone: 'range' | 'week' | null;
  };
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function CalendarGrid({
  date,
  isCurrentMonth,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isInHoverRange,
  isToday,
  holidayLabel,
  taskIndicators,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CalendarGridProps) {
  const dayNumber = format(date, 'd');

  const baseClasses = "calendar-day relative p-1 md:p-2 cursor-pointer transition-all duration-200 group hover:shadow-sm hover:bg-amber-50/70";
  const monthClasses = !isCurrentMonth ? "text-stone-400 bg-stone-50/70" : "text-stone-800";
  
  const rangeClasses = clsx({
    'bg-amber-50/80': isInRange && !isRangeStart && !isRangeEnd,
    'bg-amber-100/70': isInHoverRange && !isRangeStart && !isRangeEnd,
  });

  const startEndClasses = clsx({
    'bg-amber-600 text-white hover:bg-amber-700 shadow-sm': isRangeStart || isRangeEnd,
    'rounded-l-xl': isRangeStart,
    'rounded-r-xl': isRangeEnd,
  });

  const todayClasses = isToday && !isRangeStart && !isRangeEnd ? "ring-2 ring-amber-400 ring-inset" : "";
  const dotCount = Math.min(taskIndicators.markerCount, 3);

  return (
    <div
      className={clsx(baseClasses, monthClasses, rangeClasses, startEndClasses, todayClasses)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {holidayLabel && (
        <span className="absolute top-1 right-1 text-[0.55rem] md:text-[0.6rem] px-1 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
          {holidayLabel}
        </span>
      )}
      {taskIndicators.hasReminder && (
        <span className="absolute top-1 left-1 text-amber-600">
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a5 5 0 00-5 5v2.2l-.7 1.4A1 1 0 005.2 12h9.6a1 1 0 00.9-1.4l-.7-1.4V7a5 5 0 00-5-5zm0 16a2 2 0 001.7-1H8.3A2 2 0 0010 18z" />
          </svg>
        </span>
      )}
      <span className={clsx("inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-sm md:text-base font-medium", {
        'bg-amber-500 text-white rounded-full shadow-sm': isToday && !isRangeStart && !isRangeEnd,
      })}>
        {dayNumber}
      </span>
      {taskIndicators.spanTone && (
        <span
          className={clsx(
            "absolute left-1 right-1 bottom-1 h-0.5 rounded-full",
            taskIndicators.spanTone === 'range' ? 'bg-emerald-300/80' : 'bg-sky-300/80'
          )}
        />
      )}
      {dotCount > 0 && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          {Array.from({ length: dotCount }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-amber-500/80" />
          ))}
          {taskIndicators.markerCount > 3 && (
            <span className="text-[0.6rem] text-amber-600 font-semibold">+</span>
          )}
        </div>
      )}
    </div>
  );
}
