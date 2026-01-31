import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIoOS - AI Onchain Operating System',
  description: 'Gemini 3 Hackathon - Delegated Agent Authorization Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
