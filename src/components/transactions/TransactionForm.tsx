'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn, formatDate } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { CATEGORIES, CATEGORY_KEYS, getCategory } from '@/config/categories';
import type { TransactionFormData, CategoryKey } from '@/types';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useToast } from '@/hooks/use-toast';
import { suggestTransactionCategory } from '@/ai/flows/suggest-transaction-category';
import { useMutation } from '@tanstack/react-query';


const transactionFormSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória."),
  amount: z.coerce.number().positive("Valor deve ser positivo."),
  date: z.date({ required_error: "Data é obrigatória." }),
  type: z.enum(['income', 'expense'], { required_error: "Tipo é obrigatório." }),
  category: z.enum(CATEGORY_KEYS, { required_error: "Categoria é obrigatória." }),
});

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date(),
      type: 'expense',
      category: undefined, // Let user pick or use suggestion
    },
  });

  const { mutate: suggestCategory, isPending: isSuggestingCategory } = useMutation({
    mutationFn: async (description: string) => {
      return suggestTransactionCategory({ description });
    },
    onSuccess: (data) => {
      if (data?.category) {
        const validCategoryKey = CATEGORY_KEYS.find(key => key === data.category.toUpperCase());
        if (validCategoryKey) {
          form.setValue('category', validCategoryKey);
          toast({ title: "Categoria Sugerida", description: `Categoria: ${getCategory(validCategoryKey)?.label}. Razão: ${data.reason}` });
        } else {
          form.setValue('category', 'OUTROS'); // Fallback
           toast({ variant: "default", title: "Sugestão Aplicada Parcialmente", description: `Categoria sugerida "${data.category}" não é padrão, usando "Outros". Razão: ${data.reason}` });
        }
      }
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Falha na Sugestão", description: error.message });
    }
  });

  const handleSuggestCategory = () => {
    const description = form.getValues('description');
    if (description && description.trim() !== '') {
      suggestCategory(description);
    } else {
      toast({ variant: "destructive", title: "Descrição Ausente", description: "Por favor, insira uma descrição para obter uma sugestão de categoria." });
    }
  };

  function onSubmit(data: TransactionFormData) {
    addTransaction(data);
    toast({
      title: "Transação Adicionada!",
      description: `${data.type === 'income' ? 'Receita' : 'Despesa'} de ${data.description} adicionada com sucesso.`,
      variant: "default"
    });
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Compras no supermercado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <Icons.CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Despesa</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Receita</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <div className="flex items-center gap-2">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORY_KEYS.map((key) => {
                      const category = CATEGORIES[key];
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <category.icon className="mr-2 h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSuggestCategory}
                  disabled={isSuggestingCategory}
                  title="Sugerir Categoria (IA)"
                >
                  {isSuggestingCategory ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Icons.Lightbulb className="h-4 w-4" />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isSuggestingCategory}>
          {form.formState.isSubmitting ? <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Adicionar Transação
        </Button>
      </form>
    </Form>
  );
}
