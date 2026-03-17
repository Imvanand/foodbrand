import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Feedback',
  description: 'Read reviews and feedback from our happy customers. See why everyone loves the authentic taste of Kalsa Foods premium spices.',
  alternates: {
    canonical: '/feedback'
  }
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
