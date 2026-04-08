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

  return (
    <div
      className={clsx(baseClasses, monthClasses, rangeClasses, startEndClasses, todayClasses)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={clsx("inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 text-sm md:text-base font-medium", {
        'bg-amber-500 text-white rounded-full shadow-sm': isToday && !isRangeStart && !isRangeEnd,
      })}>
        {dayNumber}
      </span>
    </div>
  );
}
