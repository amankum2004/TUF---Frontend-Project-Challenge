// app/page.tsx
'use client';

import { useState } from 'react';
import Calendar from '@/components/Calendar';
import HeroImage from '@/components/HeroImage';
import NotesSection from '@/components/NotesSection';
import { DateRangeProvider } from '@/hooks/useDateRange'; // This now points to .tsx file

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('calendar-notes-monthly') ?? '';
  });

  return (
    <DateRangeProvider>
      <div className="max-w-7xl mx-auto">
        {/* Wall Calendar Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          {/* Main Calendar Area */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Hero Image & Calendar */}
            <div className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="space-y-6">
                {/* Hero Image Section */}
                <HeroImage currentMonth={currentMonth} />

                {/* Calendar Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    aria-label="Previous month"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-800">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    aria-label="Next month"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Component */}
                <Calendar
                  currentMonth={currentMonth}
                  selectedRange={selectedRange}
                  onRangeChange={setSelectedRange}
                />
              </div>
            </div>

            {/* Right Panel - Notes Section */}
            <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-stone-200 bg-stone-50">
              <NotesSection
                notes={notes}
                onNotesChange={setNotes}
                selectedRange={selectedRange}
              />
            </div>
          </div>
        </div>

        {/* Footer / Decorative element */}
        <div className="mt-4 text-center text-stone-400 text-sm">
          <p>Click on any date to start selecting a range. Click again to complete selection.</p>
        </div>
      </div>
    </DateRangeProvider>
  );
}
