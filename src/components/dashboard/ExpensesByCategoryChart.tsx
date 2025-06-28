'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTransactions } from '@/contexts/TransactionsContext';
import { CATEGORIES, getCategory } from '@/config/categories';
import type { CategoryKey } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; 

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export function ExpensesByCategoryChart() {
  const { transactions, loading } = useTransactions();

  const chartData = useMemo(() => {
    if (loading) return [];
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const expensesByCategory: Record<CategoryKey, number> = {} as Record<CategoryKey, number>;

    for (const key in CATEGORIES) {
        expensesByCategory[key as CategoryKey] = 0;
    }

    expenseTransactions.forEach(transaction => {
      expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    });
    
    return Object.entries(expensesByCategory)
      .map(([categoryKey, total]) => ({
        name: CATEGORIES[categoryKey as CategoryKey]?.label || categoryKey,
        value: total,
        fill: CATEGORIES[categoryKey as CategoryKey]?.color || '#8884d8',
      }))
      .filter(item => item.value > 0) // Only show categories with expenses
      .sort((a,b) => b.value - a.value); // Sort by value descending

  }, [transactions, loading]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  
  const outerRadius = useMemo(() => {
    if (!isClient) return 120; 
    if (window.innerWidth < 768) { 
      return 90;
    }
    return 120; 
  }, [isClient]);

  if (loading) {
    return (
      <Card className="shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição das suas despesas.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
       <Card className="shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição das suas despesas.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhuma despesa registrada ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Distribuição das suas despesas.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] p-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
 outerRadius={outerRadius}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} className="focus:outline-none ring-0" />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend wrapperStyle={{fontSize: '0.875rem'}} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
