interface Env { READING_DB: D1Database; }
export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const id = Number(params.id); if (!Number.isInteger(id)) return Response.json({ error: "Invalid item." }, { status: 400 });
  await env.READING_DB.prepare("DELETE FROM to_read_entries WHERE id = ?").bind(id).run();
  return new Response(null, { status: 204 });
};
