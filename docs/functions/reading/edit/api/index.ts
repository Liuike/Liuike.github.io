interface Env {
  READING_DB: D1Database;
}

interface ReadingEntryRow {
  id: number;
  name: string;
  link: string;
  tags_json: string;
  notes_markdown: string;
  created_at: string;
  updated_at: string;
}

interface EntryPayload {
  name: string;
  link: string;
  tags: string[];
  notes_markdown: string;
  to_read_id: number | null;
}

const MAX_NAME_LENGTH = 300;
const MAX_LINK_LENGTH = 2048;
const MAX_TAGS = 25;
const MAX_TAG_LENGTH = 64;
const MAX_NOTES_LENGTH = 100000;

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function entryFromRow(row: ReadingEntryRow) {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tags_json);
    tags = Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    tags = [];
  }
  return { id: row.id, name: row.name, link: row.link, tags, notes_markdown: row.notes_markdown, created_at: row.created_at, updated_at: row.updated_at };
}

async function payloadFromRequest(request: Request): Promise<EntryPayload | Response> {
  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("Send a JSON entry payload."); }
  if (!body || typeof body !== "object") return jsonError("Send a JSON entry payload.");
  const value = body as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const link = typeof value.link === "string" ? value.link.trim() : "";
  const notes = typeof value.notes_markdown === "string" ? value.notes_markdown : "";
  const rawToReadId = value.to_read_id;
  const toReadId = typeof rawToReadId === "number" && Number.isInteger(rawToReadId) && rawToReadId > 0 ? rawToReadId : null;
  const rawTags = Array.isArray(value.tags) ? value.tags : [];
  const tags = [...new Set(rawTags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean))];
  if (!name || name.length > MAX_NAME_LENGTH) return jsonError("Name is required and must be 300 characters or fewer.");
  if (link.length > MAX_LINK_LENGTH) return jsonError("Link must be 2,048 characters or fewer.");
  try {
    const url = new URL(link);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Unsupported protocol");
  } catch { return jsonError("Link must be a valid HTTP or HTTPS URL."); }
  if (tags.length > MAX_TAGS || tags.some((tag) => tag.length > MAX_TAG_LENGTH)) return jsonError("Use at most 25 tags, each 64 characters or fewer.");
  if (notes.length > MAX_NOTES_LENGTH) return jsonError("Reading notes must be 100,000 characters or fewer.");
  if (rawToReadId !== undefined && toReadId === null) return jsonError("To-read item must be valid.");
  return { name, link, tags, notes_markdown: notes, to_read_id: toReadId };
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.READING_DB.prepare(
    "SELECT id, name, link, tags_json, notes_markdown, created_at, updated_at FROM reading_entries ORDER BY name COLLATE NOCASE ASC, id ASC",
  ).all<ReadingEntryRow>();
  return Response.json({ entries: result.results.map(entryFromRow) }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const payload = await payloadFromRequest(request);
  if (payload instanceof Response) return payload;
  const statements = [env.READING_DB.prepare(
    "INSERT INTO reading_entries (name, link, tags_json, notes_markdown) VALUES (?, ?, ?, ?)",
  ).bind(payload.name, payload.link, JSON.stringify(payload.tags), payload.notes_markdown)];
  if (payload.to_read_id !== null) statements.push(
    env.READING_DB.prepare("DELETE FROM to_read_entries WHERE id = ?").bind(payload.to_read_id),
  );
  const [result] = await env.READING_DB.batch(statements);
  const entry = await env.READING_DB.prepare(
    "SELECT id, name, link, tags_json, notes_markdown, created_at, updated_at FROM reading_entries WHERE id = ?",
  ).bind(result.meta.last_row_id).first<ReadingEntryRow>();
  return Response.json({ entry: entry ? entryFromRow(entry) : null }, { status: 201 });
};
