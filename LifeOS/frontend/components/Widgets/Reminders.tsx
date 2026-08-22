"use client";

import {
  useState,
  useMemo,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import {
  Plus,
  Clock,
  MoreVertical,
  Bell,
  Circle,
  CheckCircle2,
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  completed: boolean;
}

interface FormState {
  title: string;
  description: string;
  date: string;
  time: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  date: "",
  time: "",
};

function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00`);
  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `reminder-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function RemindersWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      const aTime = toDateTime(a.date, a.time).getTime();
      const bTime = toDateTime(b.date, b.time).getTime();

      return aTime - bTime;
    });
  }, [reminders]);

  const activeReminders = sortedReminders.filter((r) => !r.completed);

  const completedReminders = sortedReminders
    .filter((r) => r.completed)
    .reverse();

  function openAddForm() {
    setEditingId(null);
    setFormState(EMPTY_FORM);
    setShowDetails(false);
    setFormError(null);
    setIsFormOpen(true);
  }

  function openEditForm(reminder: Reminder) {
    setEditingId(reminder.id);

    setFormState({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
    });

    setShowDetails(Boolean(reminder.description));

    setFormError(null);
    setIsFormOpen(true);
    setOpenMenuId(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setFormState(EMPTY_FORM);
    setFormError(null);
    setShowDetails(false);
  }

  function handleChange(field: keyof FormState, value: string) {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validate(state: FormState): string | null {
    if (!state.title.trim()) return "Please enter a title.";
    if (!state.date) return "Please select a date.";
    if (!state.time) return "Please select a time.";

    const when = toDateTime(state.date, state.time);

    if (Number.isNaN(when.getTime())) {
      return "Please enter a valid date and time.";
    }

    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const error = validate(formState);

    if (error) {
      setFormError(error);
      return;
    }

    if (editingId) {
      setReminders((prev) =>
        prev.map((rem) =>
          rem.id === editingId
            ? {
                ...rem,
                title: formState.title.trim(),
                description: formState.description.trim(),
                date: formState.date,
                time: formState.time,
              }
            : rem
        )
      );
    } else {
      const newReminder: Reminder = {
        id: makeId(),
        title: formState.title.trim(),
        description: formState.description.trim(),
        date: formState.date,
        time: formState.time,
        completed: false,
      };

      setReminders((prev) => [...prev, newReminder]);
    }

    closeForm();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeForm();
    }
  }

  function toggleCompleted(id: string) {
    setReminders((prev) =>
      prev.map((rem) =>
        rem.id === id ? { ...rem, completed: !rem.completed } : rem
      )
    );
  }

  function requestDelete(id: string) {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  }

  function confirmDelete() {
    if (confirmDeleteId) {
      setReminders((prev) =>
        prev.filter((rem) => rem.id !== confirmDeleteId)
      );
    }

    setConfirmDeleteId(null);
  }

  function cancelDelete() {
    setConfirmDeleteId(null);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <Bell size={14} className="font-display text-sm font-semibold tracking-tight text-text" />
          Reminders
        </h3>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openAddForm}
            aria-label="Add reminder"
            className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-text"
          >
            <Plus size={14} />
            Add reminder
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="flex flex-col gap-2 rounded-xl border border-border bg-surface-alt p-3"
        >
          <input
            type="text"
            value={formState.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Reminder title"
            aria-label="Reminder title"
            autoFocus
            className="w-full border-b border-border bg-transparent pb-1 text-sm text-text outline-none placeholder:text-faint focus:border-primary"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={formState.date}
              onChange={(e) => handleChange("date", e.target.value)}
              aria-label="Reminder date"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none focus:border-primary"
            />

            <input
              type="time"
              value={formState.time}
              onChange={(e) => handleChange("time", e.target.value)}
              aria-label="Reminder time"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none focus:border-primary"
            />
          </div>

          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="self-start text-xs text-faint transition-colors hover:text-text"
            >
              + Add notes
            </button>
          )}

          {showDetails && (
            <div className="flex flex-col gap-2 pt-1">
              <textarea
                value={formState.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                placeholder="Notes"
                aria-label="Reminder notes"
                rows={2}
                className="w-full resize-none border-b border-border bg-transparent pb-1 text-xs text-muted outline-none placeholder:text-faint focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="self-start text-xs text-faint transition-colors hover:text-text"
              >
                Hide notes
              </button>
            </div>
          )}

          {formError && (
            <p className="text-xs text-red-400" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg px-3 py-1.5 text-xs text-muted transition-colors hover:text-text"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg border border-border bg-surface-alt px-3 py-1.5 text-xs text-text transition-colors hover:bg-surface"
            >
              {editingId ? "Save Changes" : "Add Reminder"}
            </button>
          </div>
        </form>
      )}

      {!isFormOpen && reminders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-xs text-faint">No reminders</p>
        </div>
      )}

      {activeReminders.length > 0 && (
        <ul className="flex flex-col gap-2">
          {activeReminders.map((reminder) => {
            const isMenuOpen = openMenuId === reminder.id;
            const isConfirming = confirmDeleteId === reminder.id;

            return (
              <li
                key={reminder.id}
                className="relative rounded-xl border border-border bg-surface-alt px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(reminder.id)}
                    aria-label="Mark reminder as completed"
                    className="mt-0.5 shrink-0 text-faint transition-colors hover:text-primary"
                  >
                    <Circle size={16} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium text-text">
                        {reminder.title}
                      </p>

                      <div
                        className="relative shrink-0"
                        ref={isMenuOpen ? menuRef : undefined}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              isMenuOpen ? null : reminder.id
                            )
                          }
                          aria-label="Reminder actions"
                          className="rounded p-1 text-faint transition-colors hover:bg-surface hover:text-text"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-6 z-10 w-28 overflow-hidden rounded-lg border border-border bg-surface-alt shadow-lg">
                            <button
                              type="button"
                              onClick={() => openEditForm(reminder)}
                              className="w-full px-3 py-1.5 text-left text-xs text-text transition-colors hover:bg-surface"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                requestDelete(reminder.id)
                              }
                              className="w-full px-3 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-surface"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />

                      <span>
                        {formatDateLabel(reminder.date)} ·{" "}
                        {formatTimeLabel(reminder.time)}
                      </span>
                    </div>

                    {reminder.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-faint">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>

                {isConfirming && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                    <span className="text-xs text-muted">
                      Delete this reminder?
                    </span>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={cancelDelete}
                        className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-text"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={confirmDelete}
                        className="rounded bg-red-500/90 px-2 py-1 text-xs text-white transition-colors hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {completedReminders.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-wide text-faint">
            Completed
          </p>

          <ul className="flex flex-col gap-2">
            {completedReminders.map((reminder) => {
              const isMenuOpen = openMenuId === reminder.id;
              const isConfirming = confirmDeleteId === reminder.id;

              return (
                <li
                  key={reminder.id}
                  className="relative rounded-xl border border-border px-3 py-2 opacity-50 transition-opacity hover:opacity-80"
                >
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompleted(reminder.id)}
                      aria-label="Mark reminder as not completed"
                      className="mt-0.5 shrink-0 text-primary transition-colors hover:text-muted"
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-xs font-medium text-muted line-through">
                          {reminder.title}
                        </p>

                        <div
                          className="relative shrink-0"
                          ref={isMenuOpen ? menuRef : undefined}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                isMenuOpen ? null : reminder.id
                              )
                            }
                            aria-label="Reminder actions"
                            className="rounded p-1 text-faint transition-colors hover:bg-surface hover:text-text"
                          >
                            <MoreVertical size={13} />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-6 z-10 w-28 overflow-hidden rounded-lg border border-border bg-surface-alt shadow-lg">
                              <button
                                type="button"
                                onClick={() => openEditForm(reminder)}
                                className="w-full px-3 py-1.5 text-left text-xs text-text transition-colors hover:bg-surface"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  requestDelete(reminder.id)
                                }
                                className="w-full px-3 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-surface"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-faint">
                        <Clock size={11} />

                        <span>
                          {formatDateLabel(reminder.date)} ·{" "}
                          {formatTimeLabel(reminder.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isConfirming && (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                      <span className="text-xs text-muted">
                        Delete this reminder?
                      </span>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-text"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={confirmDelete}
                          className="rounded bg-red-500/90 px-2 py-1 text-xs text-white transition-colors hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}