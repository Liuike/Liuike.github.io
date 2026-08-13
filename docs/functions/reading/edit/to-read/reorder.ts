interface Env { READING_DB: D1Database; }
export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json().catch(() => null) as { ids?: unknown } | null;
  if (!Array.isArray(body?.ids) || body.ids.some((id) => !Number.isInteger(id))) return Response.json({ error: "Send item IDs in order." }, { status: 400 });
  await env.READING_DB.batch(body.ids.map((id, position) => env.READING_DB.prepare("UPDATE to_read_entries SET position = ? WHERE id = ?").bind(position, id)));
  return new Response(null, { status: 204 });
};
