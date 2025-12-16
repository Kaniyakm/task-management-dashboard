// src/components/TaskList/TaskList.tsx
import { TaskListProps } from '../../types';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  onToggleStatus,
  onDelete,
  onEdit,
  onReorder,
  sort,
  onSortChange,
  search,
  onSearchChange,
  theme,
}: TaskListProps) {
  const changeSortKey = (key: typeof sort.key) => onSortChange({ key, order: sort.order });
  const toggleOrder = () => onSortChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' });

  return (
    <div className={`task-list task-list--${theme}`}>
      <div className="list-toolbar">
        <input placeholder="Search in list..." value={search} onChange={e => onSearchChange(e.target.value)} />
        <div className="sort-controls">
          <select value={sort.key} onChange={e => changeSortKey(e.target.value as typeof sort.key)}>
            <option value="createdAt">Created</option>
            <option value="dueDate">Due</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button onClick={toggleOrder}>{sort.order === 'asc' ? 'Asc' : 'Desc'}</button>
        </div>
      </div>

      <ul className="tasks">
        {tasks.map((t, index) => (
          <TaskItem
            key={t.id}
            task={t}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onEdit={onEdit}
            theme={theme}
            draggableId={t.id}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
}
