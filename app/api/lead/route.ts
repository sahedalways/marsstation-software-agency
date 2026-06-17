import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '../../config/site';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, agent } = body;

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
<head>
<meta charset="UTF-8"/>
</head>

<body style="
margin:0;
padding:0;
background:#0a0a0a;
font-family:Arial,Helvetica,sans-serif;
">


<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:50px 15px;">


<table width="620"
style="
background:#141414;
border-radius:20px;
overflow:hidden;
border:1px solid rgba(184,0,46,.4);
">


<!-- TOP BAR -->
<tr>
<td style="
height:6px;
background:linear-gradient(90deg,#b8002e,#732aeb);
"></td>
</tr>



<!-- HEADER -->
<tr>
<td align="center"
style="
padding:45px 30px;
background:linear-gradient(135deg,#2a0510,#100520);
">


<table>
<tr>
<td style="
background:#fff;
padding:15px 25px;
border-radius:14px;
">

<img
src="cid:site-logo"
height="42"
style="display:block"
/>

</td>
</tr>
</table>



<h1 style="
color:#fff;
font-size:30px;
margin:25px 0 10px;
">
New Chat Lead
</h1>


<p style="
color:#aaa;
font-size:14px;
">
Someone submitted their details through your AI assistant.
</p>


</td>
</tr>




<!-- CONTENT -->
<tr>
<td style="
padding:40px;
background:#141414;
">


<h3 style="
color:#ff5577;
font-size:13px;
letter-spacing:2px;
text-transform:uppercase;
">
Lead Information
</h3>



<table width="100%"
cellpadding="0"
cellspacing="0"
style="
margin-top:20px;
background:rgba(184,0,46,.08);
border:1px solid rgba(184,0,46,.25);
border-radius:14px;
">


<tr>
<td style="
padding:18px;
color:#999;
font-size:12px;
">
NAME
</td>

<td style="
padding:18px;
color:#fff;
font-weight:600;
">
${name}
</td>
</tr>



<tr>
<td style="
padding:18px;
color:#999;
font-size:12px;
">
EMAIL
</td>

<td style="
padding:18px;
">

<a href="mailto:${email}"
style="
color:#a875ff;
text-decoration:none;
font-weight:600;
">
${email}
</a>

</td>
</tr>



<tr>
<td style="
padding:18px;
color:#999;
font-size:12px;
">
TIME
</td>

<td style="
padding:18px;
color:#fff;
">
${new Date().toLocaleString()}
</td>
</tr>


</table>




<table width="100%" style="margin-top:35px;">
<tr>
<td align="center">

<a href="mailto:${email}"
style="
display:inline-block;
padding:15px 40px;
border-radius:12px;
background:linear-gradient(135deg,#b8002e,#732aeb);
color:white;
text-decoration:none;
font-weight:700;
">

Reply to ${name}

</a>

</td>
</tr>
</table>




</td>
</tr>





<!-- FOOTER -->
<tr>
<td align="center"
style="
padding:30px;
background:#0a0204;
color:#777;
font-size:12px;
">

${siteName}<br/>

Automated Chat Lead Notification

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
