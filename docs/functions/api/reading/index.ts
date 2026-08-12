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

function entryFromRow(row: ReadingEntryRow) {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tags_json);
    tags = Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    name: row.name,
    link: row.link,
    tags,
    notes_markdown: row.notes_markdown,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.READING_DB.prepare(
    "SELECT id, name, link, tags_json, notes_markdown, created_at, updated_at FROM reading_entries ORDER BY name COLLATE NOCASE ASC, id ASC",
  ).all<ReadingEntryRow>();

  return Response.json(
    { entries: result.results.map(entryFromRow) },
    { headers: { "Cache-Control": "no-store" } },
  );
};
