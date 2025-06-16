// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter, Roboto_Mono as RobotoMono } from 'next/font/google'; // Mantive suas fontes
import './globals.css';

// Suas configurações de fonte
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Finance Guard',
  description: 'Seu app de finanças',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased font-sans min-h-screen bg-background text-foreground`}
      >
        {children} {/* Renderiza o filho diretamente, sem AppShell */}
      </body>
    </html>
  );
}