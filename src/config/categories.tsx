
import { Icons } from '@/components/icons';
import type { ElementType } from 'react';

export const CATEGORY_KEYS = [
  'ALIMENTACAO',
  'TRANSPORTE',
  'LAZER',
  'MORADIA',
  'SAUDE',
  'EDUCACAO',
  'OUTROS',
] as const;


export type CategoryKey = typeof CATEGORY_KEYS[number];


export type Category = {
  label: string;
  icon: ElementType;
  color: string;
};


export const CATEGORIES: Record<CategoryKey, Category> = {
  ALIMENTACAO: {
    label: 'Alimentação',
    icon: Icons.ShoppingCart,
    color: 'hsl(var(--chart-1))',
  },
  TRANSPORTE: {
    label: 'Transporte',
    icon: Icons.Car,
    color: 'hsl(var(--chart-2))',
  },
  LAZER: {
    label: 'Lazer',
    icon: Icons.Gamepad2,
    color: 'hsl(var(--chart-3))',
  },
  MORADIA: {
    label: 'Moradia',
    icon: Icons.Home,
    color: 'hsl(var(--chart-4))',
  },
  SAUDE: {
    label: 'Saúde',
    icon: Icons.HeartPulse,
    color: 'hsl(var(--chart-5))',
  },
  EDUCACAO: {
    label: 'Educação',
    icon: Icons.BookOpenText,
    color: 'hsl(var(--chart-1))',
  },
  OUTROS: {
    label: 'Outros',
    icon: Icons.CircleDollarSign,
    color: 'hsl(var(--muted-foreground))',
  },
};


export const getCategory = (key: CategoryKey): Category => CATEGORIES[key];