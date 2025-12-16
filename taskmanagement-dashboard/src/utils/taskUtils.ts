// src/utils/taskUtils.ts
import { Task, FilterOptions, SortOptions } from '../types';

export const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
};

export const validateTaskForm = (data: { title?: string; dueDate?: string }) => {
  const errors: Record<string, string> = {};
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required.';
  }
  if (data.dueDate) {
    const due = new Date(data.dueDate);
    const min = new Date('1970-01-01T00:00:00Z');
    if (Number.isNaN(due.getTime())) {
      errors.dueDate = 'Due date is invalid.';
    } else if (due < min) {
      errors.dueDate = 'Due date must be after 1970.';
    }
  }
  return errors;
};

export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
  const { status, priority, search } = filters;
  const q = (search ?? '').toLowerCase().trim();
  return tasks.filter(t => {
    const statusOk = !status || status === 'all' ? true : t.status === status;
    const priorityOk = !priority || priority === 'all' ? true : t.priority === priority;
    const searchOk =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.description ? t.description.toLowerCase().includes(q) : false);
    return statusOk && priorityOk && searchOk;
  });
};

const priorityRank: Record<string, number> = { low: 1, medium: 2, high: 3 };
const statusRank: Record<string, number> = { 'todo': 1, 'in-progress': 2, 'done': 3 };

export const sortTasks = (tasks: Task[], sort: SortOptions): Task[] => {
  const { key, order } = sort;
  const dir = order === 'asc' ? 1 : -1;
  const byText = (a?: string, b?: string) => (a ?? '').localeCompare(b ?? '') * dir;
  const byDate = (a?: string, b?: string) =>
    ((a ? new Date(a).getTime() : 0) - (b ? new Date(b).getTime() : 0)) * dir;
  const byRank = (r: Record<string, number>) => (a?: string, b?: string) =>
    ((a ? r[a] : 0) - (b ? r[b] : 0)) * dir;

  const compare = {
    title: (a: Task, b: Task) => byText(a.title, b.title),
    status: (a: Task, b: Task) => byRank(statusRank)(a.status, b.status),
    priority: (a: Task, b: Task) => byRank(priorityRank)(a.priority, b.priority),
    createdAt: (a: Task, b: Task) => byDate(a.createdAt, b.createdAt),
    dueDate: (a: Task, b: Task) => byDate(a.dueDate, b.dueDate),
  }[key];

  return [...tasks].sort(compare);
};

export const computeStats = (tasks: Task[]) => {
  const now = Date.now();
  const total = tasks.length;
  let todo = 0, inProgress = 0, done = 0, overdue = 0;
  for (const t of tasks) {
    if (t.status === 'todo') todo++;
    else if (t.status === 'in-progress') inProgress++;
    else if (t.status === 'done') done++;
    if (t.dueDate && new Date(t.dueDate).getTime() < now && t.status !== 'done') overdue++;
  }
  return { total, todo, inProgress, done, overdue };
};
