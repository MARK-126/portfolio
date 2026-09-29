/** Formats an ISO date (yyyy-mm-dd) for display, e.g. "Sep 20, 2026" / "20 sept 2026". */
export function formatDate(iso: string, language = 'en') {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(
    date,
  )
}
