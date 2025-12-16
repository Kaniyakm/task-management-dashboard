import { useState } from 'react';
import { TaskFormData, TaskFormProps } from '../../types';
import { validateTaskForm } from '../../utils/taskUtils';

const EMPTY: TaskFormData = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ initialValues, onSubmit, onCancel, theme }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateTaskForm({ title: form.title, dueDate: form.dueDate });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, dueDate: form.dueDate || undefined });
    setForm(EMPTY);
    setErrors({});
  };

  return (
    <form className={`task-form task-form--${theme}`} onSubmit={submit} noValidate>
      <div className="row">
        <label>
          Title
          <input value={form.title} onChange={e => update('title', e.target.value)} />
          {errors.title && <span className="error">{errors.title}</span>}
        </label>
        <label>
          Status
          <select value={form.status} onChange={e => update('status', e.target.value as TaskFormData['status'])}>
            <option value="todo">Todo</option>
            <option value="in-progress">In-Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={e => update('priority', e.target.value as TaskFormData['priority'])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label>
        Description
        <textarea value={form.description} onChange={e => update('description', e.target.value)} />
      </label>

      <label>
        Due date
        <input type="date" value={form.dueDate ?? ''} onChange={e => update('dueDate', e.target.value)} />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </label>

      <div className="actions">
        <button type="submit">Save Task</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

