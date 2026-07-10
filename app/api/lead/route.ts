import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../config/site';
import { supabase } from '../../lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, agent } = body;

        const siteName = siteConfig?.name || 'Your Company';

        const { error: dbError } = await supabase.from('chat_leads').insert([
            {
                name: name,
                email: email,
                agent: agent || null,
            },
        ]);

        if (dbError) {
            console.error('Supabase DB Insert Error:', dbError);
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // ─── Send notification to company ───
        await transporter.sendMail({
            from: `"${siteName}" <no-reply@website.com>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,

            subject: `New Chat Lead - ${name}`,

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
<head><meta charset="UTF-8"/><title>New Chat Lead</title></head>

<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr>
<td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr>
<td style="height:5px;background:linear-gradient(90deg,#b8002e,#732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">

<table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
<tr>
<td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
<img src="cid:site-logo" height="40" style="display:block;height:40px;width:auto;" />
</td>
</tr>
</table>

<table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
<td style="background:#b8002e12;border:1px solid #b8002e30;padding:5px 16px;border-radius:20px;">
<span style="color:#b8002e;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">● NEW LEAD</span>
</td>
</tr>
</table>

<h1 style="color:#1e293b;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">
New Chat Lead
</h1>

<p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
Someone submitted their details through your AI assistant.
</p>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

<table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
<tr>
<td style="width:4px;background:#b8002e;border-radius:2px;">&nbsp;</td>
<td style="padding-left:12px;">
<p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">Lead Information</p>
</td>
</tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="color:#334155;font-size:15px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:4px 20px;">

<tr>
<td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:120px;vertical-align:middle;">NAME</td>
<td style="color:#0f172a;font-weight:600;font-size:14px;">${name}</td>
</tr></table>
</td>
</tr>

<tr>
<td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:120px;vertical-align:middle;">EMAIL</td>
<td><a href="mailto:${email}" style="color:#6366f1;text-decoration:none;font-weight:600;font-size:14px;">${email}</a></td>
</tr></table>
</td>
</tr>

<tr>
<td style="padding:14px 0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:120px;vertical-align:middle;">TIME</td>
<td style="color:#0f172a;font-weight:600;font-size:14px;">${new Date().toLocaleString()}</td>
</tr></table>
</td>
</tr>

</table>

<table width="100%" style="margin-top:28px;">
<tr>
<td align="center">
<a href="mailto:${email}" style="display:inline-block;padding:14px 40px;border-radius:10px;background:#b8002e;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;">
Reply to ${name}
</a>
</td>
</tr>
</table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${siteName}</p>
<p style="margin:0;color:#94a3b8;font-size:12px;">Automated Chat Lead Notification</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
            `,
        });

        // ─── Send confirmation to submitter ───
        await transporter.sendMail({
            from: `"${siteName}" <no-reply@website.com>`,
            to: email,
            subject: `We've received your details - ${siteName}`,
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
<head><meta charset="UTF-8"/><title>Details Received - ${siteName}</title></head>

<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;">
<tr>
<td align="center" style="padding:40px 15px;">

<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<!-- TOP ACCENT BAR -->
<tr>
<td style="height:5px;background:linear-gradient(90deg,#b8002e,#732aeb);padding:0;font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- HEADER -->
<tr>
<td align="center" style="padding:40px 30px 32px;background:#ffffff;border-bottom:1px solid #e2e8f0;">

<table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
<tr>
<td style="background:#ffffff;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;">
<img src="cid:site-logo" height="40" style="display:block;height:40px;width:auto;" />
</td>
</tr>
</table>

<table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
<td style="background:#22c55e12;border:1px solid #22c55e30;padding:5px 16px;border-radius:20px;">
<span style="color:#16a34a;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">CONFIRMATION</span>
</td>
</tr>
</table>

<h1 style="color:#1e293b;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:-0.3px;">
Thank you, ${name}!
</h1>

<p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">
We have received your details
</p>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:32px 36px 28px;background:#ffffff;">

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
<td style="padding:20px 22px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-left:5px solid #16a34a;">
    <p style="margin:0;color:#166534;font-size:15px;line-height:1.7;font-weight:500;">
        Your details have been received successfully. Our team will review your information and get back to you within <strong>3 working days</strong>.
    </p>
</td>
</tr></table>

<table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
<tr>
<td style="width:4px;background:#b8002e;border-radius:2px;">&nbsp;</td>
<td style="padding-left:12px;">
<p style="color:#475569;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0;">Summary</p>
</td>
</tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="color:#334155;font-size:15px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:4px 20px;">

<tr>
<td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:120px;vertical-align:middle;">NAME</td>
<td style="color:#0f172a;font-weight:600;font-size:14px;">${name}</td>
</tr></table>
</td>
</tr>

<tr>
<td style="padding:14px 0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:120px;vertical-align:middle;">EMAIL</td>
<td style="color:#0f172a;font-weight:600;font-size:14px;">${email}</td>
</tr></table>
</td>
</tr>

</table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="padding:24px 25px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0 0 6px;color:#1e293b;font-size:15px;font-weight:700;">${siteName}</p>
<p style="margin:0 0 10px;color:#94a3b8;font-size:12px;">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
<p style="margin:0;color:#94a3b8;font-size:11px;">This is an automated confirmation message.</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Lead email sent successfully',
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: 'Lead email failed',
            },
            {
                status: 500,
            }
        );
    }
}
