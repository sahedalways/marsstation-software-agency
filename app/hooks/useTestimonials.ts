'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types/testimonial';

export function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supaError } = await supabase
                    .from('testimonials')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (supaError) {
                    throw supaError;
                }

                if (data && data.length > 0) {
                    setTestimonials(data);
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
