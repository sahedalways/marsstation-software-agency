import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../config/site';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, surname, email, phone } = body;

        const siteName = siteConfig?.name || 'Your Company';

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${siteName}" <no-reply@website.com>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New Contact Request - ${name}`,

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
<head>
<meta charset="UTF-8" />
<title>New Contact Request</title>
</head>

<body style="
    margin:0;
    padding:0;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0508 50%, #100520 100%);
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
<tr>
<td align="center" style="padding:50px 15px;">


<!-- MAIN CARD -->
<table width="620" cellpadding="0" cellspacing="0"
style="
    max-width:620px;
    background:#141414;
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(184, 0, 46, 0.4);
    box-shadow:
        0 25px 70px rgba(0,0,0,0.7),
        0 0 60px rgba(184, 0, 46, 0.18),
        0 0 80px rgba(115, 42, 235, 0.15);
">


<!-- TOP ACCENT BAR (Maroon → Purple) -->
<tr>
<td style="
    height:6px;
    background: linear-gradient(90deg, #4a0014 0%, #b8002e 25%, #732aeb 50%, #b8002e 75%, #4a0014 100%);
    padding:0;
    font-size:0;
    line-height:0;
">&nbsp;</td>
</tr>


<!-- HEADER -->
<tr>
<td align="center" style="
    padding:50px 30px 40px;
    background: linear-gradient(135deg, #2a0510 0%, #1a0820 50%, #0f0420 100%);
    border-bottom:2px solid rgba(184, 0, 46, 0.35);
">

    <!-- LOGO WITH WHITE BG -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
        <tr>
            <td style="
                background:#ffffff;
                padding:16px 26px;
                border-radius:14px;
                box-shadow:
                    0 10px 30px rgba(0,0,0,0.6),
                    0 0 30px rgba(184, 0, 46, 0.45),
                    0 0 40px rgba(115, 42, 235, 0.35);
                border:2px solid rgba(184, 0, 46, 0.4);
            ">
                <img
                    src="cid:site-logo"
                    alt="${siteName}"
                    height="44"
                    style="display:block; height:44px; width:auto;"
                />
            </td>
        </tr>
    </table>

    <!-- BADGE -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
        <tr>
            <td style="
                background: linear-gradient(135deg, rgba(184, 0, 46, 0.28), rgba(115, 42, 235, 0.22));
                border:1px solid rgba(184, 0, 46, 0.5);
                padding:6px 18px;
                border-radius:30px;
            ">
                <span style="
                    color:#ff5577;
                    font-size:11px;
                    font-weight:700;
                    letter-spacing:2px;
                    text-transform:uppercase;
                ">
                    ● New Submission
                </span>
            </td>
        </tr>
    </table>

    <h1 style="
        color:#ffffff;
        font-size:30px;
        margin:0 0 12px;
        font-weight:700;
        letter-spacing:0.5px;
        text-shadow: 0 2px 12px rgba(184, 0, 46, 0.4);
    ">
        New Contact Request
    </h1>

    <p style="
        color:rgba(255,255,255,0.7);
        font-size:14px;
        margin:0;
        line-height:1.5;
    ">
        A new inquiry has been submitted from your website
    </p>

    <!-- DECORATIVE LINE (Maroon → Purple → Maroon) -->
    <div style="
        width:90px;
        height:3px;
        background: linear-gradient(90deg, transparent, #b8002e, #732aeb, #b8002e, transparent);
        margin:22px auto 0;
        border-radius:2px;
    "></div>

</td>
</tr>


<!-- CONTENT -->
<tr>
<td style="
    padding:40px 40px 30px;
    background: linear-gradient(180deg, #141414 0%, #160a14 100%);
">

    <!-- SECTION TITLE -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:25px;">
        <tr>
            <td style="
                width:4px;
                background: linear-gradient(180deg, #b8002e, #732aeb);
                border-radius:2px;
            ">&nbsp;</td>
            <td style="padding-left:12px;">
                <p style="
                    color:#e63956;
                    font-size:12px;
                    font-weight:700;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    margin:0;
                ">
                    Contact Details
                </p>
            </td>
        </tr>
    </table>


    <!-- DETAILS TABLE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="
        color:#fff;
        font-size:15px;
        background: linear-gradient(135deg, rgba(184, 0, 46, 0.08), rgba(115, 42, 235, 0.06));
        border-radius:14px;
        border:1px solid rgba(184, 0, 46, 0.22);
        padding:8px 20px;
    ">

        <tr>
            <td style="
                padding:18px 0;
                border-bottom:1px solid rgba(184, 0, 46, 0.15);
            ">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            color:#a8546b;
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:1.5px;
                            font-weight:600;
                            width:110px;
                            vertical-align:middle;
                        ">
                            Name
                        </td>
                        <td style="
                            color:#fff;
                            font-weight:600;
                            font-size:15px;
                        ">
                            ${name}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="
                padding:18px 0;
                border-bottom:1px solid rgba(184, 0, 46, 0.15);
            ">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            color:#a8546b;
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:1.5px;
                            font-weight:600;
                            width:110px;
                            vertical-align:middle;
                        ">
                            Surname
                        </td>
                        <td style="
                            color:#fff;
                            font-weight:600;
                            font-size:15px;
                        ">
                            ${surname}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="
                padding:18px 0;
                border-bottom:1px solid rgba(184, 0, 46, 0.15);
            ">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            color:#a8546b;
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:1.5px;
                            font-weight:600;
                            width:110px;
                            vertical-align:middle;
                        ">
                            Email
                        </td>
                        <td>
                            <a href="mailto:${email}" style="
                                color:#a875ff;
                                text-decoration:none;
                                font-weight:600;
                                font-size:15px;
                            ">
                                ${email}
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding:18px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            color:#a8546b;
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:1.5px;
                            font-weight:600;
                            width:110px;
                            vertical-align:middle;
                        ">
                            Phone
                        </td>
                        <td>
                            <a href="tel:${phone}" style="
                                color:#ff5577;
                                text-decoration:none;
                                font-weight:600;
                                font-size:15px;
                            ">
                                ${phone}
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

    </table>


    <!-- INFO BOX (Maroon + Purple Blend) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
        <tr>
            <td style="
                padding:24px 26px;
                border-radius:14px;
                background: linear-gradient(135deg, rgba(184, 0, 46, 0.22), rgba(115, 42, 235, 0.18));
                border:1px solid rgba(184, 0, 46, 0.4);
                border-left:5px solid #b8002e;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            ">
                <p style="
                    margin:0 0 8px;
                    color:#ff8899;
                    font-size:14px;
                    font-weight:700;
                    letter-spacing:0.5px;
                ">
                    📩 Action Required
                </p>
                <p style="
                    margin:0;
                    color:rgba(255,255,255,0.8);
                    font-size:13px;
                    line-height:1.6;
                ">
                    Someone has requested information through your website contact form.
                    Please review the details above and respond accordingly.
                </p>
            </td>
        </tr>
    </table>


    <!-- CTA BUTTON (Maroon → Purple Gradient) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="
                            border-radius:12px;
                            background: linear-gradient(135deg, #b8002e 0%, #732aeb 100%);
                            box-shadow:
                                0 8px 25px rgba(184, 0, 46, 0.45),
                                0 8px 25px rgba(115, 42, 235, 0.35),
                                inset 0 1px 0 rgba(255,255,255,0.2);
                        ">
                            <a href="mailto:${email}" style="
                                display:inline-block;
                                padding:15px 42px;
                                color:#ffffff;
                                text-decoration:none;
                                font-weight:700;
                                font-size:14px;
                                letter-spacing:1px;
                                text-transform:uppercase;
                            ">
                                ✉ Reply to ${name}
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>


</td>
</tr>


<!-- FOOTER -->
<tr>
<td align="center" style="
    padding:32px 25px;
    background: linear-gradient(180deg, #0a0204 0%, #0f0418 100%);
    border-top:2px solid rgba(184, 0, 46, 0.3);
">

    <!-- Small decorative element -->
    <div style="
        width:50px;
        height:2px;
        background: linear-gradient(90deg, transparent, #b8002e, #732aeb, transparent);
        margin:0 auto 18px;
    "></div>

    <p style="
        margin:0 0 8px;
        color:#ffffff;
        font-size:16px;
        font-weight:700;
        letter-spacing:1px;
    ">
        ${siteName}
    </p>

    <p style="
        margin:0 0 14px;
        color:#888;
        font-size:12px;
        line-height:1.6;
    ">
        © ${new Date().getFullYear()} <span style="
            background: linear-gradient(135deg, #b8002e, #732aeb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color:#b8002e;
            font-weight:600;
        ">${siteName}</span>. All rights reserved.
    </p>

    <p style="
        margin:0;
        color:#555;
        font-size:11px;
        font-style:italic;
    ">
        This is an automated message from your website contact form.
    </p>

</td>
</tr>


</table>
<!-- END MAIN CARD -->


</td>
</tr>
</table>


</body>
</html>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: 'Email failed',
            },
            {
                status: 500,
            }
        );
    }
}
