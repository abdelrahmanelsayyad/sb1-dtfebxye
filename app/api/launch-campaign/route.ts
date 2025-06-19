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

    const data = await res.json().catch(() => null);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Error forwarding to n8n webhook:', error);
    return NextResponse.json({ ok: false, error: 'Failed to forward request' }, { status: 500 });
  }
}
