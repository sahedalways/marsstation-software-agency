// app/api/service-request/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../config/site';
import { supabase } from '../../lib/supabase';

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
        const timeline = timelineMatch?.[1] ? `${timelineMatch[1]} weeks` : '—';
        const techStack = techMatch?.[1] ? techMatch[1].split(',').map((t) => t.trim()) : [];

        // Parse service selections from projectReqs
        const serviceLines = projectReqs
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean);

        const siteName = siteConfig?.name || 'Your Company';
        const contactMethodLabel = contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1);

        const { error: dbError } = await supabase.from('service_requests').insert([
            {
                full_name: fullName,
                email,
                phone,
                company,
                contact_method: contactMethod,
                description,

                estimated_min_price: minPrice,
                estimated_max_price: maxPrice,
                estimated_timeline: timeline,

                services: serviceLines,
                tech_stack: techStack,
                additional_notes: notes,
            },
        ]);

        if (dbError) {
            console.error('Supabase Service Request Error:', dbError);
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

        // ─── Send confirmation to submitter ───
        await transporter.sendMail({
            from: `"${siteName}" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `We've received your service request - ${siteName}`,
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
<head><meta charset="UTF-8" /><title>Service Request Received - ${siteName}</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:5px;background:linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr>
        <td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
            <img src="cid:site-logo" alt="${siteName}" height="40" style="display:block;height:40px;width:auto;" />
        </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;"><tr>
        <td style="background:#22c55e12;border:1px solid #22c55e30;padding:5px 16px;border-radius:20px;">
            <span style="color:#16a34a;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">CONFIRMATION</span>
        </td>
    </tr></table>

    <h1 style="color:#1e293b;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">
        Thank you, ${escapeHtml(fullName)}!
    </h1>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
        We have received your service request
    </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
        <td style="padding:20px 22px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-left:5px solid #16a34a;">
            <p style="margin:0;color:#166534;font-size:15px;line-height:1.7;font-weight:500;">
                Your service request has been submitted successfully. Our team will review your project requirements and get back to you within <strong>3 working days</strong>.
            </p>
        </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
        <td style="width:4px;background:#7c3aed;border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">Summary</p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="color:#334155;font-size:15px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:4px 20px;">
        ${buildSummaryRow('Full Name', escapeHtml(fullName))}
        ${buildSummaryRow('Email', escapeHtml(email))}
        ${buildSummaryRow('Phone', escapeHtml(phone))}
        ${buildSummaryRow('Company', escapeHtml(company))}
        ${buildSummaryRow('Preferred Contact', escapeHtml(contactMethodLabel))}
    </table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${escapeHtml(siteName)}</p>
    <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;line-height:1.6;">
        &copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}. All rights reserved.
    </p>
    <p style="margin:0;color:#94a3b8;font-size:11px;">This is an automated confirmation message.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
            `,
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
                return `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <div style="color: #334155; font-size: 13.5px; line-height: 1.6;">
                            ${escapeHtml(line)}
                        </div>
                    </td>
                </tr>`;
            }
            return `
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0"><tr>
                            <td style="
                                color: #64748b;
                                font-size: 11px;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                font-weight: 600;
                                width: 160px;
                                vertical-align: top;
                                padding-top: 2px;
                            ">${escapeHtml(label.trim())}</td>
                            <td style="color: #0f172a; font-size: 13.5px; font-weight: 600; line-height: 1.5;">
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
                background: #eef2ff;
                border: 1px solid #c7d2fe;
                color: #4338ca;
                font-size: 11px;
                font-weight: 600;
                margin: 3px 4px 3px 0;
            ">${escapeHtml(t)}</span>
        `
        )
        .join('');
}

/* ─── Summary row helper for confirmation email ─── */
function buildSummaryRow(label: string, value: string): string {
    return `
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">${label}</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:600;">${value}</td>
                </tr></table>
            </td>
        </tr>
    `;
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
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr>
    <td style="height:5px;background:linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed);padding:0;font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
    <!-- Logo -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
    <tr><td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
        <img src="cid:site-logo" alt="${siteName}" height="40"
             style="display:block;height:40px;width:auto;"/>
    </td></tr></table>

    <!-- Badge -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
    <tr><td style="background:#7c3aed12;border:1px solid #7c3aed30;padding:5px 16px;border-radius:20px;">
        <span style="color:#7c3aed;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
             NEW SERVICE REQUEST
        </span>
    </td></tr></table>

    <h1 style="color:#1e293b;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">
        New Project Request Received
    </h1>
    <p style="color:#64748b;font-size:13.5px;margin:0;line-height:1.5;">
        A potential client has submitted their project requirements
    </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

    <!-- CLIENT INFO -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
        <td style="width:4px;background:#7c3aed;border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">
                Client Information
            </p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Full Name</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(fullName)}</td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Email</td>
                    <td>
                        <a href="mailto:${escapeHtml(email)}" style="color:#6366f1;font-size:14px;font-weight:600;text-decoration:none;">
                            ${escapeHtml(email)}
                        </a>
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Phone</td>
                    <td>
                        <a href="tel:${escapeHtml(phone)}" style="color:#6366f1;font-size:14px;font-weight:600;text-decoration:none;">
                            ${escapeHtml(phone)}
                        </a>
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Company</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(company)}</td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Preferred Contact</td>
                    <td>
                        <span style="display:inline-block;padding:3px 12px;border-radius:20px;background:#eef2ff;border:1px solid #c7d2fe;color:#4338ca;font-size:12px;font-weight:600;">${escapeHtml(contactMethodLabel)}</span>
                    </td>
                </tr></table>
            </td>
        </tr>
    </table>

    <!-- PROJECT REQUIREMENTS -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
        <td style="width:4px;background:#7c3aed;border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">
                Project Requirements
            </p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #7c3aed;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
        ${buildServiceRows(serviceLines)}
    </table>

    <!-- ESTIMATE -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
        <td style="width:4px;background:#d97706;border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">
                Project Estimate
            </p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #d97706;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Estimated Cost</td>
                    <td style="color:#0f172a;font-size:15px;font-weight:700;">
                        &pound;${escapeHtml(minPrice)} &mdash; &pound;${escapeHtml(maxPrice)}
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;">Timeline</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:600;">
                        ~${escapeHtml(timeline)}
                    </td>
                </tr></table>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:150px;vertical-align:top;padding-top:2px;">Tech Stack</td>
                    <td style="color:#0f172a;font-size:13px;font-weight:500;">
                        ${buildTechPills(techStack)}
                    </td>
                </tr></table>
            </td>
        </tr>
    </table>

    ${
        notes && notes !== 'None'
            ? `
    <!-- NOTES -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td style="padding:16px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #6366f1;border-radius:10px;">
        <p style="margin:0 0 6px;color:#475569;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
            Additional Notes
        </p>
        <p style="margin:0;color:#334155;font-size:13.5px;line-height:1.7;white-space:pre-wrap;">
            ${escapeHtml(notes)}
        </p>
    </td></tr></table>`
            : ''
    }

    <!-- ACTION BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td style="padding:20px 22px;background:#f8fafc;border:1px solid #e2e8f0;border-left:5px solid #7c3aed;border-radius:10px;">
        <p style="margin:0 0 6px;color:#7c3aed;font-size:13.5px;font-weight:700;">Action Required</p>
        <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">
            Please review this service request and respond within <strong style="color:#0f172a;">24&ndash;48 hours</strong>
            via <strong style="color:#7c3aed;">${escapeHtml(contactMethodLabel)}</strong>.
        </p>
    </td></tr></table>

    <!-- CTA BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
        <table cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:10px;background:#7c3aed;">
            <a href="mailto:${escapeHtml(email)}?subject=Re: Your Service Request"
               style="display:inline-block;padding:14px 44px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;">
                Reply to ${escapeHtml(fullName)}
            </a>
        </td>
        </tr></table>
    </td></tr></table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;letter-spacing:0.5px;">${escapeHtml(siteName)}</p>
    <p style="margin:0 0 10px;color:#94a3b8;font-size:11.5px;line-height:1.5;">
        &copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}. All rights reserved.
    </p>
    <p style="margin:0;color:#94a3b8;font-size:10.5px;">
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
