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
  MapPin,
  Clock,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
}

type EventStatus = "upcoming" | "ongoing" | "past";

interface FormState {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
};

function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

function getEventStatus(event: Event): EventStatus {
  const now = new Date();
  const start = toDateTime(event.date, event.startTime);
  const end = event.endTime ? toDateTime(event.date, event.endTime) : start;

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";

  return "past";
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
    : `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function EventsWidget() {
  const [events, setEvents] = useState<Event[]>([]);
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

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aTime = toDateTime(a.date, a.startTime).getTime();
      const bTime = toDateTime(b.date, b.startTime).getTime();

      return aTime - bTime;
    });
  }, [events]);

  const upcomingAndOngoing = sortedEvents.filter(
    (e) => getEventStatus(e) !== "past"
  );

  const pastEvents = sortedEvents
    .filter((e) => getEventStatus(e) === "past")
    .reverse();

  function openAddForm() {
    setEditingId(null);
    setFormState(EMPTY_FORM);
    setShowDetails(false);
    setFormError(null);
    setIsFormOpen(true);
  }

  function openEditForm(event: Event) {
    setEditingId(event.id);

    setFormState({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
    });

    setShowDetails(
      Boolean(event.endTime || event.location || event.description)
    );

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
    if (!state.startTime) return "Please select a start time.";

    const start = toDateTime(state.date, state.startTime);

    if (Number.isNaN(start.getTime())) {
      return "Please enter a valid date and time.";
    }

    if (state.endTime) {
      const end = toDateTime(state.date, state.endTime);

      if (Number.isNaN(end.getTime())) {
        return "Please enter a valid end time.";
      }

      if (end < start) {
        return "End time cannot be before start time.";
      }
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
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                title: formState.title.trim(),
                description: formState.description.trim(),
                date: formState.date,
                startTime: formState.startTime,
                endTime: formState.endTime,
                location: formState.location.trim(),
              }
            : ev
        )
      );
    } else {
      const newEvent: Event = {
        id: makeId(),
        title: formState.title.trim(),
        description: formState.description.trim(),
        date: formState.date,
        startTime: formState.startTime,
        endTime: formState.endTime,
        location: formState.location.trim(),
      };

      setEvents((prev) => [...prev, newEvent]);
    }

    closeForm();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeForm();
    }
  }

  function requestDelete(id: string) {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  }

  function confirmDelete() {
    if (confirmDeleteId) {
      setEvents((prev) =>
        prev.filter((ev) => ev.id !== confirmDeleteId)
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
          <CalendarDays size={14} className="text-muted" />
          Upcoming Events
        </h3>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openAddForm}
            aria-label="Add event"
            className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-text"
          >
            <Plus size={14} />
            Add event
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
            placeholder="Event title"
            aria-label="Event title"
            autoFocus
            className="w-full border-b border-border bg-transparent pb-1 text-sm text-text outline-none placeholder:text-faint focus:border-primary"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={formState.date}
              onChange={(e) => handleChange("date", e.target.value)}
              aria-label="Event date"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none focus:border-primary"
            />

            <input
              type="time"
              value={formState.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              aria-label="Start time"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none focus:border-primary"
            />
          </div>

          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="self-start text-xs text-faint transition-colors hover:text-text"
            >
              + Add details
            </button>
          )}

          {showDetails && (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formState.endTime}
                  onChange={(e) =>
                    handleChange("endTime", e.target.value)
                  }
                  aria-label="End time"
                  placeholder="End time"
                  className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none focus:border-primary"
                />

                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    handleChange("location", e.target.value)
                  }
                  placeholder="Location"
                  aria-label="Event location"
                  className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-muted outline-none placeholder:text-faint focus:border-primary"
                />
              </div>

              <textarea
                value={formState.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                placeholder="Description"
                aria-label="Event description"
                rows={2}
                className="w-full resize-none border-b border-border bg-transparent pb-1 text-xs text-muted outline-none placeholder:text-faint focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="self-start text-xs text-faint transition-colors hover:text-text"
              >
                Hide details
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
              {editingId ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </form>
      )}

      {!isFormOpen && events.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-xs text-faint">
            No upcoming events
          </p>
        </div>
      )}

      {upcomingAndOngoing.length > 0 && (
        <ul className="flex flex-col gap-2">
          {upcomingAndOngoing.map((event) => {
            const status = getEventStatus(event);
            const isMenuOpen = openMenuId === event.id;
            const isConfirming = confirmDeleteId === event.id;

            return (
              <li
                key={event.id}
                className="relative rounded-xl border border-border bg-surface-alt px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-text">
                    {event.title}
                  </p>

                  <div className="flex shrink-0 items-center gap-1">
                    {status === "ongoing" && (
                      <span className="text-[10px] uppercase tracking-wide text-emerald-400">
                        Ongoing
                      </span>
                    )}

                    <div
                      className="relative"
                      ref={isMenuOpen ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            isMenuOpen ? null : event.id
                          )
                        }
                        aria-label="Event actions"
                        className="rounded p-1 text-faint transition-colors hover:bg-surface hover:text-text"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-6 z-10 w-28 overflow-hidden rounded-lg border border-border bg-surface-alt shadow-lg">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            className="w-full px-3 py-1.5 text-left text-xs text-text transition-colors hover:bg-surface"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              requestDelete(event.id)
                            }
                            className="w-full px-3 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-surface"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />

                  <span>
                    {formatDateLabel(event.date)} ·{" "}
                    {formatTimeLabel(event.startTime)}
                    {event.endTime
                      ? ` – ${formatTimeLabel(event.endTime)}`
                      : ""}
                  </span>
                </div>

                {event.location && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-faint">
                    <MapPin size={12} />

                    <span className="truncate">
                      {event.location}
                    </span>
                  </div>
                )}

                {event.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-faint">
                    {event.description}
                  </p>
                )}

                {isConfirming && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                    <span className="text-xs text-muted">
                      Delete this event?
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

      {pastEvents.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-wide text-faint">
            Past
          </p>

          <ul className="flex flex-col gap-2">
            {pastEvents.map((event) => {
              const isMenuOpen = openMenuId === event.id;
              const isConfirming = confirmDeleteId === event.id;

              return (
                <li
                  key={event.id}
                  className="relative rounded-xl border border-border px-3 py-2 opacity-50 transition-opacity hover:opacity-80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs font-medium text-muted">
                      {event.title}
                    </p>

                    <div
                      className="relative"
                      ref={isMenuOpen ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            isMenuOpen ? null : event.id
                          )
                        }
                        aria-label="Event actions"
                        className="rounded p-1 text-faint transition-colors hover:bg-surface hover:text-text"
                      >
                        <MoreVertical size={13} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-6 z-10 w-28 overflow-hidden rounded-lg border border-border bg-surface-alt shadow-lg">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            className="w-full px-3 py-1.5 text-left text-xs text-text transition-colors hover:bg-surface"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              requestDelete(event.id)
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
                      {formatDateLabel(event.date)} ·{" "}
                      {formatTimeLabel(event.startTime)}
                      {event.endTime
                        ? ` – ${formatTimeLabel(event.endTime)}`
                        : ""}
                    </span>
                  </div>

                  {isConfirming && (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                      <span className="text-xs text-muted">
                        Delete this event?
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