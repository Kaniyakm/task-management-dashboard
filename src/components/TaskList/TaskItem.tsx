import { TaskItemProps } from '../../types';
import { formatDate } from '../../utils/taskUtils';

export default function TaskItem({ task, onToggleStatus, onDelete, onEdit, theme }: TaskItemProps) {
  const bumpPriority = () => {
    const next = task.priority === 'low' ? 'medium' : task.priority === 'medium' ? 'high' : 'low';
    onEdit(task.id, { priority: next });
  };

  return (
    <li className={`task-item task-item--${theme}`}>
      <div className="task-item__head">
        <h3 className={`title ${task.status}`}>{task.title}</h3>
        <div className="actions">
          <button onClick={() => onToggleStatus(task.id)}>Toggle Status</button>
          <button onClick={bumpPriority}>Bump Priority</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
      {task.description && <p className="desc">{task.description}</p>}
      <div className="meta">
        <span>Status: {task.status}</span>
        <span>Priority: {task.priority}</span>
        <span>Created: {formatDate(task.createdAt)}</span>
        {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
      </div>
    </li>
  );
}

