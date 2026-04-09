export type PlannerScope = 'day' | 'week' | 'month' | 'range';

export type PlannerTask = {
  id: string;
  title: string;
  scope: PlannerScope;
  date?: string; // yyyy-MM-dd for day tasks
  weekStart?: string; // yyyy-MM-dd for week anchor (week start)
  month?: string; // yyyy-MM for monthly tasks
  rangeStart?: string; // yyyy-MM-dd
  rangeEnd?: string; // yyyy-MM-dd
  reminderEnabled?: boolean;
  reminderTime?: string; // HH:mm
  completed?: boolean;
  createdAt: string;
};
