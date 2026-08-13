interface Env { READING_DB: D1Database; }
const error = (message: string, status = 400) => Response.json({ error: message }, { status });
const valid = (value: unknown) => typeof value === "string" && value.trim().length > 0;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.READING_DB.prepare("SELECT id, title, link, position FROM to_read_entries ORDER BY position ASC, id ASC").all();
  return Response.json({ items: result.results }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const link = typeof body?.link === "string" ? body.link.trim() : "";
  if (!valid(title) || title.length > 300) return error("A title of 300 characters or fewer is required.");
  if (link.length > 2048) return error("Link must be 2,048 characters or fewer.");
  if (link) { try { const url = new URL(link); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { return error("Link must be a valid HTTP or HTTPS URL."); } }
  const last = await env.READING_DB.prepare("SELECT COALESCE(MAX(position), -1) AS position FROM to_read_entries").first<{ position: number }>();
  const result = await env.READING_DB.prepare("INSERT INTO to_read_entries (title, link, position) VALUES (?, ?, ?)").bind(title, link, (last?.position ?? -1) + 1).run();
  const item = await env.READING_DB.prepare("SELECT id, title, link, position FROM to_read_entries WHERE id = ?").bind(result.meta.last_row_id).first();
  return Response.json({ item }, { status: 201 });
};
