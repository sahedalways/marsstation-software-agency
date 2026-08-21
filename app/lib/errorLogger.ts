import { appendFile } from 'fs/promises';
import path from 'path';

export interface ErrorLogEntry {
    source: string;
    message: string;
    stack?: string;
    status?: number;
    extra?: unknown;
}

export async function appendErrorLog(entry: ErrorLogEntry): Promise<void> {
    const lines = [
        '========================================',
        `[${new Date().toISOString()}]`,
        `SOURCE: ${entry.source}`,
        `TYPE: ${entry.status ? 'backend' : 'server'}`,
        `STATUS: ${entry.status ?? 'n/a'}`,
        `MESSAGE: ${entry.message}`,
    ];

    if (entry.stack) lines.push(`STACK: ${entry.stack}`);
    if (entry.extra !== undefined) {
        try {
            lines.push(
                `EXTRA: ${typeof entry.extra === 'string' ? entry.extra : JSON.stringify(entry.extra)}`
            );
        } catch {
            lines.push('EXTRA: [unserializable]');
        }
    }

    lines.push('========================================', '');

    await appendFile(path.join(process.cwd(), 'error.log'), lines.join('\n'), 'utf8');
}
