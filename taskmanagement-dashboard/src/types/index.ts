// src/types/index.ts
// Purpose: Central place for all TypeScript types and interfaces.
// Notes:
// - Keeps the project strongly typed
// - Ensures components communicate correctly
// - Easy to maintain and extend

// --- Task core types ---

// Allowed status values for a task
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// Allowed priority values for a task
export type TaskPriority = 'low' | 'medium' | 'high';

// Main Task data structure
export interface Task {
  id: string;           // unique identifier
  title: string;        // required task title
  description?: string; // optional description
  status: TaskStatus;   // current status
  priority: TaskPriority; // priority level
  createdAt: string;    // ISO date string
  dueDate?: string;     // optional due date
  updatedAt?: string;   // last update timestamp
}

// --- Form types ---

// Data collected from the TaskForm component
export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

// Props for the TaskForm component
export interface TaskFormProps {
  initialValues?: Partial<TaskFormData>;   // optional initial values for editing
  onSubmit: (data: TaskFormData) => void;  // callback when form is submitted
  onCancel?: () => void;                   // optional cancel handler
  theme: Theme;                            // light/dark theme
}

// --- Filtering and sorting types ---

// Keys that can be used for sorting
export type SortKey = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status';

// Sort order direction
export type SortOrder = 'asc' | 'desc';

// Sort options object
export interface SortOptions {
  key: SortKey;
  order: SortOrder;
}

// Filter options object
export interface FilterOptions {
  status?: TaskStatus | 'all';   // filter by status or 'all'
  priority?: TaskPriority | 'all'; // filter by priority or 'all'
  search?: string;               // search query
}

// Props for the TaskFilter component
export interface TaskFilterProps {
  filters: FilterOptions;
  onChange: (next: FilterOptions) => void;
  theme: Theme;
}

// --- Theme type ---

// Theme values for light/dark mode
export type Theme = 'light' | 'dark';

// --- Component props ---

// Props for the TaskList component
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

// Props for the TaskItem component
export interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  theme: Theme;              // theme passed down for styling
  draggableId?: string;      // optional drag-and-drop id
  index?: number;            // optional index for ordering
}

// --- Dashboard stats ---

// Statistics displayed in the Dashboard header
export interface DashboardStats {
  total: number;      // total tasks
  todo: number;       // tasks with status 'todo'
  inProgress: number; // tasks with status 'in-progress'
  done: number;       // tasks with status 'done'
  overdue: number;    // tasks past due date and not done
}

