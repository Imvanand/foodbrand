import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Kalsa Foods. Have questions about our premium Indian spices or want to discuss a bulk order? Reach out to us anytime.',
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
