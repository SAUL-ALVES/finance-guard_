import type { Category, CategoryKey } from '@/types';
import { Icons } from '@/components/icons';

export const CATEGORIES: Record<CategoryKey, Category> = {
  ALIMENTACAO: {
    key: 'ALIMENTACAO',
    label: 'Alimentação',
    icon: Icons.ShoppingCart,
    color: 'hsl(var(--chart-1))',
  },
  TRANSPORTE: {
    key: 'TRANSPORTE',
    label: 'Transporte',
    icon: Icons.Car,
    color: 'hsl(var(--chart-2))',
  },
  LAZER: {
    key: 'LAZER',
    label: 'Lazer',
    icon: Icons.Gamepad2,
    color: 'hsl(var(--chart-3))',
  },
  MORADIA: {
    key: 'MORADIA',
    label: 'Moradia',
    icon: Icons.Home,
    color: 'hsl(var(--chart-4))',
  },
  SAUDE: {
    key: 'SAUDE',
    label: 'Saúde',
    icon: Icons.HeartPulse,
    color: 'hsl(var(--chart-5))',
  },
  EDUCACAO: {
    key: 'EDUCACAO',
    label: 'Educação',
    icon: Icons.BookOpenText,
    color: 'hsl(var(--chart-1))', // Re-use colors or add more chart variables
  },
  OUTROS: {
    key: 'OUTROS',
    label: 'Outros',
    icon: Icons.CircleDollarSign,
    color: 'hsl(var(--muted-foreground))',
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export const getCategory = (key: CategoryKey): Category | undefined => CATEGORIES[key];
