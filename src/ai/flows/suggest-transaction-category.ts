// src/ai/flows/suggest-transaction-category.ts
'use server';

/**
 * @fileOverview Suggests transaction categories based on the transaction description.
 *
 * - suggestTransactionCategory - A function that suggests transaction categories.
 * - SuggestTransactionCategoryInput - The input type for the suggestTransactionCategory function.
 * - SuggestTransactionCategoryOutput - The return type for the suggestTransactionCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoryInputSchema = z.object({
  description: z.string().describe('The description of the transaction.'),
});

export type SuggestTransactionCategoryInput = z.infer<
  typeof SuggestTransactionCategoryInputSchema
>;

const SuggestTransactionCategoryOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The suggested category for the transaction, chosen from a predefined list of categories such as ALIMENTACAO, TRANSPORTE, LAZER, MORADIA, SAUDE, EDUCACAO, OUTROS.'
    ),
  reason: z.string().describe('The reason for suggesting this category.'),
});

export type SuggestTransactionCategoryOutput = z.infer<
  typeof SuggestTransactionCategoryOutputSchema
>;

export async function suggestTransactionCategory(
  input: SuggestTransactionCategoryInput
): Promise<SuggestTransactionCategoryOutput> {
  return suggestTransactionCategoryFlow(input);
}

const suggestCategoryPrompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: {schema: SuggestTransactionCategoryInputSchema},
  output: {schema: SuggestTransactionCategoryOutputSchema},
  prompt: `You are a personal finance expert. Based on the transaction description provided, suggest the most appropriate category for the transaction.

  The category should be chosen from a predefined list of categories: ALIMENTACAO, TRANSPORTE, LAZER, MORADIA, SAUDE, EDUCACAO, OUTROS.

  Provide a brief reason for your suggestion.

  Transaction Description: {{{description}}}`,
});

const suggestTransactionCategoryFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoryFlow',
    inputSchema: SuggestTransactionCategoryInputSchema,
    outputSchema: SuggestTransactionCategoryOutputSchema,
  },
  async input => {
    const {output} = await suggestCategoryPrompt(input);
    return output!;
  }
);
