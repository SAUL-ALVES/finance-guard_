//src/app/(main)/page.tsx
'use client';
import { PageHeader } from '@/components/PageHeader';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensesByCategoryChart } from '@/components/dashboard/ExpensesByCategoryChart';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { Icons } from '@/components/icons';
import { useTransactions } from '@/contexts/TransactionsContext';
import { formatCurrency } from '@/lib/utils';
import { useMemo, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/backend/services/auth.service';

export default function DashboardPage() {
  const { transactions, loading } = useTransactions();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || !(await AuthService.checkAuth(token))) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      await AuthService.logout(token);
    }
    localStorage.removeItem('authToken');
    router.push('/login');
  };

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
        <PageHeader 
          title="Dashboard" 
          description="Visão geral das suas finanças." 
          showLogout
          onLogout={handleLogout}
        />
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
      <PageHeader 
        title="Dashboard" 
        description="Visão geral das suas finanças." 
        showLogout
        onLogout={handleLogout}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <SummaryCard
          title="Receita Total"
          value={formatCurrency(summaryStats.totalIncome)}
          icon={Icons.TrendingUp} // Corrigido para TrendingUp
          iconClassName="text-primary"
        />
        <SummaryCard
          title="Despesa Total"
          value={formatCurrency(summaryStats.totalExpense)}
          icon={Icons.TrendingDown} // Corrigido para TrendingDown
          iconClassName="text-destructive"
        />
        <SummaryCard
          title="Saldo Atual"
          value={formatCurrency(summaryStats.balance)}
          icon={Icons.Wallet} // Corrigido para Wallet
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