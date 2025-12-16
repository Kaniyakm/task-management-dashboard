import { TaskListProps } from '../../types';
import TaskItem from './TaskItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// TaskList component
// Notes:
// - Renders a list of tasks with search and sort controls
// - Uses TransitionGroup + CSSTransition to animate task add/remove
// - Passes handlers down to TaskItem for toggle, edit, delete
// - Sort and search controls update parent state via props

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
  // Helper to change sort key
  const changeSortKey = (key: typeof sort.key) =>
    onSortChange({ key, order: sort.order });

  // Helper to toggle sort order
  const toggleOrder = () =>
    onSortChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' });

  return (
    <div className={`task-list task-list--${theme}`}>
      {/* Toolbar: search + sort */}
      <div className="list-toolbar">
        <input
          placeholder="Search in list..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
        <div className="sort-controls">
          <select
            value={sort.key}
            onChange={e => changeSortKey(e.target.value as typeof sort.key)}
          >
            <option value="createdAt">Created</option>
            <option value="dueDate">Due</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button onClick={toggleOrder}>
            {sort.order === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Animated task items */}
      {/* TransitionGroup replaces <ul> and manages enter/exit animations */}
      <TransitionGroup component="ul" className="tasks">
        {tasks.map((t, index) => (
          <CSSTransition
            key={t.id}
            timeout={200}              // duration matches CSS transition
            classNames="task-item"     // hooks into .task-item-enter/exit classes in app.css
          >
            <TaskItem
              task={t}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onEdit={onEdit}
              theme={theme}
              draggableId={t.id}
              index={index}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

