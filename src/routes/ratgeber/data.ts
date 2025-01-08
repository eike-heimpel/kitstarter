export interface BlogPost {
    id: number;
    title: string;
    category: string;
    publishedAt: string;
    description: string;
}

export const topPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Ferienimmobilien als Investment: Grundlagen',
        category: 'Investment',
        publishedAt: '2024-01-15',
        description:
            'Lernen Sie die wichtigsten Grundlagen für ein erfolgreiches Investment in Ferienimmobilien kennen.'
    },
    {
        id: 2,
        title: 'Standortanalyse für Ihre Ferienimmobilie',
        category: 'Analyse',
        publishedAt: '2024-01-10',
        description:
            'Wie Sie den perfekten Standort für Ihre Ferienimmobilie finden und worauf Sie achten sollten.'
    },
    {
        id: 3,
        title: 'Erfolgreiche Vermietung Ihrer Ferienwohnung',
        category: 'Vermietung',
        publishedAt: '2024-01-05',
        description:
            'Praktische Tipps und Strategien für eine optimale Auslastung Ihrer Ferienimmobilie.'
    }
];
