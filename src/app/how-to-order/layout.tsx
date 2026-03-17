import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Order',
  description: 'Learn how to easily order Kalsa Foods Spice Mix Masala. Simple steps, free delivery on orders over 3 packs, and convenient WhatsApp ordering.',
  alternates: {
    canonical: '/how-to-order'
  }
};

export default function HowToOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
