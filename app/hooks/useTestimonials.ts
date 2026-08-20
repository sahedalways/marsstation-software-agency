'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { Testimonial } from '../types/testimonial';

interface ApiReview {
    id: number;
    name: string;
    position: string;
    rating: number;
    description: string;
    status: string;
    dp_path: string | null;
    created_at: string;
}

export function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${API_BASE}/reviews?per_page=50`);
                const json = await res.json();

                if (!json.success) {
                    throw new Error(json.message || 'Failed to fetch testimonials');
                }

                const storageBase = API_BASE.replace(/\/api\/?$/, '/storage');

                const mapped: Testimonial[] = (json.data || []).map((r: ApiReview) => ({
                    id: r.id,
                    name: r.name,
                    role: r.position || '',
                    avatar: r.dp_path ? (r.dp_path.startsWith('http') ? r.dp_path : `${storageBase}/${r.dp_path}`) : '',
                    text: r.description,
                    rating: r.rating,
                    is_active: r.status === 'approved',
                    display_order: r.id,
                    created_at: r.created_at,
                }));

                if (mapped.length > 0) {
                    setTestimonials(mapped);
                }
            } catch (err: any) {
                console.error('Testimonials fetch error:', err);
                setError(err.message || 'Failed to fetch testimonials');
            } finally {
                setLoading(false);
            }
        }

        fetchTestimonials();
    }, []);

    return { testimonials, loading, error };
}
