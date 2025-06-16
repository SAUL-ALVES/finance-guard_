// src/app/(main)/layout.tsx

import AppShell from '@/components/AppShell';
import { Providers } from '@/components/Providers'; 

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AppShell>
        {children}
      </AppShell>
    </Providers>
  );
}