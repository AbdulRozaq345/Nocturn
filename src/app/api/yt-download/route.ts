export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BACKEND =
  process.env.BACKEND_BASE_URL || "https://panel.nexxacodeid.site";

const isPlaylistUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.searchParams.has("list") || u.pathname.includes("/playlist");
  } catch {
    return false;
  }
};

export async function POST(req: Request) {
  let payload: { url?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: "Body bukan JSON valid" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  if (!payload?.url) {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: "url wajib diisi" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  const target = isPlaylistUrl(payload.url)
    ? "/api/store-playlist"
    : "/api/store";

  const upstream = await fetch(`${BACKEND}${target}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!upstream.body) {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: "Upstream tanpa body", status: upstream.status })}\n\n`,
      {
        status: 502,
        headers: { "Content-Type": "text/event-stream" },
      },
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
