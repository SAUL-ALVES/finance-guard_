//src/components/Providers.tsx
'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionsProvider } from '@/contexts/TransactionsContext';
import { Toaster } from "@/components/ui/toaster";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TransactionsProvider>
        {children}
        <Toaster />
      </TransactionsProvider>
    </QueryClientProvider>
  );
}
