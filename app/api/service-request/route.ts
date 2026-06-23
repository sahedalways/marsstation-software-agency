// app/api/service-request/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../config/site';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const fullName = (formData.get('fullName') as string) || '';
        const email = (formData.get('email') as string) || '';
        const phone = (formData.get('phone') as string) || '';
        const company = (formData.get('orderNumber') as string) || 'N/A';
        const contactMethod = (formData.get('contactMethod') as string) || 'email';
        const description = (formData.get('description') as string) || '';

        // ── Parse description sections ──
        const projectReqs = extractSection(description, 'PROJECT REQUIREMENTS', 'ESTIMATE');
        const estimateRaw = extractSection(description, 'ESTIMATE', 'ADDITIONAL NOTES');
        const notes = extractSection(description, 'ADDITIONAL NOTES', null);

        // Parse estimate values
        const priceMatch = estimateRaw.match(/Price:\s*£([\d,]+)\s*-\s*£([\d,]+)/);
        const timelineMatch = estimateRaw.match(/Timeline:\s*~?(\d+)\s*weeks/);
        const techMatch = estimateRaw.match(/Tech Stack:\s*(.+)/);

        const minPrice = priceMatch?.[1] || '—';
        const maxPrice = priceMatch?.[2] || '—';
        const timeline = timelineMatch?.[1] || '—';
        const techStack = techMatch?.[1] ? techMatch[1].split(',').map((t) => t.trim()) : [];

        // Parse service selections from projectReqs
        const serviceLines = projectReqs
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean);

        const siteName = siteConfig?.name || 'Your Company';
        const contactMethodLabel = contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: Number(process.env.MAIL_PORT) === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${siteName}" <${process.env.MAIL_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: ` New Service Request — ${fullName}${company !== 'N/A' ? ` (${company})` : ''}`,
            attachments: [
                {
                    filename: 'logo.png',
                    path: './public/images/logo.png',
                    cid: 'site-logo',
                },
            ],
            html: buildEmailHtml({
                siteName,
                fullName,
                email,
                phone,
                company,
                contactMethodLabel,
                serviceLines,
                minPrice,
                maxPrice,
                timeline,
                techStack,
                notes,
            }),
        });

        return NextResponse.json({ success: true, message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Service request error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send request' },
            { status: 500 }
        );
    }
}

/* ─── Extract section from description string ─── */
function extractSection(text: string, from: string, to: string | null): string {
    const start = text.indexOf(`=== ${from} ===`);
    if (start === -1) return '';
    const contentStart = start + `=== ${from} ===`.length;
    if (!to) return text.slice(contentStart).trim();
    const end = text.indexOf(`=== ${to} ===`);
    if (end === -1) return text.slice(contentStart).trim();
    return text.slice(contentStart, end).trim();
}

/* ─── Escape HTML ─── */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ─── Build service line rows ─── */
function buildServiceRows(lines: string[]): string {
    if (!lines.length) return '';
    return lines
        .map((line) => {
            const [label, ...rest] = line.split(':');
            const value = rest.join(':').trim();
            if (!value) {
                // It's a plain line (e.g. "Services selected: website, mobile")
                return `
                <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid rgba(139,92,246,0.15);">
                        <div style="color: rgba(255,255,255,0.88); font-size: 13.5px; line-height: 1.6;">
                            ${escapeHtml(line)}
                        </div>
                    </td>
                </tr>`;
            }
            return `
                <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid rgba(139,92,246,0.15);">
                        <table width="100%" cellpadding="0" cellspacing="0"><tr>
                            <td style="
                                color: #a78bfa;
                                font-size: 11px;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                font-weight: 600;
                                width: 160px;
                                vertical-align: top;
                                padding-top: 2px;
                            ">${escapeHtml(label.trim())}</td>
                            <td style="color: #fff; font-size: 13.5px; font-weight: 600; line-height: 1.5;">
                                ${escapeHtml(value)}
                            </td>
                        </tr></table>
                    </td>
                </tr>`;
        })
        .join('');
}

/* ─── Build tech stack pills ─── */
function buildTechPills(techStack: string[]): string {
    if (!techStack.length) return '—';
    return techStack
        .map(
            (t) => `
            <span style="
                display: inline-block;
                padding: 4px 12px;
                border-radius: 6px;
                background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.18));
                border: 1px solid rgba(139,92,246,0.4);
                color: #e9d5ff;
                font-size: 11px;
                font-weight: 600;
                margin: 3px 4px 3px 0;
            ">${escapeHtml(t)}</span>
        `
        )
        .join('');
}

/* ─── Main email HTML ─── */
function buildEmailHtml(data: {
    siteName: string;
    fullName: string;
    email: string;
    phone: string;
    company: string;
    contactMethodLabel: string;
    serviceLines: string[];
    minPrice: string;
    maxPrice: string;
    timeline: string;
    techStack: string[];
    notes: string;
}): string {
    const {
        siteName,
        fullName,
        email,
        phone,
        company,
        contactMethodLabel,
        serviceLines,
        minPrice,
        maxPrice,
        timeline,
        techStack,
        notes,
    } = data;

    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><title>New Service Request</title></head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;">
<tr><td align="center" style="padding:50px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="
    max-width:620px;
    background:#0f0a2e;
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(139,92,246,0.4);
    box-shadow:0 25px 70px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.18), 0 0 60px rgba(99,102,241,0.12);
">

<!-- TOP ACCENT BAR -->
<tr>
    <td style="height:5px;background:linear-gradient(90deg,#4f46e5,#7c3aed,#a855f7,#7c3aed,#4f46e5);padding:0;font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- HEADER -->
<tr>
<td align="center" style="
    padding:48px 30px 36px;
    background:linear-gradient(135deg,#1e1050 0%,#0f0a2e 60%,#1a0f3a 100%);
    border-bottom:1px solid rgba(139,92,246,0.25);
">
    <!-- Logo -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
    <tr><td style="
        background:#fff;
        padding:14px 24px;
        border-radius:12px;
        box-shadow:0 8px 28px rgba(0,0,0,0.5),0 0 30px rgba(139,92,246,0.4);
        border:1px solid rgba(139,92,246,0.3);
    ">
        <img src="cid:site-logo" alt="${siteName}" height="40"
             style="display:block;height:40px;width:auto;"/>
    </td></tr></table>

    <!-- Badge -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
    <tr><td style="
        background:linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.2));
        border:1px solid rgba(168,85,247,0.6);
        padding:6px 20px;
        border-radius:30px;
    ">
        <span style="color:#e9d5ff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
             NEW SERVICE REQUEST
        </span>
    </td></tr></table>

    <h1 style="color:#fff;font-size:26px;margin:0 0 10px;font-weight:700;letter-spacing:0.5px;">
        New Project Request Received
    </h1>
    <p style="color:rgba(255,255,255,0.65);font-size:13.5px;margin:0;line-height:1.5;">
        A potential client has submitted their project requirements
    </p>

    <div style="
        width:80px;height:3px;
        background:linear-gradient(90deg,transparent,#8b5cf6,#6366f1,transparent);
        margin:20px auto 0;border-radius:2px;
    "></div>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:36px 36px 28px;background:linear-gradient(180deg,#0f0a2e 0%,#1a0f3a 100%);">

    <!-- CLIENT INFO -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
        <td style="width:4px;background:linear-gradient(180deg,#8b5cf6,#6366f1);border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#a78bfa;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">
                Client Information
            </p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="
        background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.07));
        border:1px solid rgba(139,92,246,0.25);
        border-radius:14px;
        padding:6px 20px;
        margin-bottom:24px;
    ">
        <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(139,92,246,0.15);">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Full Name</td>
                    <td style="color:#fff;font-size:14px;font-weight:600;">${escapeHtml(fullName)}</td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(139,92,246,0.15);">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Email</td>
                    <td>
                        <a href="mailto:${escapeHtml(email)}" style="color:#c4b5fd;font-size:14px;font-weight:600;text-decoration:none;">
                            ${escapeHtml(email)}
                        </a>
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(139,92,246,0.15);">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Phone</td>
                    <td>
                        <a href="tel:${escapeHtml(phone)}" style="color:#c4b5fd;font-size:14px;font-weight:600;text-decoration:none;">
                            ${escapeHtml(phone)}
                        </a>
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(139,92,246,0.15);">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Company</td>
                    <td style="color:#fff;font-size:14px;font-weight:600;">${escapeHtml(company)}</td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:14px 0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Preferred Contact</td>
                    <td>
                        <span style="
                            display:inline-block;
                            padding:3px 12px;
                            border-radius:20px;
                            background:rgba(139,92,246,0.2);
                            border:1px solid rgba(139,92,246,0.4);
                            color:#e9d5ff;
                            font-size:12px;
                            font-weight:600;
                        ">${escapeHtml(contactMethodLabel)}</span>
                    </td>
                </tr></table>
            </td>
        </tr>
    </table>

    <!-- PROJECT REQUIREMENTS -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
        <td style="width:4px;background:linear-gradient(180deg,#a855f7,#8b5cf6);border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#a78bfa;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">
                Project Requirements
            </p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="
        background:rgba(139,92,246,0.08);
        border:1px solid rgba(139,92,246,0.25);
        border-left:4px solid #8b5cf6;
        border-radius:14px;
        padding:6px 20px;
        margin-bottom:24px;
    ">
        ${buildServiceRows(serviceLines)}
    </table>


    ${
        notes && notes !== 'None'
            ? `
    <!-- NOTES -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td style="
        padding:18px 22px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.1);
        border-left:4px solid #6366f1;
        border-radius:12px;
    ">
        <p style="margin:0 0 8px;color:#a78bfa;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
            Additional Notes
        </p>
        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13.5px;line-height:1.7;white-space:pre-wrap;">
            ${escapeHtml(notes)}
        </p>
    </td></tr></table>`
            : ''
    }

    <!-- ACTION BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr><td style="
        padding:22px 24px;
        background:linear-gradient(135deg,rgba(139,92,246,0.22),rgba(99,102,241,0.18));
        border:1px solid rgba(139,92,246,0.45);
        border-left:5px solid #8b5cf6;
        border-radius:14px;
    ">
        <p style="margin:0 0 8px;color:#c4b5fd;font-size:13.5px;font-weight:700;">📬 Action Required</p>
        <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;">
            Please review this service request and respond within <strong style="color:#fff;">24–48 hours</strong>
            via <strong style="color:#e9d5ff;">${escapeHtml(contactMethodLabel)}</strong>.
        </p>
    </td></tr></table>

    <!-- CTA BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
        <table cellpadding="0" cellspacing="0"><tr>
        <td style="
            border-radius:12px;
            background:linear-gradient(135deg,#8b5cf6 0%,#a855f7 50%,#6366f1 100%);
            box-shadow:0 8px 25px rgba(139,92,246,0.5),inset 0 1px 0 rgba(255,255,255,0.2);
        ">
            <a href="mailto:${escapeHtml(email)}?subject=Re: Your Service Request"
               style="display:inline-block;padding:15px 44px;color:#fff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;">
                ✉ Reply to ${escapeHtml(fullName)}
            </a>
        </td>
        </tr></table>
    </td></tr></table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="
    padding:28px 24px;
    background:linear-gradient(180deg,#0a0520 0%,#060310 100%);
    border-top:1px solid rgba(139,92,246,0.2);
">
    <div style="width:50px;height:2px;background:linear-gradient(90deg,transparent,#8b5cf6,#6366f1,transparent);margin:0 auto 16px;"></div>
    <p style="margin:0 0 6px;color:#fff;font-size:15px;font-weight:700;letter-spacing:0.5px;">${escapeHtml(siteName)}</p>
    <p style="margin:0 0 12px;color:#666;font-size:11.5px;line-height:1.5;">
        © ${new Date().getFullYear()} <span style="color:#8b5cf6;font-weight:600;">${escapeHtml(siteName)}</span>. All rights reserved.
    </p>
    <p style="margin:0;color:#444;font-size:10.5px;font-style:italic;">
        This is an automated message from the Service Requirement Modal.
    </p>
</td>
</tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}
