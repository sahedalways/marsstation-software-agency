import { NextResponse } from 'next/server';
import { API_BASE } from '../../lib/api';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = (formData.get('name') as string)?.trim() || '';
        const text = (formData.get('text') as string)?.trim() || '';
        const rating = Number(formData.get('rating')) || 5;

        if (!name || name.length < 2) {
            return NextResponse.json(
                { success: false, message: 'Name is required (min 2 chars)' },
                { status: 400 }
            );
        }
        if (!text || text.length < 10) {
            return NextResponse.json(
                { success: false, message: 'Review must be at least 10 characters' },
                { status: 400 }
            );
        }
        if (text.length > 500) {
            return NextResponse.json(
                { success: false, message: 'Review must be under 500 characters' },
                { status: 400 }
            );
        }
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, message: 'Rating must be 1-5' },
                { status: 400 }
            );
        }

        const apiForm = new FormData();
        apiForm.append('name', name);
        apiForm.append('rating', String(rating));
        apiForm.append('description', text);

        const position = (formData.get('position') as string)?.trim() || '';
        const company = (formData.get('company') as string)?.trim() || '';
        if (position) apiForm.append('position', position);
        if (company) apiForm.append('position', [position, company].filter(Boolean).join(', '));

        const photo = formData.get('photo') as File | null;
        if (photo && photo.size > 0) {
            apiForm.append('dp', photo);
        }

        const res = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            body: apiForm,
        });

        const data = await res.json();

        if (!data.success) {
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to submit review' },
                { status: res.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: data.message || 'Review submitted successfully! It will appear after approval.',
        });
    } catch (error) {
        console.error('Testimonial submit error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
