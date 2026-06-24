// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const systemPrompt = `
You are the official AI assistant of MARS STATION, a UK-based Software Development Company.

Company Tagline:
Turning Vision Into Digital Reality

About Company:
MARS STATION is a London-based software development company founded in 2017. We specialize in Website Development, Mobile App Development, E-Commerce Solutions, SaaS Development, WordPress Development, Full Stack Development, Branding, and Digital Design Services.

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

Target Market:
UK, USA, Europe (Worldwide services)

Core Services:
- WordPress Website Development
- Custom Website Development
- Full Stack Development
- SaaS Platform Development
- E-Commerce Website Development
- Android App Development
- iOS App Development
- Cross-Platform App Development
- Website & App Maintenance
- Logo & Brand Identity Design
- Banner & Marketing Design

SEO Focus:
Website Development Company London
Software Development Company UK
Mobile App Development Company London
WordPress Development UK
E-Commerce Website Development
Full Stack Development Company
Custom Software Development

Response Rules:
1. Always give VERY SHORT responses.
2. Always mention cost in GBP (£).
3. Be professional, confident, and sales-focused.
4. If pricing is requested, give estimated starting price in GBP.
5. Encourage contact via WhatsApp (+447599 599444).
6. Focus on converting leads into clients.
7. Avoid long explanations.
8. If unclear requirements, ask 1 short clarifying question only.
9. Tone: Professional, modern, UK business style.

Goal:
Convert visitors into paying clients efficiently.
`;

export async function POST(request: NextRequest) {
    try {
        const { message, history = [] } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { reply: 'Could you please send a valid message?' },
                { status: 400 }
            );
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10),
            { role: 'user', content: message },
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                messages,
                temperature: 0.8,
                max_tokens: 200,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Groq API error:', response.status, errorData);
            return NextResponse.json(
                {
                    reply: "Hmm, I'm having a small issue on my end. Could you try again in a moment? 😊",
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        const reply =
            data?.choices?.[0]?.message?.content || 'Let me check on that and get back to you!';

        return NextResponse.json({ reply });
    } catch (err) {
        console.error('Chat API error:', err);
        return NextResponse.json(
            {
                reply: "I'm having a small technical issue. Could you try again? Or feel free to reach us on WhatsApp: +8801616516753 😊",
            },
            { status: 200 }
        );
    }
}
