"use client";

import { useState } from "react";
import { Circle, CheckCircle2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Complete DSA practice",
    completed: false,
  },
  {
    id: "task-2",
    title: "Work on LifeOS",
    completed: false,
  },
  {
    id: "task-3",
    title: "Review today's notes",
    completed: false,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div className="flex flex-col gap-0.5">
      {tasks.map((task) => (
        <button
          key={task.id}
          type="button"
          onClick={() => toggleTask(task.id)}
          aria-pressed={task.completed}
          aria-label={`Mark ${task.title} as ${
            task.completed ? "incomplete" : "complete"
          }`}
          className="-ml-1 flex items-center gap-2 rounded-control px-1 py-1 text-left transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {task.completed ? (
            <CheckCircle2
              size={14}
              className="shrink-0 text-muted"
            />
          ) : (
            <Circle
              size={14}
              className="shrink-0 text-faint"
            />
          )}

          <span
            className={`text-xs ${
              task.completed
                ? "text-faint line-through"
                : "text-text"
            }`}
          >
            {task.title}
          </span>
        </button>
      ))}
    </div>
  );
}