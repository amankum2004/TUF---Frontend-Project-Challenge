// components/NotesSection.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { endOfWeek, format, isValid, parseISO, startOfWeek } from 'date-fns';
import type { PlannerScope, PlannerTask } from '@/lib/planner';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
  tasks: PlannerTask[];
  onTasksChange: (tasks: PlannerTask[]) => void;
  currentMonth: Date;
}

type NoteTab = 'monthly' | 'range' | 'planner';
type TaskFilter = 'all' | 'open' | 'done';

const scopeLabels: Record<PlannerScope, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  range: 'Range',
};

export default function NotesSection({
  notes,
  onNotesChange,
  selectedRange,
  tasks,
  onTasksChange,
  currentMonth,
}: NotesSectionProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>('monthly');
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const savedRange = localStorage.getItem('calendar-notes-range');
    if (!savedRange) return {};
    try {
      return JSON.parse(savedRange);
    } catch {
      return {};
    }
  });
  const [localNotes, setLocalNotes] = useState(notes);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskScope, setTaskScope] = useState<PlannerScope>('day');
  const [taskDate, setTaskDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [weekAnchor, setWeekAnchor] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [monthValue, setMonthValue] = useState(() => format(new Date(), 'yyyy-MM'));
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (selectedRange.start) {
      const formatted = format(selectedRange.start, 'yyyy-MM-dd');
      setTaskDate(formatted);
      setWeekAnchor(formatted);
    }
    if (selectedRange.start && selectedRange.end) {
      setRangeStart(format(selectedRange.start, 'yyyy-MM-dd'));
      setRangeEnd(format(selectedRange.end, 'yyyy-MM-dd'));
    }
  }, [selectedRange.start, selectedRange.end]);

  useEffect(() => {
    setMonthValue(format(currentMonth, 'yyyy-MM'));
  }, [currentMonth]);

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

  const formatTaskTiming = (task: PlannerTask): string => {
    switch (task.scope) {
      case 'day':
        return task.date ? format(parseISO(task.date), 'MMM d, yyyy') : 'No date';
      case 'week': {
        if (!task.weekStart) return 'No week';
        const start = parseISO(task.weekStart);
        const end = endOfWeek(start, { weekStartsOn: 0 });
        return `Week of ${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
      }
      case 'month': {
        if (!task.month) return 'No month';
        const monthDate = parseISO(`${task.month}-01`);
        return format(monthDate, 'MMMM yyyy');
      }
      case 'range':
        if (!task.rangeStart || !task.rangeEnd) return 'No range';
        return `${format(parseISO(task.rangeStart), 'MMM d')} - ${format(parseISO(task.rangeEnd), 'MMM d, yyyy')}`;
      default:
        return 'Schedule';
    }
  };

  const weekRangeText = useMemo(() => {
    if (!weekAnchor) return 'Select a week';
    const anchorDate = parseISO(weekAnchor);
    if (!isValid(anchorDate)) return 'Select a week';
    const start = startOfWeek(anchorDate, { weekStartsOn: 0 });
    const end = endOfWeek(anchorDate, { weekStartsOn: 0 });
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }, [weekAnchor]);

  const canAddTask = useMemo(() => {
    if (!taskTitle.trim()) return false;
    if (taskScope === 'day') return !!taskDate;
    if (taskScope === 'week') return !!weekAnchor;
    if (taskScope === 'month') return !!monthValue;
    return !!rangeStart && !!rangeEnd;
  }, [taskTitle, taskScope, taskDate, weekAnchor, monthValue, rangeStart, rangeEnd]);

  const handleAddTask = () => {
    if (!canAddTask) return;

    const makeId = () => {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
      }
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const newTask: PlannerTask = {
      id: makeId(),
      title: taskTitle.trim(),
      scope: taskScope,
      createdAt: new Date().toISOString(),
      reminderEnabled: reminderEnabled ? true : undefined,
      reminderTime: reminderEnabled ? reminderTime : undefined,
    };

    if (taskScope === 'day') {
      newTask.date = taskDate;
    }

    if (taskScope === 'week') {
      const anchorDate = parseISO(weekAnchor);
      if (isValid(anchorDate)) {
        const start = startOfWeek(anchorDate, { weekStartsOn: 0 });
        newTask.weekStart = format(start, 'yyyy-MM-dd');
      }
    }

    if (taskScope === 'month') {
      newTask.month = monthValue;
    }

    if (taskScope === 'range') {
      const start = parseISO(rangeStart);
      const end = parseISO(rangeEnd);
      if (isValid(start) && isValid(end)) {
        if (start <= end) {
          newTask.rangeStart = format(start, 'yyyy-MM-dd');
          newTask.rangeEnd = format(end, 'yyyy-MM-dd');
        } else {
          newTask.rangeStart = format(end, 'yyyy-MM-dd');
          newTask.rangeEnd = format(start, 'yyyy-MM-dd');
        }
      }
    }

    onTasksChange([newTask, ...tasks]);
    setTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    onTasksChange(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    if (taskFilter === 'open') return sorted.filter(task => !task.completed);
    if (taskFilter === 'done') return sorted.filter(task => task.completed);
    return sorted;
  }, [tasks, taskFilter]);

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-display font-semibold text-stone-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Notes & Planner
        </h3>
      </div>

      {/* Note Type Toggle */}
      <div className="flex gap-2 mb-4 border-b border-stone-200/70">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeTab === 'monthly'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Monthly Memo
        </button>
        <button
          onClick={() => setActiveTab('range')}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeTab === 'range'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Range Notes
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeTab === 'planner'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Planner
        </button>
      </div>

      {/* Selected Range Display */}
      {activeTab === 'range' && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200/70">
          <p className="text-xs text-amber-800 font-medium">Selected Date Range</p>
          <p className="text-sm text-amber-900 font-semibold">{formatRangeText()}</p>
        </div>
      )}

      {/* Notes Textarea */}
      {activeTab !== 'planner' && (
        <div className="flex-1">
          {activeTab === 'monthly' ? (
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
      )}

      {/* Planner Section */}
      {activeTab === 'planner' && (
        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-semibold">
              Add Task or Event
            </p>
            <div className="mt-3 space-y-3">
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Event title or reminder"
                className="w-full rounded-xl border border-stone-200/80 bg-white/90 px-3 py-2 text-sm text-stone-700 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />

              <div className="flex flex-wrap gap-2">
                {(['day', 'week', 'month', 'range'] as PlannerScope[]).map(scope => (
                  <button
                    key={scope}
                    onClick={() => setTaskScope(scope)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      taskScope === scope
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {scopeLabels[scope]}
                  </button>
                ))}
              </div>

              {taskScope === 'day' && (
                <div>
                  <label className="text-xs text-stone-500 font-medium">Day</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-sm text-stone-700"
                  />
                </div>
              )}

              {taskScope === 'week' && (
                <div>
                  <label className="text-xs text-stone-500 font-medium">Week (anchor date)</label>
                  <input
                    type="date"
                    value={weekAnchor}
                    onChange={(e) => setWeekAnchor(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-sm text-stone-700"
                  />
                  <p className="mt-1 text-xs text-stone-400">Week span: {weekRangeText}</p>
                </div>
              )}

              {taskScope === 'month' && (
                <div>
                  <label className="text-xs text-stone-500 font-medium">Month</label>
                  <input
                    type="month"
                    value={monthValue}
                    onChange={(e) => setMonthValue(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-sm text-stone-700"
                  />
                </div>
              )}

              {taskScope === 'range' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-stone-500 font-medium">Range start</label>
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-sm text-stone-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 font-medium">Range end</label>
                    <input
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-sm text-stone-700"
                    />
                  </div>
                  {selectedRange.start && selectedRange.end && (
                    <p className="col-span-2 text-xs text-stone-400">
                      Prefilled from selected range: {formatRangeText()}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-stone-200/70 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-stone-700">Reminder</p>
                  <p className="text-xs text-stone-400">Add a time to stay on track</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  {reminderEnabled && (
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="rounded-lg border border-stone-200 px-2 py-1 text-xs text-stone-700"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={handleAddTask}
                disabled={!canAddTask}
                className={`w-full rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  canAddTask
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Add to Planner
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-semibold">
                Planner Items
              </p>
              <div className="flex gap-2 text-xs font-semibold">
                {(['all', 'open', 'done'] as TaskFilter[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-2 py-1 rounded-full ${
                      taskFilter === filter
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'open' ? 'Open' : 'Done'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {filteredTasks.length === 0 && (
                <p className="text-sm text-stone-400">No planner items yet. Add your first task above.</p>
              )}
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`rounded-xl border border-stone-200/70 bg-white p-3 transition-opacity ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{task.title}</p>
                      <p className="text-xs text-stone-500">
                        {scopeLabels[task.scope]} · {formatTaskTiming(task)}
                      </p>
                      {task.reminderEnabled && task.reminderTime && (
                        <p className="text-xs text-amber-700 font-medium">
                          Reminder at {task.reminderTime}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.completed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {task.completed ? 'Undo' : 'Done'}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative pin / calendar detail */}
      <div className="mt-4 pt-4 border-t border-stone-200 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
      </div>
    </div>
  );
}
