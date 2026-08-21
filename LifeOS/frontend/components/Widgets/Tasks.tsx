// frontend/components/Widgets/Tasks.tsx
"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ListTodo, Circle, CheckCircle2, Plus, X, Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startAdding = () => {
    setIsAdding(true);
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewTaskTitle("");
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, task]);
    setNewTaskTitle("");
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelAdding();
    }
  };

  // Incomplete tasks first, then completed — relative order within each
  // group is preserved because filter keeps the original array order.
  const orderedTasks = [
    ...tasks.filter((task) => !task.completed),
    ...tasks.filter((task) => task.completed),
  ];

  return (
    <div aria-label="Today's Tasks" className="flex flex-col gap-1">
      <button
        type="button"
        className="-ml-1 inline-flex w-fit items-center gap-2 rounded-control px-1 py-0.5 text-left transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ListTodo size={14} className="shrink-0 text-muted" />
        <span className="font-display text-sm font-semibold tracking-tight text-text">
          Today's Tasks
        </span>
      </button>

      <div className="flex flex-col gap-0.5">
        {orderedTasks.length === 0 && !isAdding && (
          <p className="pl-1 text-[11px] text-faint">No tasks yet</p>
        )}

        {orderedTasks.map((task) => (
          <div
            key={task.id}
            className="group -ml-1 flex items-center gap-1 rounded-control px-1 py-1 transition-colors hover:bg-surface-alt"
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              aria-pressed={task.completed}
              aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-control text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {task.completed ? (
                <CheckCircle2 size={14} className="shrink-0 text-muted" />
              ) : (
                <Circle size={14} className="shrink-0 text-faint" />
              )}
              <span
                className={`truncate text-xs ${
                  task.completed ? "text-faint line-through" : "text-text"
                }`}
              >
                {task.title}
              </span>
            </button>

            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              aria-label={`Delete ${task.title}`}
              className="shrink-0 rounded-control p-0.5 text-faint opacity-0 transition-opacity hover:text-text focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {isAdding ? (
          <div className="-ml-1 flex items-center gap-2 rounded-control px-1 py-1">
            <Circle size={14} className="shrink-0 text-faint" />
            <input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Task title"
              aria-label="New task title"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-xs text-text outline-none placeholder:text-faint"
            />
            <button
              type="button"
              onClick={cancelAdding}
              aria-label="Cancel adding task"
              className="flex shrink-0 items-center justify-center rounded-control p-0.5 text-faint transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startAdding}
            className="-ml-1 flex items-center gap-2 rounded-control px-1 py-1 text-left text-faint transition-colors hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus size={14} className="shrink-0" />
            <span className="text-xs">Add task</span>
          </button>
        )}
      </div>
    </div>
  );
}