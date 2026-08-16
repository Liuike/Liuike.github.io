interface Env { READING_DB: D1Database; }
const error = (message: string, status = 400) => Response.json({ error: message }, { status });
const valid = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const parseTags = (value: unknown) => [...new Set(Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean) : [])];
const itemFromRow = (row: { id: number; title: string; link: string; tags_json: string; position: number }) => {
  let tags: string[] = [];
  try { const parsed = JSON.parse(row.tags_json); tags = Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : []; } catch { /* Corrupt legacy data is treated as untagged. */ }
  return { ...row, tags };
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.READING_DB.prepare("SELECT id, title, link, tags_json, position FROM to_read_entries ORDER BY position ASC, id ASC").all<{ id: number; title: string; link: string; tags_json: string; position: number }>();
  return Response.json({ items: result.results.map(itemFromRow) }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const link = typeof body?.link === "string" ? body.link.trim() : "";
  const tags = parseTags(body?.tags);
  if (!valid(title) || title.length > 300) return error("A title of 300 characters or fewer is required.");
  if (link.length > 2048) return error("Link must be 2,048 characters or fewer.");
  if (tags.length > 25 || tags.some((tag) => tag.length > 64)) return error("Use at most 25 tags, each 64 characters or fewer.");
  if (link) { try { const url = new URL(link); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { return error("Link must be a valid HTTP or HTTPS URL."); } }
  const last = await env.READING_DB.prepare("SELECT COALESCE(MAX(position), -1) AS position FROM to_read_entries").first<{ position: number }>();
  const result = await env.READING_DB.prepare("INSERT INTO to_read_entries (title, link, tags_json, position) VALUES (?, ?, ?, ?)").bind(title, link, JSON.stringify(tags), (last?.position ?? -1) + 1).run();
  const item = await env.READING_DB.prepare("SELECT id, title, link, tags_json, position FROM to_read_entries WHERE id = ?").bind(result.meta.last_row_id).first<{ id: number; title: string; link: string; tags_json: string; position: number }>();
  return Response.json({ item: item ? itemFromRow(item) : null }, { status: 201 });
};
