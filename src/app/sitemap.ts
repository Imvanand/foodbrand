import { MetadataRoute } from 'next';
import { recipes } from '@/data/recipes';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kalsafoods.com';

    // Dynamic recipe URLs
    const recipeEntries = recipes.map((recipe) => ({
        url: `${baseUrl}/recipes/${recipe.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Static URLs
    const staticEntries = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/our-story`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/recipes`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/feedback`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    return [...staticEntries, ...recipeEntries];
}
