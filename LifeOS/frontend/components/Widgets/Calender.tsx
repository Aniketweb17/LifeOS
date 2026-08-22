"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";

const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
}

interface CalendarWidgetProps {
  events: Event[];
  reminders: Reminder[];
}

interface DayCell {
  day: number;
  dateStr: string;
  isToday: boolean;
  hasEvent: boolean;
  hasReminder: boolean;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function CalendarWidget({
  events,
  reminders,
}: CalendarWidgetProps) {
  const today = useMemo(() => new Date(), []);

  const year = today.getFullYear();
  const month = today.getMonth();

  const todayStr = toDateStr(year, month, today.getDate());

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const monthLabel = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  /*
   * Dates containing events
   */
  const eventDates = useMemo(() => {
    return new Set(events.map((event) => event.date));
  }, [events]);

  /*
   * Dates containing reminders
   */
  const reminderDates = useMemo(() => {
    return new Set(reminders.map((reminder) => reminder.date));
  }, [reminders]);

  /*
   * Create calendar cells
   */
  const cells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // JavaScript:
    // Sunday = 0
    // Monday = 1
    //
    // We want Monday = 0
    const firstWeekday =
      (new Date(year, month, 1).getDay() + 6) % 7;

    const leading: (null)[] = Array.from(
      { length: firstWeekday },
      () => null
    );

    const days: DayCell[] = Array.from(
      { length: daysInMonth },
      (_, index) => {
        const day = index + 1;

        const dateStr = toDateStr(
          year,
          month,
          day
        );

        return {
          day,
          dateStr,
          isToday: dateStr === todayStr,
          hasEvent: eventDates.has(dateStr),
          hasReminder: reminderDates.has(dateStr),
        };
      }
    );

    return [...leading, ...days];
  }, [
    year,
    month,
    todayStr,
    eventDates,
    reminderDates,
  ]);

  /*
   * Events for selected date
   */
  const selectedEvents = useMemo(() => {
    return events
      .filter((event) => event.date === selectedDate)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
  }, [events, selectedDate]);

  /*
   * Reminders for selected date
   */
  const selectedReminders = useMemo(() => {
    return reminders
      .filter(
        (reminder) => reminder.date === selectedDate
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );
  }, [reminders, selectedDate]);

  /*
   * Selected date label
   */
  const selectedLabel = useMemo(() => {
    const date = new Date(
      `${selectedDate}T00:00`
    );

    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  const hasSelectedItems =
    selectedEvents.length > 0 ||
    selectedReminders.length > 0;

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-text">
          <CalendarDays
            size={14}
            className="text-muted"
          />

          {monthLabel}
        </h3>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-surface-alt p-3">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekdays */}
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="pb-1 text-center text-[10px] uppercase tracking-wide text-faint"
            >
              {label}
            </div>
          ))}

          {/* Calendar days */}
          {cells.map((cell, index) => {
            /*
             * Empty cells before the first day
             */
            if (!cell) {
              return (
                <div
                  key={`blank-${index}`}
                />
              );
            }

            const isSelected =
              cell.dateStr === selectedDate;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() =>
                  setSelectedDate(cell.dateStr)
                }
                aria-label={`Select ${cell.dateStr}`}
                aria-pressed={isSelected}
                className={[
                  "relative flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-lg text-xs transition-colors",

                  isSelected
                    ? "bg-primary text-white"
                    : cell.isToday
                    ? "border border-primary text-text"
                    : "text-muted hover:bg-surface hover:text-text",
                ].join(" ")}
              >
                {/* Date number */}
                <span>{cell.day}</span>

                {/* Event / reminder dots */}
                {(cell.hasEvent ||
                  cell.hasReminder) && (
                  <span className="flex items-center gap-0.5">
                    {/* Event dot */}
                    {cell.hasEvent && (
                      <span
                        className={[
                          "h-1 w-1 rounded-full",

                          isSelected
                            ? "bg-white"
                            : "bg-primary",
                        ].join(" ")}
                      />
                    )}

                    {/* Reminder dot */}
                    {cell.hasReminder && (
                      <span
                        className={[
                          "h-1 w-1 rounded-full",

                          isSelected
                            ? "bg-white"
                            : "bg-amber-400",
                        ].join(" ")}
                      />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day details */}
      <div className="rounded-xl border border-border bg-surface-alt p-3">
        <p className="mb-2 text-xs font-medium text-text">
          {selectedLabel}
        </p>

        {/* Nothing selected */}
        {!hasSelectedItems && (
          <p className="py-2 text-center text-xs text-faint">
            No events or reminders for this day.
          </p>
        )}

        {/* Events */}
        {selectedEvents.length > 0 && (
          <div className="mb-2 flex flex-col gap-1.5">
            <p className="text-[10px] uppercase tracking-wide text-faint">
              Events
            </p>

            <ul className="flex flex-col gap-1.5">
              {selectedEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg bg-surface px-2 py-1.5"
                >
                  <p className="truncate text-xs font-medium text-text">
                    {event.title}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                    <Clock size={10} />

                    <span>
                      {formatTimeLabel(
                        event.startTime
                      )}

                      {event.endTime
                        ? ` – ${formatTimeLabel(
                            event.endTime
                          )}`
                        : ""}
                    </span>
                  </div>

                  {event.location && (
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-faint">
                      <MapPin size={10} />

                      <span className="truncate">
                        {event.location}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reminders */}
        {selectedReminders.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] uppercase tracking-wide text-faint">
              Reminders
            </p>

            <ul className="flex flex-col gap-1.5">
              {selectedReminders.map(
                (reminder) => (
                  <li
                    key={reminder.id}
                    className={[
                      "rounded-lg bg-surface px-2 py-1.5",

                      reminder.completed
                        ? "opacity-50"
                        : "",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "truncate text-xs font-medium text-text",

                        reminder.completed
                          ? "line-through"
                          : "",
                      ].join(" ")}
                    >
                      {reminder.title}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                      <Clock size={10} />

                      <span>
                        {formatTimeLabel(
                          reminder.time
                        )}
                      </span>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}