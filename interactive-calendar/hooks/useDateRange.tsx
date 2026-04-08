// hooks/useDateRange.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DateRangeContextType {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  clearRange: () => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const clearRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <DateRangeContext.Provider
      value={{ startDate, endDate, setStartDate, setEndDate, clearRange }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}