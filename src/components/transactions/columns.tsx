'use client';

import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ArrowUpDown } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/contexts/TransactionsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

export const getColumns = (openEditSheet: (transaction: Transaction) => void): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatDate(new Date(row.getValue("date"))),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const categoryKey = row.getValue("category") as Transaction["category"];
      const category = CATEGORIES[categoryKey];
      if (!category) return categoryKey;
      const CategoryIcon = category.icon;
      return (
        <div className="flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
          {category.label}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as Transaction["type"];
      return (
        <Badge variant={type === 'income' ? 'default' : 'destructive'} className={type === 'income' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30'}>
          {type === 'income' ? 'Receita' : 'Despesa'}
        </Badge>
      );
    },
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-mr-4"
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type") as Transaction["type"];
      const formatted = formatCurrency(amount);
      return <div className={`text-right font-medium ${type === 'expense' ? 'text-destructive' : 'text-primary'}`}>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      const { deleteTransaction } = useTransactions();
      const { toast } = useToast();

      const handleDelete = () => {
        deleteTransaction(transaction.id);
        toast({ title: "Transação Excluída", description: `${transaction.description} foi excluída.` });
      };

      return (
        <div className="flex justify-end items-center space-x-1">
          {/* <Button variant="ghost" size="icon" onClick={() => openEditSheet(transaction)} title="Editar">
            <Icons.Edit className="h-4 w-4" />
          </Button> */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Excluir">
                <Icons.Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a transação "{transaction.description}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
