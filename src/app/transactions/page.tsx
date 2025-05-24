'use client';

import { PageHeader } from '@/components/PageHeader';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { AddTransactionSheet } from '@/components/transactions/AddTransactionSheet';

export default function TransactionsPage() {
  return (
    <>
      <PageHeader 
        title="Transações" 
        description="Gerencie suas receitas e despesas."
      >
        <AddTransactionSheet />
      </PageHeader>
      <TransactionsTable />
    </>
  );
}
