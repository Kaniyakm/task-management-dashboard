// src/components/Dashboard/Dashboard.tsx
// Notes in code explain persistence (localStorage), export/import, theme, and state handlers.
// src/components/Dashboard/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import { Task, TaskFormData, FilterOptions, SortOptions, Theme } from '../../types'
import TaskFilter from '../TaskFilter/TaskFilter'
import TaskForm from '../TaskForm/TaskForm'
import TaskList from '../TaskList/TaskList'
import { filterTasks, sortTasks, computeStats } from '../../utils/taskUtils'

const STORAGE_KEY = 'task-dashboard:data'
const THEME_KEY = 'task-dashboard:theme'

export default function Dashboard() {
  
  // Hydrate tasks from localStorage on first render
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  });

  // Filters, sorting, theme
  const [filters, setFilters] = useState<FilterOptions>({ status: 'all', priority: 'all', search: '' });
  const [sort, setSort] = useState<SortOptions>({ key: 'createdAt', order: 'desc' });
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_KEY) as Theme) || 'light');

  // Persist tasks & theme when they change
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(THEME_KEY, theme), [theme]);

  // Derived data: apply filter+sort in memory
  const visibleTasks = useMemo(() => sortTasks(filterTasks(tasks, filters), sort), [tasks, filters, sort]);
  const stats = useMemo(() => computeStats(tasks), [tasks]);

  // Add new task from TaskForm
  const addTask = (data: TaskFormData) => {
    const now = new Date().toISOString();
    setTasks(prev => [
      {
        id: crypto.randomUUID(), // Use 'uuid' package if crypto.randomUUID is not supported
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        createdAt: now,
        dueDate: data.dueDate,
        updatedAt: now,
      },
      ...prev,
    ]);
  };

  // Edit task by id
  const editTask = (id: string, updates: Partial<Task>) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: now } : t)));
  };

  // Delete task
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  // Cycle status
  const toggleStatus = (id: string) =>
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'done' ? 'todo' : t.status === 'todo' ? 'in-progress' : 'done',
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

  // Reorder list
  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    setTasks(prev => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, moved);
      return next;
    });
  };

  // Export state
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ tasks, filters, sort, theme }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-dashboard-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import state
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (parsed.filters) setFilters(parsed.filters);
        if (parsed.sort) setSort(parsed.sort);
        if (parsed.theme) setTheme(parsed.theme);
      } catch {
        alert('Invalid import file.');
      }
    };
    reader.readAsText(file);
  };

  // Theme toggle
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className={`dashboard dashboard--${theme}`}>
      <header className="dashboard__header">
        <h1>Task Dashboard</h1>

        <div className="header__actions">
          <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
          <button onClick={exportData}>Export</button>
          <label className="import-label">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={e => e.target.files && importData(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Todo: {stats.todo}</span>
          <span>In-Progress: {stats.inProgress}</span>
          <span>Done: {stats.done}</span>
          <span>Overdue: {stats.overdue}</span>
        </div>
      </header>

      <section className="dashboard__controls">
        <TaskFilter filters={filters} onChange={setFilters} theme={theme} />
        <TaskForm onSubmit={addTask} theme={theme} />
      </section>

      <section className="dashboard__list">
        <TaskList
          tasks={visibleTasks}
          onToggleStatus={toggleStatus}
          onDelete={deleteTask}
          onEdit={editTask}
          onReorder={reorderTasks}
          sort={sort}
          onSortChange={setSort}
          search={filters.search ?? ''}
          onSearchChange={q => setFilters(prev => ({ ...prev, search: q }))}
          theme={theme}
        />
      </section>
    </div>
  );
}
