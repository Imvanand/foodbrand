import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Explore delicious and authentic Indian recipes using Kalsa Foods Spice Mix Masala. Step-by-step guides for mouth-watering dishes.',
  alternates: {
    canonical: '/recipes'
  }
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
