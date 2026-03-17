import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Discover the heritage of Kalsa Foods. We bring generations of authentic home cooking and traditional spice blending directly to your kitchen.',
  alternates: {
    canonical: '/our-story'
  }
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
