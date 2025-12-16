import { useEffect, useMemo, useState } from 'react';
import { Task, TaskFormData, FilterOptions, SortOptions, Theme } from '../../types';
import TaskFilter from '../TaskFilter/TaskFilter';
import TaskForm from '../TaskForm/TaskForm';
import TaskList from '../TaskList/TaskList';
import { filterTasks, sortTasks, computeStats } from '../../utils/taskUtils';

const STORAGE_KEY = 'task-dashboard:data';
const THEME_KEY = 'task-dashboard:theme';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  });

  const [filters, setFilters] =
  