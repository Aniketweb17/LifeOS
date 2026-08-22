"use client";

import { useState, useMemo, FormEvent, KeyboardEvent } from "react";
import { Plus, MapPin, Clock, CalendarDays } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
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
  const end = toDateTime(event.date, event.endTime);

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

export default function EventsWidget() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aTime = toDateTime(a.date, a.startTime).getTime();
      const bTime = toDateTime(b.date, b.startTime).getTime();

      return aTime - bTime;
    });
  }, [events]);

  const upcomingAndOngoing = sortedEvents.filter(
    (event) => getEventStatus(event) !== "past"
  );

  const pastEvents = sortedEvents
    .filter((event) => getEventStatus(event) === "past")
    .reverse();

  function openForm() {
    setIsFormOpen(true);
    setFormError(null);
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormState(EMPTY_FORM);
    setFormError(null);
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
    if (!state.endTime) return "Please select an end time.";

    const start = toDateTime(state.date, state.startTime);
    const end = toDateTime(state.date, state.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Please enter a valid date and time.";
    }

    if (end < start) {
      return "End time cannot be before start time.";
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

    const newEvent: Event = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `event-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: formState.title.trim(),
      description: formState.description.trim(),
      date: formState.date,
      startTime: formState.startTime,
      endTime: formState.endTime,
      location: formState.location.trim(),
    };

    setEvents((prev) => [...prev, newEvent]);
    closeForm();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeForm();
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="shrink-0 text-muted" />
          <span className="font-display text-sm font-semibold tracking-tight text-text">
            Upcoming Events
          </span>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openForm}
            aria-label="Add event"
            className="flex items-center gap-1 text-xs text-faint transition-colors hover:text-text"
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
          className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3"
        >
          <input
            type="text"
            value={formState.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Event title"
            aria-label="Event title"
            autoFocus
            className="w-full border-b border-border bg-transparent pb-1 text-sm text-text outline-none placeholder:text-faint focus:border-muted"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={formState.date}
              onChange={(e) => handleChange("date", e.target.value)}
              aria-label="Event date"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-text outline-none focus:border-muted"
            />

            <input
              type="time"
              value={formState.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              aria-label="Start time"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-text outline-none focus:border-muted"
            />

            <input
              type="time"
              value={formState.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              aria-label="End time"
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-xs text-text outline-none focus:border-muted"
            />
          </div>

          <input
            type="text"
            value={formState.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Location (optional)"
            aria-label="Event location"
            className="w-full border-b border-border bg-transparent pb-1 text-xs text-text outline-none placeholder:text-faint focus:border-muted"
          />

          <textarea
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description (optional)"
            aria-label="Event description"
            rows={2}
            className="w-full resize-none border-b border-border bg-transparent pb-1 text-xs text-text outline-none placeholder:text-faint focus:border-muted"
          />

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
              className="rounded-lg bg-surface-alt px-3 py-1.5 text-xs text-text transition-colors hover:bg-border"
            >
              Add Event
            </button>
          </div>
        </form>
      )}

      {!isFormOpen && events.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-xs text-faint">No upcoming events</p>

          <button
            type="button"
            onClick={openForm}
            className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-text"
          >
            <Plus size={14} />
            Add event
          </button>
        </div>
      )}

      {upcomingAndOngoing.length > 0 && (
        <ul className="flex flex-col gap-2">
          {upcomingAndOngoing.map((event) => {
            const status = getEventStatus(event);

            return (
              <li
                key={event.id}
                className="rounded-control px-2 py-2 hover:bg-surface-alt"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-text">
                    {event.title}
                  </p>

                  {status === "ongoing" && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-emerald-400">
                      Ongoing
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />

                  <span>
                    {formatDateLabel(event.date)} ·{" "}
                    {formatTimeLabel(event.startTime)} –{" "}
                    {formatTimeLabel(event.endTime)}
                  </span>
                </div>

                {event.location && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-faint">
                    <MapPin size={12} />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                {event.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-faint">
                    {event.description}
                  </p>
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
            {pastEvents.map((event) => (
              <li
                key={event.id}
                className="rounded-control border border-border px-2 py-2 opacity-50"
              >
                <p className="truncate text-xs font-medium text-muted">
                  {event.title}
                </p>

                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-faint">
                  <Clock size={11} />

                  <span>
                    {formatDateLabel(event.date)} ·{" "}
                    {formatTimeLabel(event.startTime)} –{" "}
                    {formatTimeLabel(event.endTime)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}