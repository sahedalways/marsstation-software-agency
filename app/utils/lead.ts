export interface LeadData {
    name: string;
    email: string;
    firstMessage?: string;
}

export const isLead = (messageCount: number): boolean => {
    return messageCount === 0;
};

export const submitLead = async (lead: LeadData) => {
    try {
        const response = await fetch('/api/lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...lead,
                createdAt: new Date().toISOString(),
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Lead submission failed:', error);
        return false;
    }
};
