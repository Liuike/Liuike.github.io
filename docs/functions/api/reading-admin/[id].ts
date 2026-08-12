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
}

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function idFromParams(params: Record<string, string | string[]>) {
  const raw = params.id;
  const id = typeof raw === "string" ? Number(raw) : NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
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
  const rawTags = Array.isArray(value.tags) ? value.tags : [];
  const tags = [...new Set(rawTags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean))];
  if (!name || name.length > 300) return jsonError("Name is required and must be 300 characters or fewer.");
  if (link.length > 2048) return jsonError("Link must be 2,048 characters or fewer.");
  try {
    const url = new URL(link);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Unsupported protocol");
  } catch { return jsonError("Link must be a valid HTTP or HTTPS URL."); }
  if (tags.length > 25 || tags.some((tag) => tag.length > 64)) return jsonError("Use at most 25 tags, each 64 characters or fewer.");
  if (notes.length > 100000) return jsonError("Reading notes must be 100,000 characters or fewer.");
  return { name, link, tags, notes_markdown: notes };
}

export const onRequestPut: PagesFunction<Env> = async ({ env, params, request }) => {
  const id = idFromParams(params);
  if (!id) return jsonError("Entry not found.", 404);
  const payload = await payloadFromRequest(request);
  if (payload instanceof Response) return payload;
  const result = await env.READING_DB.prepare(
    "UPDATE reading_entries SET name = ?, link = ?, tags_json = ?, notes_markdown = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ).bind(payload.name, payload.link, JSON.stringify(payload.tags), payload.notes_markdown, id).run();
  if (!result.meta.changes) return jsonError("Entry not found.", 404);
  const entry = await env.READING_DB.prepare(
    "SELECT id, name, link, tags_json, notes_markdown, created_at, updated_at FROM reading_entries WHERE id = ?",
  ).bind(id).first<ReadingEntryRow>();
  return Response.json({ entry: entry ? entryFromRow(entry) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = idFromParams(params);
  if (!id) return jsonError("Entry not found.", 404);
  const result = await env.READING_DB.prepare("DELETE FROM reading_entries WHERE id = ?").bind(id).run();
  if (!result.meta.changes) return jsonError("Entry not found.", 404);
  return new Response(null, { status: 204 });
};
