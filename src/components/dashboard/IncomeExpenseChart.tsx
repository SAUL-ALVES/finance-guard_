'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTransactions } from '@/contexts/TransactionsContext';
import { format, subMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const aggregateDataByMonth = (transactions: any[], type: 'income' | 'expense', numMonths: number) => {
  const monthlyData: { [key: string]: number } = {};
  const today = new Date();

  for (let i = 0; i < numMonths; i++) {
    const monthDate = subMonths(today, i);
    const monthKey = format(startOfMonth(monthDate), 'MMM/yy', { locale: ptBR });
    monthlyData[monthKey] = 0;
  }

  transactions
    .filter(t => t.type === type && t.date >= subMonths(startOfMonth(today), numMonths -1))
    .forEach(t => {
      const monthKey = format(startOfMonth(new Date(t.date)), 'MMM/yy', { locale: ptBR });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += t.amount;
      }
    });
  return monthlyData;
};

export function IncomeExpenseChart() {
  const { transactions, loading } = useTransactions();
  const numMonths = 6; // Show data for the last 6 months

  const chartData = useMemo(() => {
    if (loading) return [];
    const monthlyIncome = aggregateDataByMonth(transactions, 'income', numMonths);
    const monthlyExpense = aggregateDataByMonth(transactions, 'expense', numMonths);

    const monthKeys = Object.keys(monthlyIncome).sort((a, b) => {
        const [m1, y1] = a.split('/');
        const [m2, y2] = b.split('/');
        const dateA = new Date(parseInt(`20${y1}`), Object.keys(ptBR.localize!.month).find(key => ptBR.localize!.month[key as any].startsWith(m1)) as any);
        const dateB = new Date(parseInt(`20${y2}`), Object.keys(ptBR.localize!.month).find(key => ptBR.localize!.month[key as any].startsWith(m2)) as any);
        return dateA.getTime() - dateB.getTime();
    });
    
    return monthKeys.map(key => ({
      name: key,
      Receitas: monthlyIncome[key] || 0,
      Despesas: monthlyExpense[key] || 0,
    }));
  }, [transactions, loading]);

  if (loading) {
    return (
      <Card className="shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Receitas vs. Despesas</CardTitle>
          <CardDescription>Comparativo mensal dos últimos {numMonths} meses.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.every(d => d.Receitas === 0 && d.Despesas === 0) && transactions.length > 0) {
     // This case means there are transactions, but not in the last N months for the chart
  } else if (transactions.length === 0) {
     return (
       <Card className="shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Receitas vs. Despesas</CardTitle>
          <CardDescription>Comparativo mensal dos últimos {numMonths} meses.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhuma transação registrada ainda.</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Receitas vs. Despesas</CardTitle>
        <CardDescription>Comparativo mensal dos últimos {numMonths} meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] p-0 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatCurrency(value, 'BRL').replace('R$', '')} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend wrapperStyle={{fontSize: '0.875rem'}} />
            <Bar dataKey="Receitas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
