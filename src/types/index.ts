// src/types/index.ts

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;   // ISO date string
  dueDate?: string;    // ISO date string
  updatedAt?: string;  // ISO date string
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export type SortKey = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  key: SortKey;
  order: SortOrder;
}

export interface FilterOptions {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  search?: string;
}

export type Theme = 'light' | 'dark';

export interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  sort: SortOptions;
  onSortChange: (next: SortOptions) => void;
  search: string;
  onSearchChange: (q: string) => void;
  theme: Theme;
}

export interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  theme: Theme;
  draggableId?: string;
  index?: number;
}

export interface TaskFormProps {
  initialValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  theme: Theme;
}

export interface TaskFilterProps {
  filters: FilterOptions;
  onChange: (next: FilterOptions) => void;
  theme: Theme;
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}
