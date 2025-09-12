import { getCollection } from 'astro:content';

function escapeICal(text: string) {
  return text.replace(/\\/g, "\\").replace(/\n/g, "\\n").replace(/,|;/g, '\\$&');
}

export async function GET() {
  const shows = await getCollection('shows');
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Luke//Shows//EN"];
  for (const s of shows) {
    lines.push("BEGIN:VEVENT",
      `UID:${s.slug}@luke.tivnan.org`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      s.data.date ? `DTSTART;VALUE=DATE:${s.data.date.replace(/-/g,'')}` : "",
      `SUMMARY:${escapeICal(s.data.title)}`,
      s.data.venue || s.data.city ? `LOCATION:${escapeICal([s.data.venue, s.data.city].filter(Boolean).join(", "))}` : "",
      "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  const body = lines.filter(Boolean).join("\r\n");
  return new Response(body, { headers: { "content-type": "text/calendar; charset=utf-8" } });
}