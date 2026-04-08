// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interactive Wall Calendar',
  description: 'A beautiful, functional wall calendar with date selection and notes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen px-4 py-6 md:px-10 md:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
