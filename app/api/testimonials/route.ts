// app/api/testimonial/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = (formData.get('name') as string)?.trim() || '';
        const position = (formData.get('position') as string)?.trim() || '';
        const company = (formData.get('company') as string)?.trim() || '';
        const text = (formData.get('text') as string)?.trim() || '';
        const rating = Number(formData.get('rating')) || 5;
        const photo = formData.get('photo') as File | null;

        // ── Validation ──
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

        let avatarUrl = '';

        if (photo && photo.size > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(photo.type)) {
                return NextResponse.json(
                    { success: false, message: 'Only JPG, PNG, WebP, GIF allowed' },
                    { status: 400 }
                );
            }
            if (photo.size > 2 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, message: 'Photo must be under 2MB' },
                    { status: 400 }
                );
            }

            const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const buffer = Buffer.from(await photo.arrayBuffer());

            const { error: uploadError } = await supabase.storage
                .from('testimonial-avatars')
                .upload(fileName, buffer, {
                    contentType: photo.type,
                    upsert: false,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return NextResponse.json(
                    { success: false, message: 'Photo upload failed' },
                    { status: 500 }
                );
            }

            const { data: urlData } = supabase.storage
                .from('testimonial-avatars')
                .getPublicUrl(fileName);

            avatarUrl = urlData.publicUrl;
        }

        const role = [position, company].filter(Boolean).join(', ') || '';

        const { data, error: dbError } = await supabase
            .from('testimonials')
            .insert({
                name,
                position,
                company,
                role,
                avatar: avatarUrl || null,
                text,
                rating,
                is_active: false,
                display_order: 999,
            })
            .select();

        if (dbError) {
            console.error('DB error:', dbError);
            return NextResponse.json(
                { success: false, message: 'Failed to save review' },
                { status: 500 }
            );
        }

        console.log('New testimonial submitted. ID:', data?.[0]?.id);

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully! It will appear after approval.',
        });
    } catch (error) {
        console.error('Testimonial submit error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
