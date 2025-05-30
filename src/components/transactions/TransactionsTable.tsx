
'use client';

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import type { Transaction, CategoryKey } from "@/types";
import { CATEGORIES, CATEGORY_KEYS } from "@/config/categories";
import { getColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/contexts/TransactionsContext";

export function TransactionsTable() {
  const { transactions, loading } = useTransactions();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const openEditSheet = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    console.log("Editing transaction:", transaction);
  };
  
  const columns = useMemo(() => getColumns(openEditSheet), []);

  const table = useReactTable({
    data: transactions, // This will be updated by filteredTransactions logic
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [filterCategory, setFilterCategory] = useState<CategoryKey | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');


  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filterStartDate) {
      filtered = filtered.filter(t => new Date(t.date) >= filterStartDate);
    }
    if (filterEndDate) {
      const inclusiveEndDate = new Date(filterEndDate);
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
      filtered = filtered.filter(t => new Date(t.date) < inclusiveEndDate);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    return filtered;
  }, [transactions, filterStartDate, filterEndDate, filterCategory, filterType]);
  
  // Update table data when filters change
  // IMPORTANT: The table's data prop is implicitly updated because `useReactTable`
  // re-runs its internal logic when its `data` option changes.
  // We pass `filteredTransactions` to `table.options.data` to make this explicit.
  React.useEffect(() => {
    table.options.data = filteredTransactions;
  }, [filteredTransactions, table]);


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 p-4">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
                <TableRow>
                  {columns.map((column, j) => (
                    <TableHead key={j}><Skeleton className="h-5 w-full" /></TableHead>
                  ))}
                </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-card">
        <Input
          placeholder="Buscar em todas as colunas..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm w-full md:w-auto text-sm"
        />
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto text-sm">
                        <Icons.CalendarDays className="mr-2 h-4 w-4" />
                        {filterStartDate ? formatDate(filterStartDate) : "Data Início"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={filterStartDate} onSelect={setFilterStartDate} initialFocus />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto text-sm">
                        <Icons.CalendarDays className="mr-2 h-4 w-4" />
                        {filterEndDate ? formatDate(filterEndDate) : "Data Fim"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={filterEndDate} onSelect={setFilterEndDate} initialFocus />
                </PopoverContent>
            </Popover>
             <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as CategoryKey | 'all')}>
                <SelectTrigger className="w-full sm:w-auto text-sm">
                    <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {CATEGORY_KEYS.map(key => (
                        <SelectItem key={key} value={key}>{CATEGORIES[key].label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'income' | 'expense')}>
                <SelectTrigger className="w-full sm:w-auto text-sm">
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos Tipos</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {" "}
          {table.getPageCount() > 0 ? table.getPageCount() : 1}
        </div>
        <div className="space-x-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Anterior
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Próximo
            </Button>
        </div>
      </div>
    </div>
  );
}

    