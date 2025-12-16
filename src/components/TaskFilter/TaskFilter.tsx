import { ChangeEvent } from 'react';
import { FilterOptions, TaskFilterProps } from '../../types';

export default function TaskFilter({ filters, onChange, theme }: TaskFilterProps) {
  const set = (patch: Partial<FilterOptions>) => onChange({ ...filters, ...patch });

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => set({ search: e.target.value });
  const onStatus = (e: ChangeEvent<HTMLSelectElement>) => set({ status: e.target.value as FilterOptions['status'] });
  const onPriority = (e: ChangeEvent<HTMLSelectElement>) => set({ priority: e.target.value as FilterOptions['priority'] });

  const active = [
    filters.status && filters.status !== 'all' ? `Status: ${filters.status}` : null,
    filters.priority && filters.priority !== 'all' ? `Priority: ${filters.priority}` : null,
    filters.search ? `Search: "${filters.search}"` : null,
  ].filter(Boolean);

  return (
    <div className={`task-filter task-filter--${theme}`}>
      <input placeholder="Search tasks..." value={filters.search ?? ''} onChange={onSearch} />
      <select value={filters.status ?? 'all'} onChange={onStatus}>
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In-Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={filters.priority ?? 'all'} onChange={onPriority}>
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="active-filters">
        {active.length ? active.map((a, i) => <span key={i} className="chip">{a}</span>) : <span className="muted">No active filters</span>}
        {!!active.length && <button onClick={() => onChange({ status: 'all', priority: 'all', search: '' })}>Clear</button>}
      </div>
    </div>
  );
}
