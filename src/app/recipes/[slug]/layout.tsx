import { Metadata } from 'next';
import { recipes } from '@/data/recipes';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const recipe = recipes.find(r => r.slug === slug);

    if (!recipe) {
        return {
            title: 'Recipe Not Found',
            description: 'The requested recipe could not be found.',
        };
    }

    return {
        title: `${recipe.title} Recipe`,
        description: recipe.summary || recipe.description,
        alternates: {
            canonical: `/recipes/${slug}`
        },
        openGraph: {
            title: `${recipe.title} Recipe | Kalsa Foods`,
            description: recipe.summary || recipe.description,
            images: [recipe.image],
        }
    };
}

export default function RecipeSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
