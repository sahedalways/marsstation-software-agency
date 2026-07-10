import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../../config/site';

const systemPrompt = `
You are the official AI assistant of MARS STATION, a UK-based Software Development Company.

Company Tagline:
Turning Vision Into Digital Reality

About Company:
MARS STATION is a London-based software development company founded in 2017.

Founder & CEO:
Mr. A A M Partho

Location:
13B Vallance Road, London, E1 5HS, United Kingdom

Contact:
Email: support@marsstation.dev
Phone & WhatsApp: +447599 599444
Website: https://marsstation.dev

Business Hours:
Mon–Fri: 11:00 AM – 08:00 PM
Sat: 12:00 AM – 06:00 PM
Sun: Appointment Only

Your task:
Write a professional follow-up email message to the customer based on the chat conversation they just had with our support team.

The message should:
1. Thank them for reaching out to MARS STATION
2. Briefly summarise what they asked about (based on the conversation)
3. Reassure them that our team will follow up if needed
4. Encourage them to reply to this email or contact us on WhatsApp (+447599 599444) for further discussion
5. End with a professional sign-off from "MARS STATION Support Team"

Tone: Professional, warm, UK business style. Keep it concise (max 4 short paragraphs).
Write ONLY the message body - no subject line, no email wrapper.
`;

export async function POST(req: Request) {
    try {
        const { user, agent, messages, conversation } = await req.json();
        const siteName = siteConfig?.name || 'MARS STATION';

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

        // ── Generate AI follow-up message ──
        let aiFollowUp = '';
        try {
            const history = conversation && conversation.length > 0
                ? conversation
                : messages.map((m: any) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text,
                }));

            const groqMessages = [
                { role: 'system', content: systemPrompt },
                ...history.slice(-20),
                { role: 'user', content: 'Based on the above conversation, write a professional follow-up email message to the customer.' },
            ];

            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                    messages: groqMessages,
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            if (groqRes.ok) {
                const data = await groqRes.json();
                aiFollowUp = data?.choices?.[0]?.message?.content?.trim() || '';
            }
        } catch (err) {
            console.error('AI follow-up generation error:', err);
        }

        if (!aiFollowUp) {
            aiFollowUp = `Thank you for reaching out to ${siteName}. Our team has reviewed your conversation and will be in touch shortly if any further information is needed. In the meantime, feel free to contact us on WhatsApp at +447599 599444 or reply to this email.`;
        }

        // ── Company email with transcript ──
        const messageRows = messages
            .map((m: any) => {
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

        // ── User follow-up email with AI-generated message ──
        if (user?.email) {
            await transporter.sendMail({
                from: `"${siteName}" <${process.env.MAIL_USER}>`,
                to: user.email,
                subject: `Thank you for chatting with ${siteName} — ${user.name || ''}`,
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
<head><meta charset="UTF-8"/><title>Thank you for contacting us</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:5px;background:linear-gradient(90deg,#b8002e,#732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 24px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr>
        <td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
            <img src="cid:site-logo" alt="${siteName}" height="40" style="display:block;height:40px;width:auto;" />
        </td>
    </tr></table>
    <h1 style="color:#1e293b;font-size:22px;margin:0 0 6px;font-weight:700;letter-spacing:-0.3px;">Thanks for chatting with us, ${escapeHtml(user?.name || 'there')}!</h1>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
        We appreciate you reaching out to ${escapeHtml(siteName)}.
    </p>
</td>
</tr>

<!-- AI FOLLOW-UP -->
<tr>
<td style="padding:28px 30px;background:#ffffff;">
    <div style="color:#1e293b;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(aiFollowUp)}</div>
</td>
</tr>

<!-- DIVIDER -->
<tr><td style="padding:0 30px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" /></td></tr>

<!-- CONTACT INFO -->
<tr>
<td style="padding:20px 30px 28px;background:#ffffff;">
    <h2 style="color:#1e293b;font-size:15px;margin:0 0 12px;font-weight:700;">Need more help?</h2>
    <table cellpadding="0" cellspacing="0">
        <tr>
            <td style="padding:0 0 6px;">
                <span style="color:#64748b;font-size:13px;">📞 WhatsApp: </span>
                <a href="https://wa.me/447599599444" style="color:#6366f1;font-size:13px;text-decoration:none;font-weight:600;">+447599 599444</a>
            </td>
        </tr>
        <tr>
            <td style="padding:0 0 6px;">
                <span style="color:#64748b;font-size:13px;">📧 Email: </span>
                <a href="mailto:support@marsstation.dev" style="color:#6366f1;font-size:13px;text-decoration:none;font-weight:600;">support@marsstation.dev</a>
            </td>
        </tr>
        <tr>
            <td>
                <span style="color:#64748b;font-size:13px;">🌐 Website: </span>
                <a href="https://marsstation.dev" style="color:#6366f1;font-size:13px;text-decoration:none;font-weight:600;">marsstation.dev</a>
            </td>
        </tr>
    </table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:20px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 4px;color:#1e293b;font-size:14px;font-weight:700;">${escapeHtml(siteName)}</p>
    <p style="margin:0;color:#94a3b8;font-size:11px;">13B Vallance Road, London, E1 5HS, United Kingdom</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
                `,
            });
        }

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
