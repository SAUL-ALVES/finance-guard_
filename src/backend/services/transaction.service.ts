// backend/services/transaction.service.ts
import { StorageService } from './storage.service';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  userId: string; // Para associar ao usuário logado
}

export class TransactionService {
  static getTransactions(userId: string): Transaction[] {
    return StorageService.readData<Transaction[]>('transactions.json')?.filter(
      t => t.userId === userId
    ) || [];
  }

  static addTransaction(transaction: Omit<Transaction, 'id'>): boolean {
    const transactions = StorageService.readData<Transaction[]>('transactions.json') || [];
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    transactions.push(newTransaction);
    return StorageService.writeData('transactions.json', transactions);
  }
}