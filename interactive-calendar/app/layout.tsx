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
        <main className="min-h-screen bg-stone-100 p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
