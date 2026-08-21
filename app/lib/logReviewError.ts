export function logReviewError(payload: {
    source: string;
    message: string;
    stack?: string;
    status?: number;
    extra?: Record<string, unknown>;
}) {
    try {
        fetch('/api/log-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
                ...payload,
                page: typeof window !== 'undefined' ? window.location.href : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                time: new Date().toISOString(),
            }),
        }).catch(() => {});
    } catch {}
}
