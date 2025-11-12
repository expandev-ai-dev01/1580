import { z } from 'zod';

export const taskCreateFormSchema = z.object({
  title: z
    .string({ message: 'O título é obrigatório' })
    .trim()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres'),
  description: z.string().max(1000, 'A descrição não pode exceder 1000 caracteres').optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: 'A data de vencimento não pode ser no passado',
      }
    ),
  priority: z.enum(['baixa', 'media', 'alta']),
});

export type TaskCreateFormValues = z.infer<typeof taskCreateFormSchema>;
