export type CategoryKey = 'ALIMENTACAO' | 'TRANSPORTE' | 'LAZER' | 'MORADIA' | 'SAUDE' | 'EDUCACAO' | 'OUTROS';

export interface Category {
  key: CategoryKey;
  label: string;
  icon: React.ElementType;
  color?: string; 
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  category: CategoryKey;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  category: CategoryKey;
}
