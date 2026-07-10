import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../../config/site';

export async function POST(req: Request) {
    try {
        const { user, agent, messages } = await req.json();
        const siteName = siteConfig?.name || 'Your Company';

        if (!messages?.length) {
            return NextResponse.json({ success: false, message: 'No messages' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: Number(process.env.MAIL_PORT) === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const messageRows = messages
            .map((m: any, i: number) => {
                const isUser = m.sender === 'user';
                const senderName = isUser ? user?.name || 'User' : agent?.name || 'Support';
                const align = isUser ? 'left' : 'right';
                const bg = isUser ? '#eef2ff' : '#f0fdf4';
                const borderColor = isUser ? '#c7d2fe' : '#bbf7d0';
                return `
                <tr>
                    <td style="padding:6px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0"><tr>
                            <td align="${align}">
                                <div style="
                                    display:inline-block;
                                    max-width:80%;
                                    background:${bg};
                                    border:1px solid ${borderColor};
                                    border-radius:12px;
                                    padding:10px 14px;
                                    text-align:left;
                                ">
                                    <div style="color:#4338ca;font-size:11px;font-weight:700;margin-bottom:4px;">${senderName}</div>
                                    <div style="color:#1e293b;font-size:13.5px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(m.text)}</div>
                                    <div style="color:#94a3b8;font-size:10px;margin-top:4px;">${new Date(m.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </td>
                        </tr></table>
                    </td>
                </tr>`;
            })
            .join('');

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.MAIL_USER}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `Chat Transcript - ${user?.name || 'Unknown'}${user?.email ? ` (${user.email})` : ''}`,
            attachments: [
                {
                    filename: 'logo.png',
                    path: './public/images/logo.png',
                    cid: 'site-logo',
                },
            ],
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><title>Chat Transcript</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:5px;background:linear-gradient(90deg,#b8002e,#732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr>
        <td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
            <img src="cid:site-logo" alt="${siteName}" height="40" style="display:block;height:40px;width:auto;" />
        </td>
    </tr></table>
    <h1 style="color:#1e293b;font-size:24px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">Chat Transcript</h1>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
        Conversation with ${escapeHtml(user?.name || 'Unknown')}${user?.email ? ` &lt;${escapeHtml(user.email)}&gt;` : ''}
    </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:24px 28px;background:#ffffff;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
        <td style="padding:14px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;padding-bottom:6px;">User</td></tr>
                <tr><td style="color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(user?.name || '—')}</td></tr>
                <tr><td style="color:#6366f1;font-size:13px;">${escapeHtml(user?.email || '—')}</td></tr>
                <tr><td style="color:#64748b;font-size:12px;padding-top:4px;">Agent: ${escapeHtml(agent?.name || '—')}</td></tr>
                <tr><td style="color:#94a3b8;font-size:11px;padding-top:2px;">${messages.length} messages &bull; ${new Date().toLocaleDateString()}</td></tr>
            </table>
        </td>
    </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
        ${messageRows}
    </table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${escapeHtml(siteName)}</p>
    <p style="margin:0;color:#94a3b8;font-size:11px;">Chat transcript &mdash; automated email</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send transcript error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send' }, { status: 500 });
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
