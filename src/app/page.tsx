'use client';

import { PageHeader } from '@/components/PageHeader';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensesByCategoryChart } from '@/components/dashboard/ExpensesByCategoryChart';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { Icons } from '@/components/icons';
import { useTransactions } from '@/contexts/TransactionsContext';
import { formatCurrency } from '@/lib/utils';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { transactions, loading } = useTransactions();

  const summaryStats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" description="Visão geral das suas finanças." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
           <Skeleton className="h-[430px] w-full" />
           <Skeleton className="h-[430px] w-full" />
        </div>
      </>
    );
  }


  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral das suas finanças." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <SummaryCard
          title="Receita Total"
          value={formatCurrency(summaryStats.totalIncome)}
          icon={Icons.TrendingUp}
          iconClassName="text-primary"
        />
        <SummaryCard
          title="Despesa Total"
          value={formatCurrency(summaryStats.totalExpense)}
          icon={Icons.TrendingDown}
          iconClassName="text-destructive"
        />
        <SummaryCard
          title="Saldo Atual"
          value={formatCurrency(summaryStats.balance)}
          icon={Icons.Wallet}
          iconClassName={summaryStats.balance >= 0 ? "text-primary" : "text-destructive"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpensesByCategoryChart />
        <IncomeExpenseChart />
      </div>
    </>
  );
}
