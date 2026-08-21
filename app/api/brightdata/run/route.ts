import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  url: z.url(),
});

export async function POST(request: Request) {
  const token = process.env.BRIGHT_DATA_API_TOKEN;
  const collector = process.env.BRIGHT_DATA_COLLECTOR_ID;

  if (!token || !collector) {
    return NextResponse.json(
      {
        ok: false,
        code: "BRIGHT_DATA_NOT_CONFIGURED",
        message: "Set BRIGHT_DATA_API_TOKEN and BRIGHT_DATA_COLLECTOR_ID on the server.",
      },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_INPUT", message: "A valid HTTPS fixture URL is required." },
      { status: 400 },
    );
  }

  const target = new URL("https://api.brightdata.com/dca/trigger_immediate");
  target.searchParams.set("collector", collector);

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: parsed.data.url }),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    });

    const payload: unknown = await response.json().catch(() => ({ message: response.statusText }));
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, code: `BRIGHT_DATA_${response.status}`, detail: payload },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, collector, payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Bright Data request error";
    return NextResponse.json(
      { ok: false, code: "BRIGHT_DATA_UNAVAILABLE", message },
      { status: 502 },
    );
  }
}
