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
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr>
                <td style="
                    padding:22px 24px;
                    border-radius:14px;
                    background: linear-gradient(135deg, rgba(115, 42, 235, 0.12), rgba(184, 0, 46, 0.08));
                    border:1px solid rgba(115, 42, 235, 0.32);
                ">
                    <p style="
                        margin:0 0 16px;
                        color:#c084fc;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:1.5px;
                        text-transform:uppercase;
                    ">
                        📎 Attachments (${processedFiles.length})
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
<body style="margin:0;padding:0;background: linear-gradient(135deg, #0a0a0a 0%, #1a0508 50%, #100520 100%); font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
<tr><td align="center" style="padding:50px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#141414;border-radius:20px;overflow:hidden;border:1px solid rgba(184, 0, 46, 0.4);box-shadow: 0 25px 70px rgba(0,0,0,0.7), 0 0 60px rgba(184, 0, 46, 0.18), 0 0 80px rgba(115, 42, 235, 0.15);">

<!-- TOP ACCENT BAR -->
<tr><td style="height:6px;background: linear-gradient(90deg, #4a0014 0%, #b8002e 25%, #732aeb 50%, #b8002e 75%, #4a0014 100%);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:50px 30px 40px;background: linear-gradient(135deg, #2a0510 0%, #1a0820 50%, #0f0420 100%);border-bottom:2px solid rgba(184, 0, 46, 0.35);">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;"><tr>
        <td style="background:#ffffff;padding:16px 26px;border-radius:14px;box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 30px rgba(184, 0, 46, 0.45), 0 0 40px rgba(115, 42, 235, 0.35);border:2px solid rgba(184, 0, 46, 0.4);">
            <img src="cid:site-logo" alt="${siteName}" height="44" style="display:block;height:44px;width:auto;" />
        </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;"><tr>
        <td style="background: linear-gradient(135deg, ${typeBadgeColor}44, rgba(115, 42, 235, 0.22));border:1px solid ${typeBadgeColor}88;padding:6px 18px;border-radius:30px;">
            <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">● NEW ${typeLabel.toUpperCase()}</span>
        </td>
    </tr></table>

    <h1 style="color:#ffffff;font-size:28px;margin:0 0 12px;font-weight:700;letter-spacing:0.5px;text-shadow: 0 2px 12px rgba(184, 0, 46, 0.4);">
        New ${typeLabel} Received
    </h1>
    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;line-height:1.5;">
        A new ${typeLabel.toLowerCase()} has been submitted from your website
    </p>
    <div style="width:90px;height:3px;background: linear-gradient(90deg, transparent, #b8002e, #732aeb, #b8002e, transparent);margin:22px auto 0;border-radius:2px;"></div>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px 40px 30px;background: linear-gradient(180deg, #141414 0%, #160a14 100%);">

    <table cellpadding="0" cellspacing="0" style="margin-bottom:25px;"><tr>
        <td style="width:4px;background: linear-gradient(180deg, #b8002e, #732aeb);border-radius:2px;">&nbsp;</td>
        <td style="padding-left:12px;">
            <p style="color:#e63956;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">Submission Details</p>
        </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="color:#fff;font-size:15px;background: linear-gradient(135deg, rgba(184, 0, 46, 0.08), rgba(115, 42, 235, 0.06));border-radius:14px;border:1px solid rgba(184, 0, 46, 0.22);padding:8px 20px;">
        ${detailRow('Request Type', `<span style="color:#ff8899; font-weight:700;">${typeLabel}</span>`)}
        ${detailRow('Full Name', fullName || '-')}
        ${detailRow('Email', `<a href="mailto:${email}" style="color:#a875ff; text-decoration:none; font-weight:600;">${email}</a>`)}
        ${detailRow('Phone', `<a href="tel:${phone}" style="color:#ff5577; text-decoration:none; font-weight:600;">${phone}</a>`)}
        ${detailRow('Preferred Contact', contactMethodLabel)}

    </table>

    ${
        description
            ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
        <td style="padding:20px 22px;border-radius:12px;background: rgba(184, 0, 46, 0.08);border:1px solid rgba(184, 0, 46, 0.28);border-left:4px solid #b8002e;">
            <p style="margin:0 0 10px;color:#e63956;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${typeLabel} Description</p>
            <p style="margin:0;color:rgba(255,255,255,0.88);font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(description)}</p>
        </td>
    </tr></table>`
            : ''
    }

    ${attachmentsHtml}

    <!-- INFO BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;"><tr>
        <td style="padding:24px 26px;border-radius:14px;background: linear-gradient(135deg, rgba(184, 0, 46, 0.22), rgba(115, 42, 235, 0.18));border:1px solid rgba(184, 0, 46, 0.4);border-left:5px solid #b8002e;box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);">
            <p style="margin:0 0 8px;color:#ff8899;font-size:14px;font-weight:700;letter-spacing:0.5px;">📩 Action Required</p>
            <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;">
                Please review this ${typeLabel.toLowerCase()} and respond within 3 working days via the customer's preferred contact method (${contactMethodLabel}).
            </p>
        </td>
    </tr></table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>
        <td align="center">
            <table cellpadding="0" cellspacing="0"><tr>
                <td style="border-radius:12px;background: linear-gradient(135deg, #b8002e 0%, #732aeb 100%);box-shadow: 0 8px 25px rgba(184, 0, 46, 0.45), 0 8px 25px rgba(115, 42, 235, 0.35), inset 0 1px 0 rgba(255,255,255,0.2);">
                    <a href="mailto:${email}?subject=Re: Your ${typeLabel}${orderNumber ? ` (#${orderNumber})` : ''}" style="display:inline-block;padding:15px 42px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;">
                        ✉ Reply to ${fullName || 'Customer'}
                    </a>
                </td>
            </tr></table>
        </td>
    </tr></table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:32px 25px;background: linear-gradient(180deg, #0a0204 0%, #0f0418 100%);border-top:2px solid rgba(184, 0, 46, 0.3);">
    <div style="width:50px;height:2px;background: linear-gradient(90deg, transparent, #b8002e, #732aeb, transparent);margin:0 auto 18px;"></div>
    <p style="margin:0 0 8px;color:#ffffff;font-size:16px;font-weight:700;letter-spacing:1px;">${siteName}</p>
    <p style="margin:0 0 14px;color:#888;font-size:12px;line-height:1.6;">
        © ${new Date().getFullYear()} <span style="color:#b8002e;font-weight:600;">${siteName}</span>. All rights reserved.
    </p>
    <p style="margin:0;color:#555;font-size:11px;font-style:italic;">This is an automated message from your website contact form.</p>
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
            <td style="padding:18px 0; ${isLast ? '' : 'border-bottom:1px solid rgba(184, 0, 46, 0.15);'}">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="color:#a8546b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:140px;vertical-align:middle;">
                        ${label}
                    </td>
                    <td style="color:#fff;font-weight:600;font-size:14px;">
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
            background: rgba(0,0,0,0.35);
            border:1px solid rgba(115, 42, 235, 0.3);
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
                <td style="padding:10px 12px;">
                    <div style="color:#fff;font-size:12px;font-weight:600;word-break:break-all;line-height:1.4;">
                        ${escapeHtml(img.file.name)}
                    </div>
                    <div style="color:rgba(255,255,255,0.5);font-size:10px;margin-top:3px;">
                        🖼 Image • ${img.sizeStr}
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
                            background:rgba(255,255,255,0.04);
                            border:1px solid ${meta.color}55;
                            border-left:3px solid ${meta.color};
                            border-radius:10px;
                        ">
                            <tr>
                                <td style="padding:12px 14px;width:44px;vertical-align:middle;">
                                    <div style="
                                        width:36px;height:36px;border-radius:8px;
                                        background:${meta.color}22;
                                        border:1px solid ${meta.color}66;
                                        color:${meta.color};
                                        font-size:18px;text-align:center;line-height:36px;
                                    ">${meta.icon}</div>
                                </td>
                                <td style="padding:12px 14px 12px 0;vertical-align:middle;">
                                    <div style="color:#fff;font-size:13px;font-weight:600;word-break:break-all;line-height:1.4;">
                                        ${escapeHtml(f.file.name)}
                                    </div>
                                    <div style="color:rgba(255,255,255,0.55);font-size:11px;margin-top:3px;">
                                        <span style="
                                            display:inline-block;
                                            background:${meta.color}22;
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
