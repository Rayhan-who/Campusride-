export function formatTime(time: string | null): string {
  if (!time) return "—";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${period}`;
}

export function formatDate(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
}

export function formatDateFull(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
