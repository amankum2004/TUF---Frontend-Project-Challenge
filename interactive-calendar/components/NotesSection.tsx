// components/NotesSection.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
}

type NoteType = 'monthly' | 'range';

export default function NotesSection({ notes, onNotesChange, selectedRange }: NotesSectionProps) {
  const [activeNoteType, setActiveNoteType] = useState<NoteType>('monthly');
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const savedRange = localStorage.getItem('calendar-notes-range');
    return savedRange ? JSON.parse(savedRange) : {};
  });
  const [localNotes, setLocalNotes] = useState(notes);

  // Save monthly notes to localStorage
  const handleMonthlyNotesChange = (value: string) => {
    setLocalNotes(value);
    onNotesChange(value);
    localStorage.setItem('calendar-notes-monthly', value);
  };

  // Save range-specific notes
  const handleRangeNotesChange = (value: string) => {
    if (selectedRange.start && selectedRange.end) {
      const key = `${format(selectedRange.start, 'yyyy-MM-dd')}_to_${format(selectedRange.end, 'yyyy-MM-dd')}`;
      const updated = { ...rangeNotes, [key]: value };
      setRangeNotes(updated);
      localStorage.setItem('calendar-notes-range', JSON.stringify(updated));
    }
  };

  const getCurrentRangeKey = (): string | null => {
    if (selectedRange.start && selectedRange.end) {
      return `${format(selectedRange.start, 'yyyy-MM-dd')}_to_${format(selectedRange.end, 'yyyy-MM-dd')}`;
    }
    return null;
  };

  const getCurrentRangeNote = (): string => {
    const key = getCurrentRangeKey();
    return key ? rangeNotes[key] || '' : '';
  };

  const formatRangeText = (): string => {
    if (!selectedRange.start) return 'No date range selected';
    if (selectedRange.start && !selectedRange.end) {
      return `Selected start: ${format(selectedRange.start, 'MMM d, yyyy')}`;
    }
    if (selectedRange.start && selectedRange.end) {
      return `${format(selectedRange.start, 'MMM d')} - ${format(selectedRange.end, 'MMM d, yyyy')}`;
    }
    return 'Select dates on calendar';
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-display font-semibold text-stone-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Notes
        </h3>
      </div>

      {/* Note Type Toggle */}
      <div className="flex gap-2 mb-4 border-b border-stone-200/70">
        <button
          onClick={() => setActiveNoteType('monthly')}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeNoteType === 'monthly'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Monthly Memo
        </button>
        <button
          onClick={() => setActiveNoteType('range')}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeNoteType === 'range'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Range Notes
        </button>
      </div>

      {/* Selected Range Display */}
      {activeNoteType === 'range' && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200/70">
          <p className="text-xs text-amber-800 font-medium">Selected Date Range</p>
          <p className="text-sm text-amber-900 font-semibold">{formatRangeText()}</p>
        </div>
      )}

      {/* Notes Textarea */}
      <div className="flex-1">
        {activeNoteType === 'monthly' ? (
          <>
            <textarea
              value={localNotes}
              onChange={(e) => handleMonthlyNotesChange(e.target.value)}
              placeholder="Write your monthly notes or reminders here... Things to do, events, or personal memos for the month."
              className="w-full h-64 p-3 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none bg-white/80 text-stone-700 placeholder-stone-400"
            />
            <p className="mt-2 text-xs text-stone-400">
              Notes are automatically saved to your browser
            </p>
          </>
        ) : (
          <>
            <textarea
              value={getCurrentRangeNote()}
              onChange={(e) => handleRangeNotesChange(e.target.value)}
              placeholder={selectedRange.start && selectedRange.end 
                ? "Add notes specific to this date range..." 
                : "Select a start and end date on the calendar to add range-specific notes"}
              disabled={!selectedRange.start || !selectedRange.end}
              className={`w-full h-64 p-3 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none bg-white/80 text-stone-700 placeholder-stone-400 ${
                (!selectedRange.start || !selectedRange.end) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {selectedRange.start && selectedRange.end && (
              <p className="mt-2 text-xs text-stone-400">
                Notes for {formatRangeText()} are saved automatically
              </p>
            )}
          </>
        )}
      </div>

      {/* Decorative pin / calendar detail */}
      <div className="mt-4 pt-4 border-t border-stone-200 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
      </div>
    </div>
  );
}
