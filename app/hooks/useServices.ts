'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';

export interface ServiceProject {
    name: string;
    type: string;
    img: string;
    link: string;
}

export interface ServiceTab {
    id: number;
    title: string;
    tech: string;
    techColor: string;
    iconColor: string;
    iconKey: string;
    description: string;
    features: string[];
    projects: ServiceProject[];
}

interface ApiProject {
    id: number;
    title: string;
    type: string;
    picture_path: string | null;
    view_link: string | null;
    order_index: number;
}

interface ApiBulletPoint {
    id: number;
    text: string;
    order_index: number;
}

interface ApiService {
    id: number;
    icon: string;
    title: string;
    type: string;
    description: string;
    order_index: number;
    is_active: boolean;
    bullet_points: ApiBulletPoint[];
    projects: ApiProject[];
}

const TYPE_META: Record<string, { tech: string; techColor: string; iconColor: string }> = {
    website: { tech: 'WordPress', techColor: '#3b82f6', iconColor: '#60a5fa' },
    ecommerce: { tech: 'WordPress', techColor: '#3b82f6', iconColor: '#c084fc' },
    ai: { tech: 'AI / ML', techColor: '#f43f5e', iconColor: '#fb7185' },
    saas: { tech: 'Full Stack', techColor: '#22c55e', iconColor: '#4ade80' },
    custom: { tech: 'Full Stack', techColor: '#f97316', iconColor: '#fb923c' },
    android: { tech: 'Android', techColor: '#22c55e', iconColor: '#4ade80' },
    ios: { tech: 'iOS', techColor: '#94a3b8', iconColor: '#cbd5e1' },
    crossplatform: { tech: 'Android + iPhone', techColor: '#3b82f6', iconColor: '#60a5fa' },
    mobile: { tech: 'Android + iPhone', techColor: '#3b82f6', iconColor: '#60a5fa' },
};

function mapApiService(s: ApiService): ServiceTab {
    const meta = TYPE_META[s.type] || TYPE_META.website;
    return {
        id: s.id,
        title: s.title,
        tech: meta.tech,
        techColor: meta.techColor,
        iconColor: meta.iconColor,
        iconKey: s.icon || 'web',
        description: s.description,
        features: (s.bullet_points || [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((bp) => bp.text),
        projects: (s.projects || [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((p) => ({
                name: p.title,
                type: p.type,
                img: p.picture_path || '',
                link: p.view_link || '#',
            })),
    };
}

export function useServices(fallback: ServiceTab[]) {
    const [services, setServices] = useState<ServiceTab[]>(fallback);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/services?per_page=50`);
                const json = await res.json();

                const data = json.data || json.data;
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data
                        .filter((s: ApiService) => s.is_active)
                        .sort((a: ApiService, b: ApiService) => a.order_index - b.order_index)
                        .map(mapApiService);
                    if (mapped.length > 0) {
                        setServices(mapped);
                    }
                }
            } catch (err) {
                console.error('Services fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return { services, loading };
}
