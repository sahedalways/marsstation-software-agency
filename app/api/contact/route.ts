// app/api/contact/route.ts
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
        const orderNumber = (formData.get('orderNumber') as string) || '';
        const description = (formData.get('description') as string) || '';
        const requestType = ((formData.get('requestType') as string) || 'complaint').toLowerCase();
        const contactMethod = (formData.get('contactMethod') as string) || 'mobile';

        const rawAttachments = formData.getAll('attachments') as File[];
        const validFiles = rawAttachments.filter((f): f is File => f instanceof File && f.size > 0);

        const MAX_TOTAL_SIZE = 24 * 1024 * 1024;
        const MAX_FILES = 5;
        const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0);

        if (validFiles.length > MAX_FILES) {
            return NextResponse.json(
                { success: false, message: `Maximum ${MAX_FILES} files allowed` },
                { status: 400 }
            );
        }
        if (totalSize > MAX_TOTAL_SIZE) {
            return NextResponse.json(
                { success: false, message: 'Total file size exceeds 24 MB' },
                { status: 400 }
            );
        }

        const { error: dbError } = await supabase.from('contact_submissions').insert([
            {
                full_name: fullName,
                email: email,
                phone: phone,
                order_number: orderNumber || null,
                description: description,
                request_type: requestType,
                contact_method: contactMethod,
                attachment_count: validFiles.length,
            },
        ]);

        if (dbError) {
            console.error('Supabase DB Insert Error:', dbError);
        }

        const processedFiles = await Promise.all(
            validFiles.map(async (file, idx) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const ext = file.name.split('.').pop()?.toLowerCase() || '';
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
                const cid = isImage ? `attach-img-${idx}@contact` : undefined;

                return {
                    file,
                    buffer,
                    ext,
                    isImage,
                    cid,
                    sizeStr: fmtSize(file.size),
                };
            })
        );

        const mailAttachments = processedFiles.map((p) => ({
            filename: p.file.name,
            content: p.buffer,
            contentType: p.file.type || 'application/octet-stream',
            ...(p.cid ? { cid: p.cid } : {}),
        }));

        const allAttachments = [
            {
                filename: 'logo.png',
                path: './public/images/logo.png',
                cid: 'site-logo',
            },
            ...mailAttachments,
        ];

        const siteName = siteConfig?.name || 'Your Company';
        const typeLabel = requestType === 'query' ? 'Query' : 'Complaint';
        const typeBadgeColor = requestType === 'query' ? '#3b82f6' : '#b8002e';
        const contactMethodLabel = contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1);

        // ─── Build attachments HTML section ───
        const imageFiles = processedFiles.filter((p) => p.isImage);
        const nonImageFiles = processedFiles.filter((p) => !p.isImage);

        const attachmentsHtml =
            processedFiles.length > 0
                ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
                <td style="padding:20px 22px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;">
                    <p style="margin:0 0 14px;color:#475569;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                        Attachments (${processedFiles.length})
                    </p>

                    ${imageFiles.length > 0 ? renderImageGrid(imageFiles) : ''}

                    ${nonImageFiles.length > 0 ? renderFileChips(nonImageFiles) : ''}
                </td>
            </tr>
        </table>
        `
                : '';

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: Number(process.env.MAIL_PORT) === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // ─── Send notification to company ───
        await transporter.sendMail({
            from: `"${siteName}" <${process.env.MAIL_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New ${typeLabel} - ${fullName}${orderNumber ? ` (#${orderNumber})` : ''}`,
            attachments: allAttachments,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><title>New ${typeLabel} Submission</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:5px;background:linear-gradient(90deg, #b8002e, #732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr>
        <td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
            <img src="cid:site-logo" alt="${siteName}" height="40" style="display:block;height:40px;width:auto;" />
        </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;"><tr>
        <td style="background:${typeBadgeColor}12;border:1px solid ${typeBadgeColor}30;padding:5px 16px;border-radius:20px;">
            <span style="color:${typeBadgeColor};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">● NEW ${typeLabel.toUpperCase()}</span>
        </td>
    </tr></table>

    <h1 style="color:#1e293b;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">
        New ${typeLabel} Received
    </h1>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
        A new ${typeLabel.toLowerCase()} has been submitted from your website
    </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
        <td style="width:4px;background:${typeBadgeColor};border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">Submission Details</p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="color:#334155;font-size:15px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:4px 20px;">
        ${detailRow('Request Type', `<span style="color:${typeBadgeColor};font-weight:700;">${typeLabel}</span>`)}
        ${detailRow('Full Name', fullName || '-')}
        ${detailRow('Email', `<a href="mailto:${email}" style="color:#6366f1;text-decoration:none;font-weight:600;">${email}</a>`)}
        ${detailRow('Phone', `<a href="tel:${phone}" style="color:#b8002e;text-decoration:none;font-weight:600;">${phone}</a>`)}
        ${detailRow('Preferred Contact', contactMethodLabel)}
    </table>

    ${
        description
            ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
        <td style="padding:18px 20px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #b8002e;">
            <p style="margin:0 0 8px;color:#b8002e;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${typeLabel} Description</p>
            <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(description)}</p>
        </td>
    </tr></table>`
            : ''
    }

    ${attachmentsHtml}

    <!-- INFO BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
        <td style="padding:20px 22px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;border-left:5px solid #b8002e;">
            <p style="margin:0 0 6px;color:#b8002e;font-size:14px;font-weight:700;">Action Required</p>
            <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">
                Please review this ${typeLabel.toLowerCase()} and respond within 3 working days via the customer's preferred contact method (${contactMethodLabel}).
            </p>
        </td>
    </tr></table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
        <td align="center">
            <table cellpadding="0" cellspacing="0"><tr>
                <td style="border-radius:10px;background:#b8002e;">
                    <a href="mailto:${email}?subject=Re: Your ${typeLabel}${orderNumber ? ` (#${orderNumber})` : ''}" style="display:inline-block;padding:14px 40px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;">
                        Reply to ${fullName || 'Customer'}
                    </a>
                </td>
            </tr></table>
        </td>
    </tr></table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${siteName}</p>
    <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;line-height:1.6;">
        &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
    </p>
    <p style="margin:0;color:#94a3b8;font-size:11px;">This is an automated message from your website contact form.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
            `,
        });

        // ─── Send confirmation to submitter ───
        await transporter.sendMail({
            from: `"${siteName}" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `We've received your ${typeLabel} - ${siteName}`,
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
<head><meta charset="UTF-8" /><title>${typeLabel} Received - ${siteName}</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr><td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:5px;background:linear-gradient(90deg, #b8002e, #732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

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
        Thank you, ${fullName || 'Customer'}!
    </h1>
    <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
        We have received your ${typeLabel.toLowerCase()}
    </p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
        <td style="padding:20px 22px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-left:5px solid #16a34a;">
            <p style="margin:0;color:#166534;font-size:15px;line-height:1.7;font-weight:500;">
                Your ${typeLabel.toLowerCase()} has been submitted successfully. Our team will review it and get back to you within <strong>3 working days</strong>.
            </p>
        </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
        <td style="width:4px;background:${typeBadgeColor};border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">Summary</p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="color:#334155;font-size:15px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:4px 20px;">
        ${detailRow('Request Type', `<span style="color:${typeBadgeColor};font-weight:700;">${typeLabel}</span>`)}
        ${detailRow('Full Name', fullName || '-')}
        ${detailRow('Email', email)}
        ${detailRow('Phone', phone || '-')}
        ${detailRow('Preferred Contact', contactMethodLabel)}
    </table>

    ${
        orderNumber
            ? `<p style="margin:20px 0 0;color:#64748b;font-size:13px;line-height:1.5;">Reference: <strong style="color:#0f172a;">#${escapeHtml(orderNumber)}</strong></p>`
            : ''
    }

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${siteName}</p>
    <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;line-height:1.6;">
        &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
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

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, message: 'Email failed to send' },
            { status: 500 }
        );
    }
}

/* ───────── Helpers ───────── */

function detailRow(label: string, value: string, isLast: boolean = false): string {
    return `
        <tr>
            <td style="padding:14px 0;${isLast ? '' : 'border-bottom:1px solid #e2e8f0;'}">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:140px;vertical-align:middle;">
                        ${label}
                    </td>
                    <td style="color:#0f172a;font-weight:600;font-size:14px;">
                        ${value}
                    </td>
                </tr></table>
            </td>
        </tr>
    `;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function fmtSize(b: number): string {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

/* ───────── Image grid (inline preview) ───────── */
function renderImageGrid(images: { file: File; cid?: string; sizeStr: string }[]): string {
    // Build 2-column grid using tables (email-safe)
    const rows: string[] = [];
    for (let i = 0; i < images.length; i += 2) {
        const left = images[i];
        const right = images[i + 1];
        rows.push(`
            <tr>
                <td width="50%" style="padding:6px;vertical-align:top;">
                    ${imageCell(left)}
                </td>
                <td width="50%" style="padding:6px;vertical-align:top;">
                    ${right ? imageCell(right) : '&nbsp;'}
                </td>
            </tr>
        `);
    }

    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            ${rows.join('')}
        </table>
    `;
}

function imageCell(img: { file: File; cid?: string; sizeStr: string }): string {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border:1px solid #e2e8f0;
            border-radius:10px;
            overflow:hidden;
        ">
            <tr>
                <td style="padding:0;">
                    <img src="cid:${img.cid}" alt="${escapeHtml(img.file.name)}"
                         style="display:block;width:100%;max-width:100%;height:auto;max-height:220px;object-fit:cover;border-radius:10px 10px 0 0;" />
                </td>
            </tr>
            <tr>
                <td style="padding:10px 12px;background:#fafafa;">
                    <div style="color:#0f172a;font-size:12px;font-weight:600;word-break:break-all;line-height:1.4;">
                        ${escapeHtml(img.file.name)}
                    </div>
                    <div style="color:#94a3b8;font-size:10px;margin-top:3px;">
                        Image &bull; ${img.sizeStr}
                    </div>
                </td>
            </tr>
        </table>
    `;
}

/* ───────── Non-image file chips ───────── */
function renderFileChips(files: { file: File; ext: string; sizeStr: string }[]): string {
    const fileTypeMap: Record<string, { color: string; icon: string; label: string }> = {
        pdf: { color: '#ef4444', icon: '📄', label: 'PDF' },
        doc: { color: '#3b82f6', icon: '📝', label: 'DOC' },
        docx: { color: '#3b82f6', icon: '📝', label: 'DOCX' },
        xls: { color: '#22c55e', icon: '📊', label: 'XLS' },
        xlsx: { color: '#22c55e', icon: '📊', label: 'XLSX' },
        mp4: { color: '#ec4899', icon: '🎬', label: 'MP4' },
        mov: { color: '#ec4899', icon: '🎬', label: 'MOV' },
        mp3: { color: '#f59e0b', icon: '🎵', label: 'MP3' },
        zip: { color: '#8b5cf6', icon: '🗜', label: 'ZIP' },
        txt: { color: '#94a3b8', icon: '📃', label: 'TXT' },
    };

    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
            ${files
                .map((f) => {
                    const meta = fileTypeMap[f.ext] || {
                        color: '#94a3b8',
                        icon: '📎',
                        label: f.ext.toUpperCase() || 'FILE',
                    };
                    return `
                <tr>
                    <td style="padding:6px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="
                            background:#ffffff;
                            border:1px solid #e2e8f0;
                            border-left:3px solid ${meta.color};
                            border-radius:10px;
                        ">
                            <tr>
                                <td style="padding:12px 14px;width:44px;vertical-align:middle;">
                                    <div style="
                                        width:36px;height:36px;border-radius:8px;
                                        background:${meta.color}10;
                                        border:1px solid ${meta.color}40;
                                        color:${meta.color};
                                        font-size:18px;text-align:center;line-height:36px;
                                    ">${meta.icon}</div>
                                </td>
                                <td style="padding:12px 14px 12px 0;vertical-align:middle;">
                                    <div style="color:#0f172a;font-size:13px;font-weight:600;word-break:break-all;line-height:1.4;">
                                        ${escapeHtml(f.file.name)}
                                    </div>
                                    <div style="color:#94a3b8;font-size:11px;margin-top:3px;">
                                        <span style="
                                            display:inline-block;
                                            background:${meta.color}15;
                                            color:${meta.color};
                                            padding:1px 6px;
                                            border-radius:4px;
                                            font-weight:700;
                                            font-size:9px;
                                            letter-spacing:0.5px;
                                            margin-right:6px;
                                        ">${meta.label}</span>
                                        ${f.sizeStr}
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
                })
                .join('')}
        </table>
    `;
}
