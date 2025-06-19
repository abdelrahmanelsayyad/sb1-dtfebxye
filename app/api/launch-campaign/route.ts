import { NextResponse } from 'next/server';

// Ensure this route is always handled dynamically at runtime.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not defined');
      return NextResponse.json({ ok: false, error: 'Webhook URL not configured' }, { status: 500 });
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const message = await res.text().catch(() => 'Unknown error');
      console.error('n8n webhook responded with non-ok status:', res.status, message);
      return NextResponse.json(
        { ok: false, error: `Webhook request failed with status ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json().catch(() => null);

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    console.error('Error forwarding to n8n webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: `Failed to forward request: ${message}` }, { status: 500 });
  }
}
