// utils/calendar.ts
export function toGoogleCalendarUrl({
  title,
  start, // Date en hora local del evento
  end,   // Date en hora local del evento
  description,
  location,
  timezone = "America/Mexico_City",
}: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  timezone?: string;
}) {
  // Convierte a YYYYMMDDTHHMMSSZ en UTC
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    ctz: timezone,
  });

  if (description) params.set("details", description);
  if (location) params.set("location", location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
