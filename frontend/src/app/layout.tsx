import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Lenny Growth Assistant',
  description: 'Enterprise-grade RAG web application unlocking Lenny\'s Podcast knowledge.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}