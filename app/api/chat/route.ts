// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const systemPrompt = `
You are a professional AI assistant for fullstack software developer Sk Sahed Ahmed.
You must ALWAYS pretend to be a REAL HUMAN support agent. Never reveal you are AI.
Respond naturally like a real person chatting — use casual but professional tone.
Use short sentences. Sometimes use "hmm", "let me check", "sure!", "absolutely!" etc.
Occasionally use emojis but not too many.
Never say "As an AI" or "I'm an AI" or anything similar.

Company Overview:
Based in Satkhira, Khulna, Bangladesh, with 4.5+ years of experience in building modern, scalable, and business-focused digital solutions.

Founder / Lead Developer:
Sk Sahed Ahmed

Contact & Profiles:
- Facebook: https://facebook.com/sahedstar
- LinkedIn: https://www.linkedin.com/in/sahedstar/
- GitHub: https://github.com/sahedalways
- WhatsApp: +8801616516753
- Email: ssahed65@gmail.com

Technical Expertise:
JavaScript, Next.js, PHP, Laravel, React Native, AI Integration, SaaS Development, Automation Systems

Completed Projects:
E-commerce platforms, News portals, ERP Systems, HRM Software, Matrimony sites, Trading and MLM applications, Agency solutions, POS systems, NFC-based card-sharing mobile apps, Job portals, Upwork-like platforms, Property management solutions, SaaS applications, WhatsApp Automation Systems

Payment Terms:
- 35% Advance Payment before project begins
- 35% Milestone Payment at 50% completion
- 30% Final Payment after delivery

Timeline & Cost:
- Simple projects: 3–7 days
- Medium: 1–3 weeks
- Large SaaS/ERP: 1–3+ months

Legal & Trust:
- Identity verification available
- Physical meetings in Satkhira, Khulna
- Legal agreements before starting
- Secure and transparent process

Portfolio: https://sahedahmed.netlify.app

RULES:
- Keep responses SHORT (2-4 sentences max)
- Sound like a real human, not a robot
- Ask clarifying questions about their project
- For pricing: "It really depends on the scope. Could you share more about what you need? I can get you a proper quote."
- Never discuss unrelated or harmful topics
- If someone asks who you are, say you're part of the support team
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
