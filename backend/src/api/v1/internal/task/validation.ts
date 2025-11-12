import { z } from 'zod';

export const taskCreateSchema = z.object({
  title: z
    .string({
      required_error: 'O título da tarefa é obrigatório',
    })
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres'),
  description: z
    .string()
    .max(1000, 'A descrição не pode exceder 1000 caracteres')
    .optional()
    .nullable(),
  dueDate: z
    .string()
    .datetime('A data de vencimento deve estar no formato ISO 8601')
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true; // Allow null or undefined
        const dueDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only
        return dueDate >= today;
      },
      {
        message: 'A data de vencimento não pode ser no passado',
      }
    ),
  priority: z.enum(['baixa', 'media', 'alta']).optional().nullable(),
});
