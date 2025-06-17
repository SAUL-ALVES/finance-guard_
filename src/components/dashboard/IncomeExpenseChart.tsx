// src/components/dashboard/IncomeExpenseChart.tsx
'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTransactions } from '@/contexts/TransactionsContext';
import { format, subMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export function IncomeExpenseChart() {
  const { transactions, loading } = useTransactions();
  const numMonths = 6;

  
  const chartData = useMemo(() => {
    if (loading) return [];

    
    const dataByMonth: { [key: string]: { Receitas: number; Despesas: number } } = {};

    // 1. Primeiro, agregamos todas as transações que temos
    transactions.forEach(t => {
      const monthKey = format(startOfMonth(new Date(t.date)), 'MMM/yy', { locale: ptBR });
      
      // Inicializa o mês se ainda não existir
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { Receitas: 0, Despesas: 0 };
      }

      // Soma na categoria correta
      if (t.type === 'income') {
        dataByMonth[monthKey].Receitas += t.amount;
      } else {
        dataByMonth[monthKey].Despesas += t.amount;
      }
    });

    // 2. Em seguida, geramos as chaves dos últimos 6 meses NA ORDEM CORRETA
    const monthKeys: string[] = [];
    const today = new Date();
    // Loop de 5 para 0 para ir do mais antigo para o mais recente (ordem cronológica)
    for (let i = numMonths - 1; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthKey = format(startOfMonth(monthDate), 'MMM/yy', { locale: ptBR });
      monthKeys.push(monthKey);
    }
    
    // 3. Por fim, mapeamos as chaves ordenadas para os dados agregados
    return monthKeys.map(key => ({
      name: key,
      Receitas: dataByMonth[key]?.Receitas || 0,
      Despesas: dataByMonth[key]?.Despesas || 0,
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
  
  // Condicional para quando não há transações
  if (transactions.length === 0) {
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