// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';
import HeroImage from '@/components/HeroImage';
import NotesSection from '@/components/NotesSection';
import { DateRangeProvider } from '@/hooks/useDateRange'; // This now points to .tsx file
import type { PlannerTask } from '@/lib/planner';

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('calendar-notes-monthly') ?? '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('calendar-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleClearRange = () => {
    setSelectedRange({ start: null, end: null });
  };

  return (
    <DateRangeProvider>
      <div className="max-w-6xl mx-auto animate-float-in">
        <div className="text-center mb-6 md:mb-10">
          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.35em] text-amber-700/80 font-body">
            Seasonal Planner
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-display text-stone-900">
            Interactive Wall Calendar
          </h1>
          <p className="mt-2 text-sm md:text-base text-stone-600 font-body">
            Select a date range, jot notes, and keep the month feeling tangible.
          </p>
        </div>

        <div className="relative">
          {/* Binder rings */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className="h-7 w-7 rounded-full bg-stone-100 border border-stone-300 shadow-sm"
              />
            ))}
          </div>

          {/* Tape accents */}
          <div className="absolute -top-2 left-6 md:left-10 w-20 md:w-24 h-6 bg-amber-100/80 border border-amber-200/70 shadow-sm rotate-[-6deg] z-10" />
          <div className="absolute -top-1 right-6 md:right-12 w-16 md:w-20 h-5 bg-emerald-100/80 border border-emerald-200/70 shadow-sm rotate-[5deg] z-10" />

          {/* Wall Calendar Container */}
          <div className="paper-shell paper-grain rounded-[28px] border border-stone-200/70 overflow-hidden shadow-paper">
            {/* Main Calendar Area */}
            <div className="flex flex-col lg:flex-row">
              {/* Left Panel - Hero Image & Calendar */}
              <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Hero Image Section */}
                  <div className="animate-gentle-sway">
                    <HeroImage currentMonth={currentMonth} />
                  </div>

                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between bg-white/70 rounded-2xl px-3 py-2 border border-stone-200/70 shadow-sm backdrop-blur">
                    <button
                      onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                      className="p-2 rounded-full hover:bg-amber-50 transition-colors"
                      aria-label="Previous month"
                    >
                      <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-2xl md:text-3xl font-display font-semibold text-stone-800 tracking-wide">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h2>
                      <div className="flex items-center gap-2 text-[0.7rem] md:text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                        <button
                          onClick={handleJumpToToday}
                          className="rounded-full px-2 py-1 hover:bg-amber-50 transition-colors"
                        >
                          Today
                        </button>
                        <span className="h-3 w-px bg-stone-300"></span>
                        <button
                          onClick={handleClearRange}
                          className="rounded-full px-2 py-1 hover:bg-amber-50 transition-colors"
                        >
                          Clear Range
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                      className="p-2 rounded-full hover:bg-amber-50 transition-colors"
                      aria-label="Next month"
                    >
                      <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Calendar Component */}
                  <Calendar
                    currentMonth={currentMonth}
                    selectedRange={selectedRange}
                    onRangeChange={setSelectedRange}
                    tasks={tasks}
                  />
                </div>
              </div>

              {/* Right Panel - Notes Section */}
              <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-stone-200/70 bg-white/60">
                <NotesSection
                  notes={notes}
                  onNotesChange={setNotes}
                  selectedRange={selectedRange}
                  tasks={tasks}
                  onTasksChange={setTasks}
                  currentMonth={currentMonth}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Decorative element */}
        <div className="mt-6 text-center text-stone-500 text-sm font-body">
          <p>Click on any date to start selecting a range. Click again to complete selection.</p>
        </div>
      </div>
    </DateRangeProvider>
  );
}
