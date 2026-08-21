import { NextResponse } from 'next/server';
import { appendErrorLog } from '../../lib/errorLogger';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await appendErrorLog({
            source: body?.source || 'client-unknown',
            message: String(body?.message || 'Unknown error'),
            stack: body?.stack ? String(body.stack).slice(0, 4000) : undefined,
            status: typeof body?.status === 'number' ? body.status : undefined,
            extra: {
                page: body?.page,
                userAgent: body?.userAgent,
                clientTime: body?.time,
                ...(body?.extra && typeof body.extra === 'object' ? body.extra : {}),
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        try {
            await appendErrorLog({
                source: 'log-error-route',
                message: error instanceof Error ? error.message : 'Failed to write client error log',
                stack: error instanceof Error ? error.stack : undefined,
            });
        } catch {}
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
