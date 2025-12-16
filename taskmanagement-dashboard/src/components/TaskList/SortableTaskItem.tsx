/**
 * SortableTaskItem
 * ----------------
 * Wraps TaskItem with drag-and-drop behavior.
 * Uses task.id as the unique draggable identifier.
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";
import TaskItem from "./TaskItem";
import type { TaskItemProps } from "../../types"; // adjust path if your props live elsewhere

type Props = {
  task: Task;
  // pass through existing handlers without redefining them
  [key: string]: any;
};

export default function SortableTaskItem({ task, ...rest }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle keeps buttons inside TaskItem clickable */}
      <div className="dragHandle" {...attributes} {...listeners}>
        ⋮⋮
      </div>

      <TaskItem task={task} {...rest} />
    </div>
  );
}
