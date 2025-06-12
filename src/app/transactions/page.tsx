'use client';

import { PageHeader } from '@/components/PageHeader';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { AddTransactionSheet } from '@/components/transactions/AddTransactionSheet';

export default function TransactionsPage() {
  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6 max-w-screen-2xl mx-auto">
      <PageHeader 
        title="Transações" 
        description="Gerencie suas receitas e despesas."
      >
        <AddTransactionSheet />
      </PageHeader>
      <TransactionsTable />
    </div>
  );
}